"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Sparkles, Check, Star, ShieldCheck, Box } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { formatMoney } from "@/lib/utils";

export function ProductQuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addItem, setModel3dProduct } = useCart();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const activeColor = selectedColor || product.colors[0]?.name;
  const activeSize = selectedSize || product.sizes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 grid max-h-[90vh] w-full max-w-4xl grid-cols-1 overflow-y-auto rounded-3xl border border-border bg-surface shadow-2xl md:grid-cols-2">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute right-4 top-4 z-20 rounded-full bg-background/80 p-2 text-ink shadow-md backdrop-blur-sm hover:bg-background"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Gallery / Image Section */}
        <div className="relative flex flex-col bg-background p-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-border">
            {product.images[selectedImgIndex] ? (
              <Image
                src={product.images[selectedImgIndex].src}
                alt={product.images[selectedImgIndex].alt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            ) : null}

            {product.badge && (
              <span className="absolute top-3 left-3 rounded-full bg-ink px-3 py-1 text-[11px] font-medium tracking-wider text-background uppercase">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnail list */}
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`relative h-16 w-14 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                    selectedImgIndex === idx
                      ? "border-ink shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="60px" />
                </button>
              ))}
            </div>
          )}

          {/* 3D Visualizer Studio trigger banner */}
          <button
            onClick={() => {
              setQuickViewProduct(null);
              setModel3dProduct(product);
            }}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 py-2.5 text-xs font-semibold uppercase tracking-wider text-amber-900 transition-colors hover:bg-amber-500/20"
          >
            <Box className="h-4 w-4 text-amber-600" />
            Inspect in Interactive 3D Studio
          </button>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col justify-between p-6 md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              {product.categoryLabel}
            </p>
            <h2 className="mt-2 text-2xl font-serif font-medium tracking-tight text-ink">
              {product.name}
            </h2>
            <p className="mt-1 text-xs text-muted">{product.subtitle}</p>

            {/* Price & Rating */}
            <div className="mt-4 flex items-center gap-4">
              <div className="text-lg font-medium text-ink">
                {product.compareAtCents && product.compareAtCents > product.priceCents ? (
                  <div className="flex items-center gap-2">
                    <span className="text-muted line-through text-sm">
                      {formatMoney(product.compareAtCents)}
                    </span>
                    <span className="text-amber-800 font-semibold">
                      {formatMoney(product.priceCents)}
                    </span>
                  </div>
                ) : (
                  formatMoney(product.priceCents)
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-muted border-l border-border pl-4">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="font-medium text-ink">{product.rating}</span>
                <span>({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted line-clamp-3">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-ink">Color</span>
                  <span className="text-muted">{activeColor}</span>
                </div>
                <div className="mt-2 flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      className={`relative flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                        activeColor === c.name
                          ? "ring-2 ring-ink ring-offset-2"
                          : "border-border hover:scale-110"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {activeColor === c.name && (
                        <Check
                          className={`h-3.5 w-3.5 ${
                            c.hex === "#ffffff" || c.hex === "#faf5eb" || c.hex === "#ece7de"
                              ? "text-black"
                              : "text-white"
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-ink">Size</span>
                  <span className="text-muted">{activeSize}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-all ${
                        activeSize === s
                          ? "border-ink bg-ink text-background"
                          : "border-border bg-surface text-ink hover:border-ink"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 border-t border-border pt-4">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  addItem(product, { color: activeColor, size: activeSize });
                  setQuickViewProduct(null);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-xs font-semibold uppercase tracking-wider text-background shadow-md transition-transform hover:scale-[1.02]"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Shopping Bag
              </button>

              <Link
                href={`/product/${product.slug}`}
                onClick={() => setQuickViewProduct(null)}
                className="flex items-center justify-center rounded-full border border-border px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-ink hover:border-ink"
              >
                Details
              </Link>
            </div>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              <span>Complimentary insured shipping · 14-day exchange</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
