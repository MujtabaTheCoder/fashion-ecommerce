import { NextRequest, NextResponse } from "next/server";
import { orderLookupRateLimiter } from "@/lib/security/rateLimit";
import { getPublicSupabaseClient } from "@/lib/supabase/public";
import { dbCircuitBreaker } from "@/lib/cache/circuitBreaker";
import { globalCache } from "@/lib/cache/inMemoryCache";

export async function POST(req: NextRequest) {
  // 1. IP / Identifier Rate Limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous";

  const rateCheck = orderLookupRateLimiter.check(ip);
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Too many lookup attempts. Please retry in a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateCheck.resetMs / 1000).toString(),
        },
      },
    );
  }

  // 2. Validate payload
  try {
    const body = await req.json();
    const { orderNumber, phoneOrEmail } = body as {
      orderNumber?: string;
      phoneOrEmail?: string;
    };

    if (!orderNumber || !phoneOrEmail) {
      return NextResponse.json(
        { error: "Both order number and contact detail are required." },
        { status: 400 },
      );
    }

    const cleanNumber = orderNumber.trim().toUpperCase().replace(/^#/, "");
    const cleanContact = phoneOrEmail.trim().toLowerCase();

    // 3. In-Memory Micro-Cache check
    const cacheKey = `order:lookup:${cleanNumber}:${cleanContact}`;
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "private, max-age=10, stale-while-revalidate=30",
        },
      });
    }

    // 4. Query via Circuit Breaker
    const orderData = await dbCircuitBreaker.execute(
      async () => {
        const supabase = getPublicSupabaseClient();
        if (!supabase) return null;

        // Strict column selection matching Database['public']['Tables']['orders']
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            id,
            order_number,
            status,
            fulfillment_status,
            total_cents,
            created_at,
            email,
            shipping_address,
            order_items (
              id,
              quantity,
              unit_price_cents
            )
          `,
          )
          .eq("order_number", `#${cleanNumber}`)
          .maybeSingle();

        if (error || !data) return null;

        // Verify contact matches to prevent unauthenticated enumeration
        const matchesEmail = data.email?.toLowerCase().includes(cleanContact);

        if (!matchesEmail && cleanContact.length > 0) {
          // If phone was provided or contact did not match email, reject
          return null;
        }

        // Mask contact info for privacy
        const masked = {
          id: data.id,
          order_number: data.order_number,
          status: data.status,
          fulfillment_status: data.fulfillment_status,
          total_cents: data.total_cents,
          created_at: data.created_at,
          shipping_address: data.shipping_address,
          email: data.email
            ? data.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
            : null,
          items: data.order_items || [],
        };

        return masked;
      },
      () => null,
    );

    if (!orderData) {
      return NextResponse.json(
        { error: "No matching order found. Please verify your reference number and contact info." },
        { status: 404 },
      );
    }

    // Cache valid lookup for 15s to absorb immediate refresh spam
    globalCache.set(cacheKey, orderData, 15_000, 60_000);

    return NextResponse.json(orderData, {
      headers: {
        "Cache-Control": "private, max-age=15, stale-while-revalidate=60",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Malformed request body." },
      { status: 400 },
    );
  }
}
