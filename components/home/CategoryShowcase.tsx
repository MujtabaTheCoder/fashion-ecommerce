"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Card3DTilt } from "@/components/3d/Card3DTilt";

const CATEGORIES = [
  {
    title: "Women's Silhouettes",
    subtitle: "Fluid drape, double-faced cashmere & fine silk",
    href: "/shop?category=women",
    itemCount: "48 Pieces",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop",
    badge: "Haute Edition",
  },
  {
    title: "Men's Relaxed Tailoring",
    subtitle: "Unstructured blazers, selvedge denim & heavyweight loopback",
    href: "/shop?category=men",
    itemCount: "36 Pieces",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    badge: "New Season",
  },
  {
    title: "Haute Jewelry & Timepieces",
    subtitle: "18K solid yellow gold, Colombian emeralds & Swiss automatic calibers",
    href: "/shop?category=accessories",
    itemCount: "24 Pieces",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
    badge: "3D Visualized",
  },
  {
    title: "Artisan Leather & Footwear",
    subtitle: "Vegetable-tanned Tuscan calfskin & Goodyear-welted soles",
    href: "/shop?category=footwear",
    itemCount: "18 Pieces",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop",
    badge: "Handcrafted",
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-20 md:py-28 bg-surface border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Maison Categories
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Curated Universes
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink hover:underline"
          >
            <span>Explore All Universes</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Card3DTilt key={category.title} maxTilt={9} glareOpacity={0.25} className="group h-full">
              <Link
                href={category.href}
                className="relative block h-[420px] w-full overflow-hidden rounded-2xl border border-border bg-border shadow-md transition-all duration-500"
              >
                {/* Background Image */}
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4">
                  <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-semibold tracking-wider text-amber-200 uppercase backdrop-blur-md">
                    {category.badge}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className="text-[11px] font-medium uppercase tracking-widest text-amber-300">
                    {category.itemCount}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-normal leading-snug">
                    {category.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-white/75 line-clamp-2">
                    {category.subtitle}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors">
                    <span>Shop Universe</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            </Card3DTilt>
          ))}
        </div>
      </div>
    </section>
  );
}
