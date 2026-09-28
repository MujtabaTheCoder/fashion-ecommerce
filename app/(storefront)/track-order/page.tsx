"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Package, PhoneCall, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useOrders } from "@/lib/orders/OrderContext";

export default function TrackOrderLookupPage() {
  const router = useRouter();
  const { lookupOrder, orders } = useOrders();

  const [orderNumber, setOrderNumber] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSearching(true);

    // 1. Fast local session lookup
    const localMatch = lookupOrder(orderNumber, phoneOrEmail);
    if (localMatch) {
      setIsSearching(false);
      const cleanNum = localMatch.orderNumber.replace(/^#/, "");
      router.push(`/track-order/${cleanNum}`);
      return;
    }

    // 2. High-performance Edge API lookup with rate limiting
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, phoneOrEmail }),
      });

      const data = await res.json();
      setIsSearching(false);

      if (res.ok && data?.order_number) {
        const cleanNum = data.order_number.replace(/^#/, "");
        router.push(`/track-order/${cleanNum}`);
      } else {
        setErrorMsg(
          data?.error ||
            `No order found matching "${orderNumber}". Please verify your order confirmation reference.`,
        );
      }
    } catch {
      setIsSearching(false);
      setErrorMsg("Network error. Please try again in a few moments.");
    }
  };

  return (
    <div className="py-16 md:py-24 bg-background min-h-[80vh]">
      <Container className="max-w-3xl">
        {/* Header Badge */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Live Atelier Order Intelligence
          </div>
          <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-ink sm:text-5xl">
            Track Your Order
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-muted max-w-lg mx-auto">
            Enter your Order Number and registered Phone or Email address to inspect real-time tailoring status, courier tracking, and dispatch updates.
          </p>
        </div>

        {/* Lookup Card Form */}
        <div className="mt-10 rounded-3xl border border-border/80 bg-surface p-6 sm:p-10 shadow-lg">
          <form onSubmit={handleLookupSubmit} className="space-y-6">
            <div>
              <label htmlFor="orderNumberInput" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Order Reference Number
              </label>
              <div className="relative mt-2">
                <input
                  id="orderNumberInput"
                  type="text"
                  required
                  placeholder="e.g. #ORD-8921 or ORD-8921"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-ink"
                />
                <Package className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/50" />
              </div>
            </div>

            <div>
              <label htmlFor="phoneOrEmailInput" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Contact Phone or Email Address
              </label>
              <div className="relative mt-2">
                <input
                  id="phoneOrEmailInput"
                  type="text"
                  required
                  placeholder="e.g. +92 300 8472910 or client@atelier.pk"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-ink"
                />
                <PhoneCall className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/50" />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSearching}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-xs font-bold uppercase tracking-[0.2em] text-background shadow-md transition-all hover:scale-[1.01] hover:bg-black disabled:opacity-50"
            >
              {isSearching ? (
                <span>Retrieving Dossier...</span>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Inspect Order Live</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Shortcuts if available */}
          {orders.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted block mb-3">
                Recent Orders in Session:
              </span>
              <div className="flex flex-wrap gap-2">
                {orders.slice(0, 3).map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      setOrderNumber(o.orderNumber);
                      setPhoneOrEmail(o.customerPhone || o.customerEmail);
                    }}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-mono font-semibold text-ink hover:border-ink"
                  >
                    <span>{o.orderNumber}</span>
                    <span className="text-[9px] text-muted">({o.customerPhone})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Security Assurance */}
        <div className="mt-10 flex items-center justify-center gap-6 text-center text-xs text-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Encrypted Real-Time Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-amber-600" />
            <span>White-Glove Courier Inspection</span>
          </div>
        </div>
      </Container>
    </div>
  );
}
