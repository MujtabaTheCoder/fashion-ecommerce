"use client";

import React from "react";
import { X, ShoppingBag, Eye } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { Product3DViewer } from "@/components/3d/Product3DViewer";
import { formatMoney } from "@/lib/utils";
import Link from "next/link";

export function Product3DModal() {
  const { model3dProduct, setModel3dProduct, addItem } = useCart();

  if (!model3dProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        onClick={() => setModel3dProduct(null)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-[#141312] text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-200">
              Interactive 3D Atelier Studio
            </h3>
          </div>
          <button
            onClick={() => setModel3dProduct(null)}
            className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Studio Viewer */}
        <div className="p-6">
          <Product3DViewer product={model3dProduct} />

          {/* Product quick buy summary under viewer */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                {model3dProduct.categoryLabel}
              </p>
              <h2 className="mt-1 text-lg font-medium text-white">
                {model3dProduct.name}
              </h2>
              <p className="text-sm font-medium text-amber-200 mt-0.5">
                {formatMoney(model3dProduct.priceCents)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/product/${model3dProduct.slug}`}
                onClick={() => setModel3dProduct(null)}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white hover:bg-white/10"
              >
                <Eye className="h-4 w-4" />
                View Full Details
              </Link>
              <button
                onClick={() => {
                  addItem(model3dProduct);
                  setModel3dProduct(null);
                }}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition-transform hover:scale-105"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
