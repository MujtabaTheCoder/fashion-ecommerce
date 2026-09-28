"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { detailedToProductCard } from "@/lib/data/mockProducts";
import { useProducts } from "@/lib/products/ProductContext";
import { ProductCard } from "@/components/product/ProductCard";

type FilterTab = "all" | "featured" | "women" | "men" | "accessories";

export function HomeProductSection() {
  const [activeTab, setActiveTab] = useState<FilterTab>("featured");
  const { products } = useProducts();

  const filteredProducts = products.filter((product) => {
    if (activeTab === "all") return true;
    if (activeTab === "featured") return product.isFeatured;
    return product.category === activeTab;
  }).slice(0, 8);

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Curated Creations
          </div>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl md:text-5xl">
            Considered Essentials & Haute Designs
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted">
            Explore meticulously tailored outerwear, fluid sandwashed silks, and hand-cast 18k solid gold jewelry.
          </p>

          {/* Filter Tabs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 rounded-full border border-border bg-surface p-1.5 shadow-xs">
            {[
              { id: "featured", label: "Featured Atelier" },
              { id: "women", label: "Women" },
              { id: "men", label: "Men" },
              { id: "accessories", label: "Accessories & Jewelry" },
              { id: "all", label: "View All (16)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FilterTab)}
                className={`rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-all ${
                  activeTab === tab.id
                    ? "bg-ink text-background shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={detailedToProductCard(product)}
            />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 rounded-full border border-ink bg-transparent px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-all hover:bg-ink hover:text-background hover:scale-105"
          >
            <span>Explore Complete Collection</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
