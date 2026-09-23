"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { formatMoney } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD_CENTS = 50000; // $500

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotalCents, itemCount } =
    useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  if (!isOpen) return null;

  const freeShippingProgress = Math.min(
    100,
    (subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100,
  );
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents);

  const discountAmountCents = discountApplied ? Math.round(subtotalCents * 0.15) : 0;
  const finalTotalCents = subtotalCents - discountAmountCents;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "ATELIER15" || promoCode.trim().toUpperCase() === "VIP3D") {
      setDiscountApplied(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside aria-label="Shopping Cart" className="flex w-screen max-w-md flex-col bg-surface text-ink shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-accent" />
              <h2 className="text-base font-medium tracking-wide uppercase">
                Your Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="rounded-full p-2 text-muted hover:bg-background hover:text-ink transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="border-b border-border bg-background/50 px-6 py-3.5">
            <div className="flex items-center justify-between text-xs">
              {remainingForFreeShipping > 0 ? (
                <span className="text-muted">
                  Add{" "}
                  <strong className="text-ink">
                    {formatMoney(remainingForFreeShipping)}
                  </strong>{" "}
                  more for <strong className="text-amber-700">Complimentary Global Shipping</strong>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 font-medium text-emerald-800">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  Unlocked Complimentary White-Glove Shipping!
                </span>
              )}
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <div className="rounded-full bg-background p-6 text-muted">
                  <ShoppingBag className="h-10 w-10 stroke-[1.2]" />
                </div>
                <h3 className="mt-4 text-base font-medium">Your shopping bag is empty</h3>
                <p className="mt-2 text-xs text-muted max-w-[240px]">
                  Explore our curated 3D collection and fine couture pieces.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-xs font-medium tracking-wider text-background uppercase transition-transform hover:scale-105"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`} className="py-4 flex gap-4">
                  {/* Image */}
                  <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-border border border-border">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0].src}
                        alt={item.product.images[0].alt}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-background text-[10px] text-muted">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={closeCart}
                          className="text-sm font-medium hover:underline line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() =>
                            removeItem(item.product.id, item.selectedColor, item.selectedSize)
                          }
                          className="text-muted hover:text-danger ml-2 p-0.5"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-1 flex gap-2 text-xs text-muted">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span>· Size: {item.selectedSize}</span>}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity switcher */}
                      <div className="flex items-center rounded-full border border-border bg-background">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedColor,
                              item.selectedSize,
                            )
                          }
                          className="p-1.5 text-muted hover:text-ink"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedColor,
                              item.selectedSize,
                            )
                          }
                          className="p-1.5 text-muted hover:text-ink"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-sm font-medium">
                        {formatMoney(item.product.priceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals */}
          {items.length > 0 && (
            <div className="border-t border-border bg-surface px-6 py-5">
              {/* Promo code input */}
              <form onSubmit={handleApplyPromo} className="mb-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (Try VIP3D or ATELIER15)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink"
                />
                <button
                  type="submit"
                  className="rounded-md bg-accent px-4 py-2 text-xs font-medium text-on-accent uppercase tracking-wider hover:bg-accent-hover"
                >
                  Apply
                </button>
              </form>

              {discountApplied && (
                <div className="mb-3 flex justify-between text-xs text-emerald-800">
                  <span>VIP Special Discount (15%)</span>
                  <span>-{formatMoney(discountAmountCents)}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-muted mb-1.5">
                <span>Shipping</span>
                <span>
                  {remainingForFreeShipping <= 0 ? "Complimentary" : "Calculated at checkout"}
                </span>
              </div>

              <div className="flex justify-between text-base font-medium text-ink pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatMoney(finalTotalCents)}</span>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-transform hover:scale-[1.02]"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                <span>Encrypted 256-Bit SSL Checkout · 30-Day Returns</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
