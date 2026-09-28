"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Box, X } from "lucide-react";
import { detailedToProductCard } from "@/lib/data/mockProducts";
import { useProducts } from "@/lib/products/ProductContext";
import { ProductCard } from "@/components/product/ProductCard";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

export function ShopCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [only3D, setOnly3D] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<string>("all");

  const { products } = useProducts();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesMat = product.material.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesMat) return false;
      }

      // Category
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // 3D only
      if (only3D && !product.model3dType) {
        return false;
      }

      // Badge
      if (selectedBadge !== "all" && product.badge !== selectedBadge) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.priceCents - b.priceCents;
      if (sortBy === "price-desc") return b.priceCents - a.priceCents;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, searchQuery, selectedCategory, sortBy, only3D, selectedBadge]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("featured");
    setOnly3D(false);
    setSelectedBadge("all");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "all" ||
    sortBy !== "featured" ||
    only3D ||
    selectedBadge !== "all";

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-xs md:flex-row md:items-center md:justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search creations, fabrics, silhouettes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Right Sort & Toggle Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 3D Studio Filter Toggle */}
          <button
            onClick={() => setOnly3D(!only3D)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              only3D
                ? "border border-amber-500 bg-amber-500/20 text-amber-900"
                : "border border-border bg-background text-muted hover:text-ink"
            }`}
          >
            <Box className="h-3.5 w-3.5 text-amber-600" />
            <span>3D Visualized</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-full border border-border bg-background px-3.5 py-2 text-xs font-medium text-ink focus:outline-none focus:ring-1 focus:ring-ink"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: "all", label: "All Creations" },
          { id: "women", label: "Women" },
          { id: "men", label: "Men" },
          { id: "accessories", label: "Accessories & Haute Jewelry" },
          { id: "footwear", label: "Artisan Footwear" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all ${
              selectedCategory === cat.id
                ? "bg-ink text-background shadow-xs"
                : "border border-border bg-surface text-muted hover:text-ink hover:border-ink"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Badge Quick Filters */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted text-[11px] uppercase tracking-wider font-semibold mr-1">
          Highlights:
        </span>
        {[
          { id: "all", label: "All" },
          { id: "New Season", label: "New Season 2026" },
          { id: "Bestseller", label: "Bestsellers" },
          { id: "Limited Edition", label: "Limited Edition" },
          { id: "Editorial Pick", label: "Editorial Picks" },
        ].map((badge) => (
          <button
            key={badge.id}
            onClick={() => setSelectedBadge(badge.id)}
            className={`rounded-md px-3 py-1 text-xs transition-colors ${
              selectedBadge === badge.id
                ? "bg-amber-100 text-amber-900 font-medium"
                : "bg-background text-muted hover:text-ink"
            }`}
          >
            {badge.label}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="ml-auto inline-flex items-center gap-1 text-xs text-danger hover:underline"
          >
            <X className="h-3 w-3" />
            Reset all filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface py-20 text-center">
          <SlidersHorizontal className="h-10 w-10 text-muted" />
          <h3 className="mt-4 text-base font-medium text-ink">No creations found</h3>
          <p className="mt-1 text-xs text-muted max-w-sm">
            Try adjusting your search criteria, category selections, or reset filters to view all products.
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 rounded-full bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:scale-105 transition-transform"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={detailedToProductCard(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
