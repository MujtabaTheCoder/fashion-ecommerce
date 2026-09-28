"use client";

import React, { useState } from "react";
import { Shirt3DViewer, type ShirtCustomizerState } from "@/components/3d/Shirt3DViewer";
import { ShoppingBag, Check, ShieldCheck, Scissors } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { formatMoney } from "@/lib/utils";
import type { DetailedProduct } from "@/lib/data/mockProducts";

const FABRICS = [
  { id: "silk", name: "22-Momme Mulberry Silk", basePriceCents: 34000, desc: "Ultra-fluid pearlescent sheen, cool to the skin" },
  { id: "oxford", name: "GOTS Combed Oxford Cotton", basePriceCents: 24000, desc: "Crisp architectural structure with breathable weave" },
  { id: "wool", name: "Tropical Merino Wool", basePriceCents: 38000, desc: "Ultra-fine 19.5 micron wrinkle-resistant tailoring" },
  { id: "linen", name: "Belgian Washed Raw Linen", basePriceCents: 28000, desc: "Relaxed vintage drape with natural air circulation" },
  { id: "velvet", name: "Italian Cotton Velvet", basePriceCents: 42000, desc: "Rich plush pile with twilight luster" },
];

const COLLARS = [
  { id: "camp", name: "Relaxed Camp Collar" },
  { id: "classic", name: "Modern Point Collar" },
  { id: "spread", name: "Cutaway Wide Spread" },
  { id: "mandarin", name: "Sculpted Mandarin Band" },
];

const COLORS = [
  { name: "Silk Ivory", hex: "#f8f5ee" },
  { name: "Midnight Charcoal", hex: "#22252a" },
  { name: "Oat Camel", hex: "#c4a381" },
  { name: "Deep Forest", hex: "#223127" },
  { name: "Imperial Burgundy", hex: "#4a1924" },
  { name: "Raw Umber", hex: "#524338" },
];

export function BespokeShirtStudio() {
  const { addItem } = useCart();

  const [state, setState] = useState<ShirtCustomizerState>({
    fabric: "silk",
    collar: "camp",
    colorHex: "#f8f5ee",
    colorName: "Silk Ivory",
    monogram: "AT",
    buttons: "pearl",
  });

  const [selectedSize, setSelectedSize] = useState("M");

  const currentFabric = FABRICS.find((f) => f.id === state.fabric) || FABRICS[0];
  const totalPriceCents = currentFabric ? currentFabric.basePriceCents : 34000;

  const handleAddBespokeToBag = () => {
    const bespokeProduct: DetailedProduct = {
      id: `bespoke-shirt-${state.fabric}-${state.collar}-${state.colorHex.replace("#", "")}`,
      slug: `bespoke-${state.fabric}-shirt`,
      name: `Bespoke 3D ${currentFabric ? currentFabric.name : "Silk"} Shirt`,
      subtitle: `${state.collar.toUpperCase()} collar · ${state.colorName}`,
      category: "men",
      categoryLabel: "3D Bespoke Atelier",
      priceCents: totalPriceCents,
      compareAtCents: null,
      rating: 5.0,
      reviewsCount: 1,
      badge: "Bespoke 3D",
      images: [
        {
          src: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop",
          alt: "Bespoke Shirt",
        },
      ],
      description: `Custom-tailored 3D shirt crafted from ${currentFabric ? currentFabric.name : "silk"} in ${state.colorName} with ${state.collar} collar.`,
      material: currentFabric ? currentFabric.name : "Mulberry Silk",
      careInstructions: "Specialist green dry clean.",
      details: [
        `Collar: ${state.collar}`,
        `Color: ${state.colorName}`,
        `Monogram: ${state.monogram || "None"}`,
      ],
      colors: [{ name: state.colorName, hex: state.colorHex }],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      model3dType: "ring",
      inStock: true,
      isFeatured: true,
    };

    addItem(bespokeProduct, {
      color: state.colorName,
      size: selectedSize,
    });
  };

  return (
    <section id="customizer-3d" className="relative overflow-hidden bg-surface py-20 md:py-28 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">
            <Scissors className="h-3.5 w-3.5 text-amber-700" />
            3D Bespoke Outfit Studio
          </div>
          <h2 className="mt-4 font-display text-3xl font-normal text-ink sm:text-4xl md:text-5xl">
            Design Your 3D Atelier Shirt
          </h2>
          <p className="mt-3 text-sm text-muted">
            Configure fabric weight, collar cut, artisanal dye shade, and monogram in real time 3D.
          </p>
        </div>

        {/* 3D Visualizer & Customizer Controls */}
        <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Left: 3D Shirt Canvas (7 cols) */}
          <div className="lg:col-span-7">
            <Shirt3DViewer
              customization={state}
              onCustomizationChange={(up) => setState((prev) => ({ ...prev, ...up }))}
            />
          </div>

          {/* Right: Customizer Form (5 cols) */}
          <div className="flex flex-col rounded-3xl border border-border bg-background p-6 md:p-8 shadow-md lg:col-span-5">
            {/* Fabric Selection */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                1. Select Pure Textile
              </span>
              <div className="mt-2.5 space-y-2">
                {FABRICS.map((fabric) => (
                  <button
                    key={fabric.id}
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        fabric: fabric.id as ShirtCustomizerState["fabric"],
                      }))
                    }
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                      state.fabric === fabric.id
                        ? "border-ink bg-surface shadow-xs ring-1 ring-ink"
                        : "border-border bg-surface/50 hover:border-ink/50"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold text-ink">{fabric.name}</p>
                      <p className="text-[11px] text-muted">{fabric.desc}</p>
                    </div>
                    <span className="text-xs font-medium text-ink">
                      {formatMoney(fabric.basePriceCents)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-muted">
                  2. Atelier Shade: <strong className="text-ink">{state.colorName}</strong>
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        colorHex: color.hex,
                        colorName: color.name,
                      }))
                    }
                    title={color.name}
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                      state.colorHex === color.hex
                        ? "ring-2 ring-ink ring-offset-2 scale-110"
                        : "border-border hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {state.colorHex === color.hex && (
                      <Check
                        className={`h-4 w-4 ${
                          color.hex === "#f8f5ee" ? "text-black" : "text-white"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Collar Cut */}
            <div className="mt-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                3. Collar Architecture
              </span>
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                {COLLARS.map((collar) => (
                  <button
                    key={collar.id}
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        collar: collar.id as ShirtCustomizerState["collar"],
                      }))
                    }
                    className={`rounded-xl border p-2.5 text-xs font-medium text-center transition-all ${
                      state.collar === collar.id
                        ? "border-ink bg-ink text-background shadow-xs"
                        : "border-border bg-surface text-ink hover:border-ink"
                    }`}
                  >
                    {collar.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Picker */}
            <div className="mt-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                4. Select Proportions
              </span>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      selectedSize === size
                        ? "border-ink bg-ink text-background"
                        : "border-border bg-surface text-ink hover:border-ink"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Total & Action */}
            <div className="mt-8 border-t border-border pt-6">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs font-medium text-muted">Total Bespoke Price</span>
                <span className="text-2xl font-medium text-ink">
                  {formatMoney(totalPriceCents)}
                </span>
              </div>

              <button
                onClick={handleAddBespokeToBag}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.18em] text-background shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
              >
                <ShoppingBag className="h-4 w-4" />
                Add Bespoke Outfit to Bag
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                <span>Hand-stitched in Biella · 100% Satisfaction Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
