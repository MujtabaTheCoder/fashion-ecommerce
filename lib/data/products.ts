import { createClient } from "@/lib/supabase/server";
import { resolveProductImageUrl } from "@/lib/products/media";
import type { ProductCardData } from "@/types";
import { MOCK_PRODUCTS, type DetailedProduct } from "./mockProducts";

type ProductListRow = {
  id: string;
  slug: string;
  name: string;
  product_images: Array<{
    storage_path: string;
    alt: string;
    is_primary: boolean;
    sort_order: number;
  }> | null;
  product_variants: Array<{
    price_cents: number;
    compare_at_cents: number | null;
    is_active: boolean;
  }> | null;
};

function toProductCard(row: ProductListRow): ProductCardData {
  const images = [...(row.product_images ?? [])].sort((a, b) => {
    if (a.is_primary !== b.is_primary) {
      return a.is_primary ? -1 : 1;
    }
    return a.sort_order - b.sort_order;
  });
  const primary = images[0];

  const activeVariants = (row.product_variants ?? []).filter(
    (variant) => variant.is_active,
  );
  const priced = (activeVariants.length > 0 ? activeVariants : row.product_variants ?? [])
    .slice()
    .sort((a, b) => a.price_cents - b.price_cents);
  const cheapest = priced[0];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    priceCents: cheapest?.price_cents ?? null,
    compareAtCents: cheapest?.compare_at_cents ?? null,
    image: primary
      ? {
          src: resolveProductImageUrl(primary.storage_path),
          alt: primary.alt || row.name,
        }
      : null,
  };
}

export function detailedToProductCard(p: DetailedProduct): ProductCardData {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    image: p.images[0] ? { src: p.images[0].src, alt: p.images[0].alt } : null,
  };
}

export async function listPublishedProducts(): Promise<ProductCardData[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id,
        slug,
        name,
        product_images ( storage_path, alt, is_primary, sort_order ),
        product_variants ( price_cents, compare_at_cents, is_active )
      `,
      )
      .eq("status", "published")
      .order("name", { ascending: true });

    if (!error && data && data.length > 0) {
      return (data as ProductListRow[]).map(toProductCard);
    }
  } catch {
    // Fall back gracefully to mock catalog
  }

  return MOCK_PRODUCTS.map(detailedToProductCard);
}

export async function getProductBySlug(slug: string): Promise<DetailedProduct | null> {
  const match = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (match) return match;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (data) {
      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        subtitle: data.description?.slice(0, 60) || "Haute Couture Piece",
        category: "women",
        categoryLabel: "Collection",
        priceCents: 45000,
        compareAtCents: null,
        rating: 4.9,
        reviewsCount: 12,
        images: [
          {
            src: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop",
            alt: data.name,
          },
        ],
        description: data.description || "Architectural silhouette crafted with pure intention.",
        material: data.material || "100% Fine Fabric",
        careInstructions: data.care_instructions || "Dry clean only.",
        details: ["Hand finished details", "Editorial tailoring"],
        colors: [{ name: "Default", hex: "#111111" }],
        sizes: ["XS", "S", "M", "L"],
        model3dType: "ring",
        inStock: true,
        isFeatured: true,
      };
    }
  } catch {
    // No-op
  }

  return null;
}
