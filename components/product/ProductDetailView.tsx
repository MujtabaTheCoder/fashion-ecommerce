"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Star,
  ShoppingBag,
  Heart,
  Box,
  Layers,
  ShieldCheck,
  Truck,
  RefreshCw,
  Check,
  ChevronDown,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { MOCK_PRODUCTS, type DetailedProduct, detailedToProductCard } from "@/lib/data/mockProducts";
import { formatMoney } from "@/lib/utils";
import { useCart } from "@/lib/cart/CartContext";
import { Product3DViewer } from "@/components/3d/Product3DViewer";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductDetailView({ product }: { product: DetailedProduct }) {
  const { addItem, toggleWishlist, isWishlisted, setModel3dProduct } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"gallery" | "3d">("gallery");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "Default");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "Standard");
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");

  const wishlisted = isWishlisted(product.id);

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.isFeatured),
  ).slice(0, 4);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="bg-background py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center justify-between text-xs text-muted">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Collection</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-widest">{product.categoryLabel}</span>
            <span>/</span>
            <span className="text-ink font-medium">{product.name}</span>
          </div>
        </div>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Media / 3D Viewer (7 cols) */}
          <div className="flex flex-col gap-4 lg:col-span-7">
            {/* View Mode Toggle Switcher (Photos vs 3D) */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-1.5 shadow-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab("gallery")}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeTab === "gallery"
                      ? "bg-ink text-background shadow-xs"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  Editorial Gallery ({product.images.length})
                </button>

                <button
                  onClick={() => setActiveTab("3d")}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeTab === "3d"
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-xs font-bold"
                      : "text-amber-800 hover:text-amber-950"
                  }`}
                >
                  <Box className="h-3.5 w-3.5" />
                  Interactive 3D Studio
                </button>
              </div>

              <span className="text-[11px] font-medium text-muted mr-3 hidden sm:inline">
                {activeTab === "3d" ? "360° Real-time WebGL" : "High-Resolution"}
              </span>
            </div>

            {/* Display Area */}
            {activeTab === "gallery" ? (
              <div className="space-y-4">
                {/* Main Large Image */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-surface shadow-md">
                  {product.images[selectedImage] ? (
                    <Image
                      src={product.images[selectedImage].src}
                      alt={product.images[selectedImage].alt}
                      fill
                      priority
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  ) : null}

                  {product.badge && (
                    <span className="absolute top-4 left-4 rounded-full bg-ink/90 px-3.5 py-1 text-xs font-semibold tracking-wider text-background uppercase backdrop-blur-sm">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Thumbnails row */}
                {product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                          selectedImage === idx
                            ? "border-ink shadow-sm"
                            : "border-transparent opacity-65 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <Product3DViewer product={product} />
                <p className="text-center text-[11px] text-muted">
                  Drag with mouse to rotate 360° · Scroll to zoom · Toggle finishes below canvas
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Buying Options & Spec (5 cols) */}
          <div className="flex flex-col lg:col-span-5">
            {/* Header info */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                {product.categoryLabel}
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="font-semibold text-ink">{product.rating}</span>
                <span className="text-muted">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="mt-3 font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-muted">{product.subtitle}</p>

            {/* Price section */}
            <div className="mt-5 flex items-baseline gap-3 border-b border-border pb-5">
              <span className="text-2xl font-medium text-ink">
                {formatMoney(product.priceCents)}
              </span>
              {product.compareAtCents && product.compareAtCents > product.priceCents && (
                <span className="text-base text-muted line-through">
                  {formatMoney(product.compareAtCents)}
                </span>
              )}
              {product.inStock && (
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  In Stock · Atelier Biella
                </span>
              )}
            </div>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-ink uppercase tracking-wider">Color: {selectedColor}</span>
                </div>
                <div className="mt-3 flex gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                        selectedColor === color.name
                          ? "ring-2 ring-ink ring-offset-2 scale-105"
                          : "border-border hover:scale-110"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor === color.name && (
                        <Check
                          className={`h-4 w-4 ${
                            color.hex === "#ffffff" || color.hex === "#faf5eb" || color.hex === "#ece7de"
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
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-ink uppercase tracking-wider">Size: {selectedSize}</span>
                  <button className="text-muted underline hover:text-ink">Size Chart</button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-xl border px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                        selectedSize === size
                          ? "border-ink bg-ink text-background shadow-xs"
                          : "border-border bg-surface text-ink hover:border-ink"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    addItem(product, {
                      quantity,
                      color: selectedColor,
                      size: selectedSize,
                    })
                  }
                  className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.18em] text-background shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Shopping Bag · {formatMoney(product.priceCents * quantity)}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  title="Add to Wishlist"
                  className={`rounded-full border border-border p-4 transition-all ${
                    wishlisted
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-surface text-ink hover:border-ink"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* 3D Studio quick launcher */}
              <button
                onClick={() => setModel3dProduct(product)}
                className="flex items-center justify-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 py-3 text-xs font-semibold uppercase tracking-wider text-amber-900 hover:bg-amber-500/20 transition-colors"
              >
                <Box className="h-4 w-4 text-amber-600" />
                Launch Fullscreen 3D Visualizer Studio
              </button>
            </div>

            {/* Trust highlights */}
            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-border pt-6 text-xs text-muted">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-ink flex-shrink-0" />
                <span>Complimentary White-Glove Courier</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-ink flex-shrink-0" />
                <span>30-Day Hassle-Free Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-ink flex-shrink-0" />
                <span>Lifetime Authenticity Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span>Serialized Hallmark Certificate</span>
              </div>
            </div>

            {/* Accordion Specs */}
            <div className="mt-8 divide-y divide-border border-y border-border">
              {/* Material & Details */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion("details")}
                  className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink"
                >
                  <span>Composition & Details</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openAccordion === "details" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "details" && (
                  <div className="mt-3 text-xs text-muted space-y-2">
                    <p>
                      <strong>Material:</strong> {product.material}
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      {product.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Care Instructions */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion("care")}
                  className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink"
                >
                  <span>Care & Preservation</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openAccordion === "care" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "care" && (
                  <div className="mt-3 text-xs text-muted">
                    <p>{product.careInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Creations section */}
        {relatedProducts.length > 0 && (
          <section className="mt-28 border-t border-border pt-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Complementary Pieces
                </p>
                <h2 className="mt-2 font-display text-2xl font-normal text-ink sm:text-3xl">
                  You May Also Admire
                </h2>
              </div>
              <Link
                href="/shop"
                className="mt-2 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-ink hover:underline"
              >
                View Full Catalog
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={detailedToProductCard(p)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
