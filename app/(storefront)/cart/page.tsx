"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading, Text } from "@/components/ui/Typography";
import { useCart } from "@/lib/cart/CartContext";
import { formatMoney } from "@/lib/utils";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

const FREE_SHIPPING_THRESHOLD_CENTS = 50000;

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotalCents, itemCount } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const freeShippingProgress = Math.min(
    100,
    (subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100,
  );
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents);

  const discountAmountCents = discountApplied ? Math.round(subtotalCents * 0.15) : 0;
  const finalTotalCents = subtotalCents - discountAmountCents;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "VIP3D" || promoCode.trim().toUpperCase() === "ATELIER15") {
      setDiscountApplied(true);
    }
  };

  return (
    <div className="bg-background py-16 md:py-24">
      <Container as="section">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-border pb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Shopping Salon
            </span>
            <Heading as="h1" className="mt-2 font-display text-4xl sm:text-5xl">
              Your Shopping Bag ({itemCount})
            </Heading>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="mt-4 sm:mt-0 text-xs text-muted hover:text-danger underline"
            >
              Clear all items
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="rounded-full bg-surface p-8 text-muted border border-border">
              <ShoppingBag className="h-12 w-12 stroke-[1.2]" />
            </div>
            <h2 className="mt-6 font-display text-2xl">Your bag is currently empty</h2>
            <p className="mt-2 text-sm text-muted max-w-sm">
              Discover our permanent haute collections and 3D interactive atelier pieces.
            </p>
            <Link
              href="/shop"
              className="mt-8 rounded-full bg-ink px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-background transition-transform hover:scale-105"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Bag Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free shipping bar */}
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  {remainingForFreeShipping > 0 ? (
                    <span className="text-muted">
                      Add <strong className="text-ink">{formatMoney(remainingForFreeShipping)}</strong> more for{" "}
                      <strong className="text-amber-800">Complimentary White-Glove Delivery</strong>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 font-medium text-emerald-800">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      Congratulations! You unlocked Complimentary Global Insured Shipping.
                    </span>
                  )}
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-border rounded-2xl border border-border bg-surface px-6">
                {items.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`}
                    className="flex flex-col sm:flex-row gap-6 py-6"
                  >
                    {/* Item Image */}
                    <div className="relative aspect-[4/5] w-28 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-border">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0].src}
                          alt={item.product.images[0].alt}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      ) : null}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                              {item.product.categoryLabel}
                            </span>
                            <h3 className="mt-1 font-display text-lg font-medium text-ink">
                              <Link
                                href={`/product/${item.product.slug}`}
                                className="hover:underline"
                              >
                                {item.product.name}
                              </Link>
                            </h3>
                          </div>
                          <button
                            onClick={() =>
                              removeItem(item.product.id, item.selectedColor, item.selectedSize)
                            }
                            className="text-muted hover:text-danger p-1"
                            title="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-2 flex gap-4 text-xs text-muted">
                          {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        </div>
                      </div>

                      {/* Quantity & Item Subtotal */}
                      <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/50">
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
                            className="p-2 text-muted hover:text-ink"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold">
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
                            className="p-2 text-muted hover:text-ink"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-medium text-ink">
                            {formatMoney(item.product.priceCents * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <p className="text-[11px] text-muted">
                              {formatMoney(item.product.priceCents)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary (4 cols) */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-md">
                <h3 className="font-display text-xl font-normal text-ink">Order Summary</h3>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="mt-6 flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (VIP3D)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-ink px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90"
                  >
                    Apply
                  </button>
                </form>

                {discountApplied && (
                  <div className="mt-3 flex items-center justify-between text-xs font-medium text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    <span>VIP Privilege Code (15%)</span>
                    <span>-{formatMoney(discountAmountCents)}</span>
                  </div>
                )}

                {/* Subtotals breakdown */}
                <div className="mt-6 space-y-3 border-t border-border pt-6 text-xs">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span className="font-medium text-ink">{formatMoney(subtotalCents)}</span>
                  </div>

                  <div className="flex justify-between text-muted">
                    <span>White-Glove Shipping</span>
                    <span className="font-medium text-ink">
                      {remainingForFreeShipping <= 0 ? "Complimentary" : "$25.00"}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted">
                    <span>Estimated Customs & Taxes</span>
                    <span className="font-medium text-ink">Included</span>
                  </div>

                  <div className="flex justify-between border-t border-border pt-4 text-base font-medium text-ink">
                    <span>Total</span>
                    <span>{formatMoney(finalTotalCents)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.18em] text-background shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  <span>Encrypted 256-Bit SSL Checkout · 30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
