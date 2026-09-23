"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Trash2, Edit3, X, Check, AlertTriangle, Shield, Sparkles } from "lucide-react";
import { useProducts } from "@/lib/products/ProductContext";
import { type DetailedProduct } from "@/lib/data/mockProducts";
import { formatMoney } from "@/lib/utils";

export default function AdminProductsPage() {
  const { products, addProduct, updateProductPrice, toggleStockStatus, deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit price modal state
  const [editingProduct, setEditingProduct] = useState<DetailedProduct | null>(null);
  const [editPriceRupees, setEditPriceRupees] = useState<number>(0);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    subtitle: "",
    category: "women" as "women" | "men" | "accessories" | "footwear",
    categoryLabel: "Women's Collection",
    priceRupees: 6800,
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    description: "",
    material: "100% Italian Silk / Premium Fabric",
    badge: "New Season" as const,
  });

  const filtered = products.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert rupees to cents representation (e.g. Rs 6800 -> 68000 cents)
    const priceCents = newProduct.priceRupees * 10;
    
    addProduct({
      slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: newProduct.name,
      subtitle: newProduct.subtitle || "Haute Couture Outfit",
      category: newProduct.category,
      categoryLabel:
        newProduct.category === "women"
          ? "Women's Collection"
          : newProduct.category === "men"
          ? "Men's Tailoring"
          : "Accessories",
      priceCents,
      compareAtCents: null,
      rating: 5.0,
      reviewsCount: 1,
      badge: newProduct.badge,
      images: [{ src: newProduct.imageUrl, alt: newProduct.name }],
      description: newProduct.description || "Architectural silhouette cut from luxury Pakistani & Italian textiles.",
      material: newProduct.material,
      careInstructions: "Specialist dry clean only.",
      details: ["Hand finished seams", "Custom tailoring"],
      colors: [{ name: "Onyx", hex: "#111111" }],
      sizes: ["XS", "S", "M", "L", "XL"],
      model3dType: "ring",
      inStock: true,
      isFeatured: true,
    });

    setIsAddModalOpen(false);
    setNewProduct({
      name: "",
      subtitle: "",
      category: "women",
      categoryLabel: "Women's Collection",
      priceRupees: 6800,
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
      description: "",
      material: "100% Italian Silk / Premium Fabric",
      badge: "New Season",
    });
  };

  const handleSavePrice = () => {
    if (!editingProduct) return;
    const priceCents = editPriceRupees * 10;
    updateProductPrice(editingProduct.id, priceCents);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Owner Inventory Control
          </span>
          <h1 className="mt-1 font-display text-3xl font-normal text-white sm:text-4xl">
            Outfits Catalog ({products.length})
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-amber-300 transition-colors shadow-lg"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Outfit (PKR)</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search outfits by title, fabric, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-white/15 bg-black/50 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Outfits" },
            { id: "women", label: "Women" },
            { id: "men", label: "Men" },
            { id: "accessories", label: "Accessories" },
            { id: "footwear", label: "Footwear" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                categoryFilter === cat.id
                  ? "bg-amber-400 text-black font-bold"
                  : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Outfits Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            className={`flex flex-col rounded-3xl border p-4 backdrop-blur-xl transition-all ${
              product.inStock
                ? "border-white/10 bg-white/[0.03] hover:border-white/25"
                : "border-red-500/30 bg-red-950/10"
            }`}
          >
            {/* Image + In Stock Badge */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-black/40">
              {product.images[0] && (
                <Image
                  src={product.images[0].src}
                  alt={product.name}
                  fill
                  className={`object-cover transition-opacity ${!product.inStock ? "opacity-40 grayscale" : ""}`}
                  sizes="300px"
                />
              )}

              {/* Stock Status Badge */}
              <button
                onClick={() => toggleStockStatus(product.id)}
                className={`absolute top-2.5 right-2.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md transition-all ${
                  product.inStock
                    ? "bg-emerald-500/90 text-black hover:bg-emerald-400"
                    : "bg-red-600 text-white hover:bg-red-500 animate-pulse"
                }`}
                title="Click to toggle In Stock / Out of Stock"
              >
                {product.inStock ? "In Stock" : "OUT OF STOCK"}
              </button>

              {product.badge && (
                <span className="absolute top-2.5 left-2.5 rounded-full bg-black/80 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300 uppercase backdrop-blur-sm border border-amber-400/30">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Product Details & Actions */}
            <div className="mt-4 flex flex-1 flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                  {product.categoryLabel}
                </span>
                <h3 className="mt-1 font-display text-base font-normal text-white line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-[11px] text-white/50 line-clamp-2 mt-1">
                  {product.material}
                </p>
              </div>

              {/* Price & Action Buttons */}
              <div className="mt-4 space-y-3 border-t border-white/10 pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-white/50 block">Price (PKR):</span>
                    <span className="text-sm font-bold text-amber-300">
                      {formatMoney(product.priceCents)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setEditPriceRupees(Math.round(product.priceCents / 10));
                    }}
                    className="flex items-center gap-1 rounded-lg border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-400/20"
                    title="Set / Edit Price in PKR"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Set Price</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {/* Stock Toggle Button */}
                  <button
                    onClick={() => toggleStockStatus(product.id)}
                    className={`rounded-lg border px-3 py-1 text-[11px] font-bold uppercase transition-colors ${
                      product.inStock
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "border-red-500/30 bg-red-500/20 text-red-300 hover:bg-red-500/30"
                    }`}
                  >
                    {product.inStock ? "Set Out of Stock" : "Set In Stock"}
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/product/${product.slug}`}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80 hover:bg-white/10"
                      target="_blank"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="rounded-lg border border-red-500/20 bg-red-500/10 p-1 text-red-400 hover:bg-red-500/20"
                      title="Delete Outfit"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Price Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setEditingProduct(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-amber-400/30 bg-[#141311] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-display text-lg font-medium text-amber-300">
                Set Price (Pakistani Rupees)
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="rounded-full p-1 text-white/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-xs text-white/70">
                Updating price for: <strong className="text-white">{editingProduct.name}</strong>
              </p>

              <div>
                <label className="text-xs font-semibold uppercase text-amber-400">
                  New Price in PKR (Rs.)
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-white/50">
                    Rs.
                  </span>
                  <input
                    type="number"
                    value={editPriceRupees}
                    onChange={(e) => setEditPriceRupees(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/20 bg-black/60 py-2.5 pl-12 pr-4 text-sm font-bold text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-full px-4 py-2 text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePrice}
                  className="rounded-full bg-amber-400 px-6 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-amber-300"
                >
                  Save New Price
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Outfit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          <div
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-[#141311] text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                  New Outfit Entry
                </span>
                <h2 className="mt-0.5 font-display text-lg font-medium text-white">
                  Add Haute Outfit to Store
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-1.5 text-white/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold uppercase text-white/60">Outfit Title / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chiffon Embroidered Lehenga / Silk Camp Shirt"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold uppercase text-white/60">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="women">Women Couture</option>
                    <option value="men">Men Tailoring</option>
                    <option value="accessories">Accessories</option>
                    <option value="footwear">Footwear</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold uppercase text-white/60">Price in PKR (Rs.)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 8500"
                    value={newProduct.priceRupees}
                    onChange={(e) => setNewProduct({ ...newProduct, priceRupees: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-amber-300 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold uppercase text-white/60">Outfit Image URL</label>
                <input
                  type="url"
                  required
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold uppercase text-white/60">Textile Composition / Fabric</label>
                <input
                  type="text"
                  placeholder="e.g. 100% Pure Mulberry Silk / Velvet Hand Embroidered"
                  value={newProduct.material}
                  onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold uppercase text-white/60">Editorial Description</label>
                <textarea
                  rows={3}
                  placeholder="Hand-sculpted silhouette with intricate gold wire embroidery..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-full px-5 py-2.5 text-xs text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-amber-400 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-amber-300"
                >
                  Publish Outfit to Live Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
