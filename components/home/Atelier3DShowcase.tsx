"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Box, Sparkles, Layers, Shield, ArrowRight, Eye, ShoppingBag, Shirt } from "lucide-react";
import { Product3DViewer } from "@/components/3d/Product3DViewer";
import { MOCK_PRODUCTS, type DetailedProduct } from "@/lib/data/mockProducts";
import { useCart } from "@/lib/cart/CartContext";
import { formatMoney } from "@/lib/utils";

export function Atelier3DShowcase() {
  const [selectedSlug, setSelectedSlug] = useState("camel-wool-overcoat");
  const { addItem } = useCart();

  const currentProduct: DetailedProduct =
    MOCK_PRODUCTS.find((p) => p.slug === selectedSlug) ?? MOCK_PRODUCTS[0]!;

  const showcaseProducts = [
    { slug: "camel-wool-overcoat", label: "Virgin Wool Overcoat", type: "Outerwear" },
    { slug: "ivory-silk-shirt", label: "Mulberry Silk Shirt", type: "Silk Shirt" },
    { slug: "unstructured-tailored-blazer", label: "Cashmere Wool Blazer", type: "Suit Blazer" },
    { slug: "sculpted-cashmere-overcoat", label: "Structured Cashmere Coat", type: "Luxury Coat" },
  ];

  return (
    <section id="atelier-3d" className="relative overflow-hidden bg-[#11100e] py-24 text-white md:py-32">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 right-10 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300 backdrop-blur-md">
            <Shirt className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            3D Interactive Outfit Fitting
          </div>
          <h2 className="mt-4 font-display text-3xl font-normal tracking-tight sm:text-4xl md:text-5xl text-white">
            3D Haute Couture Outfit Studio
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">
            Rotate 360°, inspect luxury fabric weaves, preview drape and silhouette, and experience interactive 3D fashion fitting.
          </p>

          {/* Outfit Switcher Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {showcaseProducts.map((item) => (
              <button
                key={item.slug}
                onClick={() => setSelectedSlug(item.slug)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium tracking-wider uppercase transition-all ${
                  selectedSlug === item.slug
                    ? "border border-amber-400 bg-amber-400/20 text-amber-200 shadow-md"
                    : "border border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Visualizer & Details Grid */}
        <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left / Center 3D Interactive Canvas (7 cols) */}
          <div className="lg:col-span-7">
            <Product3DViewer product={currentProduct} />
          </div>

          {/* Right Product Spotlight Info (5 cols) */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:p-8 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between text-xs text-amber-400 uppercase tracking-widest">
                <span>{currentProduct.categoryLabel}</span>
                <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                  {currentProduct.badge || "3D Interactive Outfit"}
                </span>
              </div>

              <h3 className="mt-3 font-display text-2xl font-normal text-white">
                {currentProduct.name}
              </h3>
              <p className="mt-1 text-xs text-white/60">{currentProduct.subtitle}</p>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-semibold text-amber-300">
                  {formatMoney(currentProduct.priceCents)}
                </span>
                {currentProduct.compareAtCents && (
                  <span className="text-sm text-white/40 line-through">
                    {formatMoney(currentProduct.compareAtCents)}
                  </span>
                )}
              </div>

              <p className="mt-4 text-xs leading-relaxed text-white/75">
                {currentProduct.description}
              </p>

              {/* Material Specs */}
              <div className="mt-6 space-y-2.5 rounded-xl border border-white/10 bg-black/40 p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Fabric Composition:</span>
                  <span className="font-medium text-white/90">{currentProduct.material}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Tailoring Craft:</span>
                  <span className="font-medium text-white/90">Bespoke 3D Cut & Stitch</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Delivery Across Pakistan:</span>
                  <span className="font-medium text-emerald-400">Complimentary Courier (TCS/Trax)</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => addItem(currentProduct)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-semibold uppercase tracking-wider text-black shadow-lg transition-transform hover:scale-[1.02]"
              >
                <ShoppingBag className="h-4 w-4" />
                Add Outfit to Bag
              </button>

              <Link
                href={`/product/${currentProduct.slug}`}
                className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-white/15"
              >
                <Eye className="h-4 w-4" />
                Full Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

