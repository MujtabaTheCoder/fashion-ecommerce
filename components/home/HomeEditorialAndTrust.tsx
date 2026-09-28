"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Truck, RefreshCw, Award, ArrowRight, Check } from "lucide-react";

export function HomeEditorialAndTrust() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      import("canvas-confetti")
        .then((module) => {
          const confetti = module.default ?? module;
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.8 },
            colors: ["#dfb15b", "#1a1816"],
          });
        })
        .catch(() => {});
    }
  };

  return (
    <>
      {/* Brand Pillars & Trust Badges */}
      <section className="border-b border-border bg-background py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-border bg-surface p-3.5 shadow-xs text-ink">
                <Truck className="h-6 w-6 stroke-[1.4]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-ink">
                  White-Glove Delivery
                </h4>
                <p className="mt-1 text-xs text-muted">
                  Insured global courier with tamper-evident bespoke packaging.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-border bg-surface p-3.5 shadow-xs text-ink">
                <Award className="h-6 w-6 stroke-[1.4]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-ink">
                  Artisanal Provenance
                </h4>
                <p className="mt-1 text-xs text-muted">
                  Woven in historic Italian mills & cast in conflict-free gold.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-border bg-surface p-3.5 shadow-xs text-ink">
                <RefreshCw className="h-6 w-6 stroke-[1.4]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-ink">
                  30-Day Atelier Return
                </h4>
                <p className="mt-1 text-xs text-muted">
                  Complimentary doorstep returns and effortless exchanges.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-border bg-surface p-3.5 shadow-xs text-ink">
                <ShieldCheck className="h-6 w-6 stroke-[1.4]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-ink">
                  Lifetime Authenticity
                </h4>
                <p className="mt-1 text-xs text-muted">
                  Every creation carries a serialized hallmark & certificate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Story Section */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Editorial Imagery Collage */}
            <div className="relative">
              <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-3xl border border-border shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
                  alt="Haute couture editorial model in high tailoring"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, 90vw"
                />
              </div>

              {/* Floating Second Image */}
              <div className="absolute -bottom-8 -right-4 md:-right-8 aspect-[4/5] w-56 md:w-64 overflow-hidden rounded-2xl border-4 border-surface shadow-2xl hidden sm:block">
                <Image
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
                  alt="Close up fine Italian textile texture"
                  fill
                  className="object-cover"
                  sizes="260px"
                />
              </div>

              {/* 3D Floating Badge */}
              <div className="absolute top-8 -left-4 rounded-2xl border border-white/20 bg-black/80 px-4 py-3 text-white shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-200">
                    Handmade in Florence & Biella
                  </span>
                </div>
              </div>
            </div>

            {/* Story Text */}
            <div className="lg:pl-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                The Maison Philosophy
              </p>
              <h2 className="mt-4 font-display text-3xl font-normal leading-tight text-ink sm:text-4xl md:text-5xl">
                Quiet luxury cut for permanent relevance, not fleeting seasons.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                Founded with a deliberate refusal to participate in the cycle of disposable fashion, ATELIER creates timeless wardrobe pillars engineered with architectural precision.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                From raw Mongolian cashmere combed only during springtime molt to French box calfskin hand-stitched on traditional wooden lasts, each piece is built to mature gracefully alongside you.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-transform hover:scale-105"
                >
                  <span>Our Craft & Heritage</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink hover:border-ink"
                >
                  View Lookbook
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Atelier Newsletter */}
      <section className="border-t border-border bg-gradient-to-b from-background to-surface py-20 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            Private Invitation
          </div>

          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Join the Atelier Guild
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-muted">
            Receive private access to limited capsule releases, bespoke 3D preview events, and 15% privilege on your debut order with code <strong className="text-ink">VIP3D</strong>.
          </p>

          {subscribed ? (
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-6 py-3 text-xs font-semibold text-emerald-800">
              <Check className="h-4 w-4 text-emerald-600" />
              Thank you for subscribing! Use promo code <strong>VIP3D</strong> at checkout.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your private email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full border border-border bg-surface px-5 py-3.5 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ink"
              />
              <button
                type="submit"
                className="rounded-full bg-ink px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-transform hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
