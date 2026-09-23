"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingBag, Box, Star } from "lucide-react";
import { isSupabaseStorageUrl } from "@/lib/products/media";
import { formatMoney } from "@/lib/utils";
import type { ProductCardData } from "@/types";
import { Card3DTilt } from "@/components/3d/Card3DTilt";
import { useCart } from "@/lib/cart/CartContext";
import { MOCK_PRODUCTS } from "@/lib/data/mockProducts";

type ProductCardProps = {
  product: ProductCardData;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, setQuickViewProduct, setModel3dProduct, toggleWishlist, isWishlisted } =
    useCart();

  const detailed = MOCK_PRODUCTS.find((p) => p.slug === product.slug) || {
    id: product.id,
    slug: product.slug,
    name: product.name,
    subtitle: "High Fashion Editorial Essential",
    category: "women" as const,
    categoryLabel: "Editorial Collection",
    priceCents: product.priceCents || 45000,
    compareAtCents: product.compareAtCents,
    rating: 4.9,
    reviewsCount: 24,
    images: product.image ? [product.image] : [],
    description: "Tailored luxury silhouette cut from fine Italian textiles.",
    material: "100% Fine Fabric",
    careInstructions: "Dry clean only.",
    details: ["Sculptural tailoring"],
    colors: [{ name: "Default", hex: "#111111" }],
    sizes: ["XS", "S", "M", "L"],
    model3dType: "ring" as const,
    inStock: true,
    isFeatured: true,
  };

  const optimized = Boolean(
    product.image && isSupabaseStorageUrl(product.image.src),
  );

  const primaryImg = detailed.images[0]?.src || product.image?.src;
  const secondaryImg = detailed.images[1]?.src;
  const wishlisted = isWishlisted(product.id);

  return (
    <Card3DTilt maxTilt={8} glareOpacity={0.18} className="group flex h-full flex-col">
      <article className="relative flex h-full flex-col rounded-2xl border border-border/80 bg-surface p-3 transition-shadow duration-300 hover:shadow-xl">
        {/* Image Display */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-border/60">
          <Link href={`/product/${product.slug}`} className="block h-full w-full">
            {primaryImg ? (
              <>
                <Image
                  src={primaryImg}
                  alt={product.image?.alt || product.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className={`object-cover transition-all duration-700 ${
                    secondaryImg
                      ? "group-hover:opacity-0 group-hover:scale-105"
                      : "group-hover:scale-105"
                  }`}
                  unoptimized={!optimized}
                />
                {secondaryImg && (
                  <Image
                    src={secondaryImg}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="absolute inset-0 object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                    unoptimized={!optimized}
                  />
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-xs uppercase tracking-[0.16em] text-muted">
                {product.name}
              </div>
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none">
            {detailed.badge && (
              <span className="rounded-full border border-black/10 bg-ink/90 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-background uppercase backdrop-blur-sm">
                {detailed.badge}
              </span>
            )}
            {product.compareAtCents &&
              product.priceCents &&
              product.compareAtCents > product.priceCents && (
                <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase">
                  Sale -{Math.round((1 - product.priceCents / product.compareAtCents) * 100)}%
                </span>
              )}
          </div>

          {/* Top Right Actions: Wishlist & 3D Studio button */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.id);
              }}
              title="Save to Wishlist"
              className={`rounded-full p-2 backdrop-blur-md transition-all ${
                wishlisted
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-surface/80 text-ink/70 hover:bg-surface hover:text-red-500 shadow-sm"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${wishlisted ? "fill-current" : ""}`} />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                setModel3dProduct(detailed);
              }}
              title="Inspect in 3D WebGL Studio"
              className="flex items-center gap-1 rounded-full border border-amber-400/40 bg-black/75 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-amber-300 shadow-sm backdrop-blur-md hover:bg-black hover:border-amber-400"
            >
              <Box className="h-3 w-3" />
              <span>3D</span>
            </button>
          </div>

          {/* Quick Actions overlay on hover */}
          <div className="absolute inset-x-2.5 bottom-2.5 flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
            <button
              onClick={() => setQuickViewProduct(detailed)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface/95 py-2.5 text-xs font-medium text-ink shadow-lg backdrop-blur-md transition-transform hover:scale-[1.02]"
            >
              <Eye className="h-3.5 w-3.5" />
              Quick View
            </button>

            <button
              onClick={() => addItem(detailed)}
              className="flex items-center justify-center rounded-xl bg-ink p-2.5 text-background shadow-lg transition-transform hover:scale-105"
              title="Add to Shopping Bag"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Info */}
        <div className="mt-3.5 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-muted">
              <span className="uppercase tracking-widest">{detailed.categoryLabel}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span>{detailed.rating}</span>
              </div>
            </div>

            <h3 className="mt-1 font-serif text-sm tracking-wide text-ink line-clamp-1 group-hover:text-accent">
              <Link href={`/product/${product.slug}`}>{product.name}</Link>
            </h3>
          </div>

          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-border/50">
            <div className="text-sm font-medium">
              {product.priceCents !== null ? (
                product.compareAtCents !== null && product.compareAtCents > product.priceCents ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted line-through">
                      {formatMoney(product.compareAtCents)}
                    </span>
                    <span className="font-semibold text-ink">
                      {formatMoney(product.priceCents)}
                    </span>
                  </div>
                ) : (
                  <span className="text-ink">{formatMoney(product.priceCents)}</span>
                )
              ) : (
                <span className="text-muted text-xs">Price unavailable</span>
              )}
            </div>

            {/* Colors swatch dots preview */}
            {detailed.colors.length > 0 && (
              <div className="flex items-center -space-x-1">
                {detailed.colors.slice(0, 3).map((c) => (
                  <span
                    key={c.name}
                    className="h-2.5 w-2.5 rounded-full border border-surface shadow-xs"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </Card3DTilt>
  );
}
