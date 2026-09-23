"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  Banknote,
  Building2,
  Apple,
  ShieldCheck,
  Lock,
  Truck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { useOrders } from "@/lib/orders/OrderContext";
import { formatMoney } from "@/lib/utils";
import confetti from "canvas-confetti";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotalCents, clearCart } = useCart();
  const { createOrder } = useOrders();

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "bank" | "applepay">("card");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express" | "vip">("standard");

  // Customer details state
  const [formData, setFormData] = useState({
    fullName: "Syed Hamza Ali",
    email: "hamza.ali@atelier.pk",
    phone: "+92 300 8472910",
    address: "House 42, Block C3, Gulberg III",
    city: "Lahore",
    postalCode: "54600",
    country: "Pakistan 🇵🇰",
  });

  // Card details state
  const [cardData, setCardData] = useState({
    cardNumber: "4532 8921 4432 9910",
    cardHolder: "SYED HAMZA ALI",
    expiry: "09/28",
    cvv: "882",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate pricing
  const isFreeShipping = subtotalCents >= 50000;
  const shippingFeeCents =
    shippingMethod === "vip" ? 3500 : shippingMethod === "express" ? 2000 : isFreeShipping ? 0 : 1500;

  const totalCents = subtotalCents + shippingFeeCents;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);

    setTimeout(async () => {
      const orderItems = items.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        size: item.selectedSize || "Standard",
        price: (item.product.priceCents * item.quantity) / 10,
      }));

      const order = await createOrder({
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
        totalAmount: totalCents / 10,
        items: orderItems,
        paymentMethod,
      });

      clearCart();
      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#dfb15b", "#1a1816", "#10b981"],
        });
      } catch {
        // ignore
      }

      const cleanNum = order.orderNumber.replace("#", "");
      router.push(`/track-order/${cleanNum}`);
    }, 900);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="font-display text-2xl text-ink">Your shopping bag is empty</h2>
        <p className="mt-2 text-xs text-muted">Please select creations before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="mt-6 rounded-full bg-ink px-8 py-3 text-xs font-semibold uppercase tracking-wider text-background"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 gap-12 lg:grid-cols-12">
      {/* Left Columns: Delivery & Payment Details (7 cols) */}
      <div className="lg:col-span-7 space-y-8">
        {/* Step 1: Customer Contact & Delivery Address */}
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-background">
              1
            </span>
            <h2 className="font-display text-lg font-medium text-ink">Shipping & Client Details</h2>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Full Name
              </label>
              <input
                type="text"
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-ink"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Email Address
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-ink"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Contact Phone
              </label>
              <input
                type="tel"
                required
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-ink"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Street Address / Suite
              </label>
              <input
                type="text"
                required
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-ink"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                City / Province
              </label>
              <input
                type="text"
                required
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-ink"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Postal Code
              </label>
              <input
                type="text"
                required
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-ink"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Shipping Speed */}
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-background">
              2
            </span>
            <h2 className="font-display text-lg font-medium text-ink">Delivery Method</h2>
          </div>

          <div className="mt-6 space-y-3">
            {[
              {
                id: "standard",
                title: "Complimentary Insured Courier",
                desc: "3-5 business days · Signature required",
                price: isFreeShipping ? "FREE" : "$15.00",
              },
              {
                id: "express",
                title: "Express Priority Air Courier",
                desc: "1-2 business days · Priority handling",
                price: "$20.00",
              },
              {
                id: "vip",
                title: "White-Glove Atelier VIP Concierge",
                desc: "Next morning private delivery in bespoke cedar box",
                price: "$35.00",
              },
            ].map((method) => (
              <label
                key={method.id}
                onClick={() => setShippingMethod(method.id as any)}
                className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                  shippingMethod === method.id
                    ? "border-ink bg-background ring-1 ring-ink"
                    : "border-border bg-surface hover:border-ink/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === method.id}
                    onChange={() => {}}
                    className="accent-ink"
                  />
                  <div>
                    <p className="text-xs font-semibold text-ink">{method.title}</p>
                    <p className="text-[11px] text-muted">{method.desc}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-ink">{method.price}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 3: Payment Method with 3D Card Simulator */}
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-background">
              3
            </span>
            <h2 className="font-display text-lg font-medium text-ink">Payment Gateway</h2>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "card", label: "Credit Card", icon: CreditCard },
              { id: "applepay", label: "Apple / Google Pay", icon: Apple },
              { id: "cod", label: "Cash on Delivery", icon: Banknote },
              { id: "bank", label: "Bank Wire", icon: Building2 },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPaymentMethod(p.id as any)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all ${
                    paymentMethod === p.id
                      ? "border-ink bg-ink text-background shadow-sm"
                      : "border-border bg-background text-ink hover:border-ink"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[11px] font-semibold text-center">{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* If Credit Card selected, render simulated 3D Card */}
          {paymentMethod === "card" && (
            <div className="mt-6 space-y-4">
              {/* 3D Black Luxury Obsidian Card */}
              <div className="relative mx-auto aspect-[1.58/1] w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-tr from-[#151515] via-[#242424] to-[#111111] p-6 text-white shadow-2xl border border-white/10">
                <div className="flex justify-between items-start">
                  <span className="font-display text-sm tracking-widest text-amber-300">
                    ATELIER VIP PLATINUM
                  </span>
                  <div className="flex h-7 w-10 items-center justify-center rounded-md bg-amber-400/20 border border-amber-400/40 text-[10px] font-bold text-amber-300">
                    CHIP
                  </div>
                </div>

                <div className="mt-6">
                  <p className="font-mono text-base sm:text-lg tracking-widest text-white/90">
                    {cardData.cardNumber}
                  </p>
                </div>

                <div className="mt-6 flex justify-between items-end text-xs">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-white/50">Card Holder</p>
                    <p className="font-medium tracking-wider">{cardData.cardHolder}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-white/50">Expires</p>
                    <p className="font-mono">{cardData.expiry}</p>
                  </div>
                </div>
              </div>

              {/* Card Inputs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="col-span-2">
                  <label className="text-[11px] font-semibold uppercase text-muted">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-ink"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase text-muted">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-ink"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase text-muted">
                    CVV / CVC
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-ink"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "cod" && (
            <div className="mt-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-900">
              <strong>Cash on Delivery:</strong> Pay securely in cash upon white-glove arrival. Please ensure exact change or local currency.
            </div>
          )}

          {paymentMethod === "bank" && (
            <div className="mt-4 rounded-2xl bg-surface border border-border p-4 text-xs space-y-1 text-muted">
              <p className="font-semibold text-ink">Atelier Private Banking Transfer:</p>
              <p>IBAN: <strong>CH93 0076 2011 6238 5291 0</strong></p>
              <p>BIC/SWIFT: <strong>UBSWCHZH80A</strong></p>
              <p>Bank: UBS Switzerland AG, Zurich</p>
            </div>
          )}

          {paymentMethod === "applepay" && (
            <div className="mt-4 rounded-2xl bg-ink text-background p-4 text-xs text-center font-medium">
              ✦ Biometric Instant Pay activated via Touch ID / Face ID
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Order Summary (5 cols) */}
      <div className="lg:col-span-5">
        <div className="sticky top-28 rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-lg">
          <h3 className="font-display text-xl font-normal text-ink">Order Summary ({items.length})</h3>

          {/* Cart Items List */}
          <div className="mt-6 max-h-72 overflow-y-auto divide-y divide-border pr-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 py-3">
                <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-border">
                  {item.product.images[0] && (
                    <Image
                      src={item.product.images[0].src}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="60px"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-ink line-clamp-1">{item.product.name}</p>
                  <p className="text-[11px] text-muted">
                    Qty: {item.quantity} · {item.selectedColor || "Standard"}
                  </p>
                </div>
                <span className="text-xs font-medium text-ink">
                  {formatMoney(item.product.priceCents * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 space-y-2.5 border-t border-border pt-5 text-xs text-muted">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-ink">{formatMoney(subtotalCents)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-medium text-ink">
                {shippingFeeCents === 0 ? "Complimentary" : formatMoney(shippingFeeCents)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Customs & Taxes</span>
              <span className="font-medium text-ink">Included</span>
            </div>
            <div className="flex justify-between border-t border-border pt-4 text-base font-medium text-ink">
              <span>Total Due</span>
              <span className="text-lg text-ink font-semibold">{formatMoney(totalCents)}</span>
            </div>
          </div>

          {/* Complete Order Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.18em] text-background shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authorizing Secured Transaction...</span>
            ) : (
              <>
                <span>Confirm & Place Order ({formatMoney(totalCents)})</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-muted">
            <Lock className="h-3.5 w-3.5 text-emerald-700" />
            <span>256-Bit Encrypted Secure Checkout · Instant Confirmation</span>
          </div>
        </div>
      </div>
    </form>
  );
}
