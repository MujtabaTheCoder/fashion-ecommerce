"use client";

import React, { useState } from "react";
import { Layers, Plus, Trash2, Edit } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([
    { id: "women", name: "Women's Silhouettes", slug: "women", count: 48, status: "Active" },
    { id: "men", name: "Men's Relaxed Tailoring", slug: "men", count: 36, status: "Active" },
    { id: "accessories", name: "Haute Jewelry & Accessories", slug: "accessories", count: 24, status: "Active" },
    { id: "footwear", name: "Artisan Footwear & Leather", slug: "footwear", count: 18, status: "Active" },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Taxonomy & Universes
          </span>
          <h1 className="mt-1 font-display text-3xl font-normal text-white sm:text-4xl">
            Maison Categories ({categories.length})
          </h1>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl overflow-hidden">
        <table className="w-full text-left text-xs text-white/80">
          <thead>
            <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/40">
              <th className="pb-3 font-semibold">Universe Name</th>
              <th className="pb-3 font-semibold">Slug Identifier</th>
              <th className="pb-3 font-semibold">Creations Count</th>
              <th className="pb-3 font-semibold">Visibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 font-semibold text-white">{c.name}</td>
                <td className="py-4 font-mono text-amber-300">/shop/{c.slug}</td>
                <td className="py-4 text-white/70">{c.count} items</td>
                <td className="py-4">
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
