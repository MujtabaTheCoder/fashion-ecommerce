"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Boxes, Search, CheckCircle, AlertTriangle, ArrowUpRight } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/data/mockProducts";
import { formatMoney } from "@/lib/utils";

export default function AdminInventoryPage() {
  const [stockMap, setStockMap] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    MOCK_PRODUCTS.forEach((p, idx) => {
      initial[p.id] = (idx % 3 === 0 ? 4 : (idx % 2 === 0 ? 12 : 24));
    });
    return initial;
  });

  const handleStockChange = (id: string, newQty: number) => {
    setStockMap((prev) => ({ ...prev, [id]: Math.max(0, newQty) }));
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          Stock & Supply Chain
        </span>
        <h1 className="mt-1 font-display text-3xl font-normal text-white sm:text-4xl">
          Atelier Inventory & Proportions
        </h1>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/40">
                <th className="pb-3 font-semibold">Outfit & Creation</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold">Sizes</th>
                <th className="pb-3 font-semibold">Available Units</th>
                <th className="pb-3 font-semibold">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_PRODUCTS.map((product) => {
                const units = stockMap[product.id] ?? 10;
                const isLow = units < 6;
                return (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-black">
                          {product.images[0] && (
                            <Image
                              src={product.images[0].src}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{product.name}</p>
                          <p className="text-[10px] text-white/40">{product.model3dType.toUpperCase()} 3D Model</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 uppercase tracking-wider text-[11px] text-amber-300">
                      {product.category}
                    </td>
                    <td className="py-4 font-medium text-white">
                      {formatMoney(product.priceCents)}
                    </td>
                    <td className="py-4 text-white/60">
                      {product.sizes.join(", ")}
                    </td>
                    <td className="py-4">
                      <input
                        type="number"
                        min={0}
                        value={units}
                        onChange={(e) => handleStockChange(product.id, Number(e.target.value))}
                        className="w-18 rounded-lg border border-white/15 bg-black/60 px-2.5 py-1 text-center text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                    </td>
                    <td className="py-4">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                          <AlertTriangle className="h-3 w-3" />
                          Low Stock ({units})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          <CheckCircle className="h-3 w-3" />
                          Optimal ({units})
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
