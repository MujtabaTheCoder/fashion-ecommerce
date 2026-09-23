"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X, Heart, Box, Sparkles } from "lucide-react";
import { BRAND_NAME, NAV_LINKS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart/CartContext";

export function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount, openCart, wishlist } = useCart();

  return (
    <>
      {/* Top Luxury Announcement Ribbon */}
      <div className="border-b border-white/10 bg-ink px-4 py-2 text-center text-[11px] font-medium tracking-[0.2em] text-background uppercase">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span>New 2026 Haute Couture · 3D Interactive Outfits · Free Express Delivery Across Pakistan (PKR)</span>
          <Sparkles className="h-3 w-3 text-amber-400" />
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md transition-all shadow-xs">
        <Container className="grid h-16 grid-cols-3 items-center md:h-20">
          {/* Left Column: Mobile menu toggle + Store Catalog Links */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center text-ink md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            </button>

            {/* Desktop Main Catalog Navigation */}
            <nav
              className="hidden items-center gap-5 lg:gap-7 md:flex"
              aria-label="Primary Left"
            >
              <Link
                href="/shop"
                className="text-xs uppercase tracking-[0.16em] font-semibold text-ink hover:text-amber-700 transition-colors whitespace-nowrap"
              >
                Shop Outfits
              </Link>
              <Link
                href="/shop?category=women"
                className="text-xs uppercase tracking-[0.16em] font-medium text-ink/75 hover:text-ink transition-colors whitespace-nowrap"
              >
                Women
              </Link>
              <Link
                href="/shop?category=men"
                className="text-xs uppercase tracking-[0.16em] font-medium text-ink/75 hover:text-ink transition-colors whitespace-nowrap"
              >
                Men
              </Link>
            </nav>
          </div>

          {/* Center Column: Brand Logo */}
          <div className="flex justify-center items-center">
            <Link
              href="/"
              className="font-display text-2xl md:text-3xl font-normal tracking-[0.3em] text-ink hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {BRAND_NAME}
            </Link>
          </div>

          {/* Right Column: Secondary Links & Action Icons */}
          <div className="flex items-center justify-end gap-3 lg:gap-4">
            {/* Desktop Right Links */}
            <nav className="hidden lg:flex items-center gap-4">
              <Link
                href="/#customizer-3d"
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-amber-900 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 hover:bg-amber-500/20 transition-all whitespace-nowrap"
              >
                <Box className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                <span>3D Bespoke</span>
              </Link>

              <Link
                href="/track-order"
                className="text-xs uppercase tracking-[0.14em] font-medium text-ink/75 hover:text-ink transition-colors whitespace-nowrap"
              >
                Track Order
              </Link>
            </nav>

            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-surface border border-border/70 px-2.5 py-1 text-[10px] font-bold tracking-wider text-ink/70">
              <span>🇵🇰</span> PKR
            </span>

            <Link
              href="/shop"
              className="inline-flex h-9 w-9 items-center justify-center text-ink/80 hover:text-ink transition-colors"
              aria-label="Search Collection"
            >
              <Search className="h-4 w-4" aria-hidden />
            </Link>

            <Link
              href="/shop"
              className="relative inline-flex h-9 w-9 items-center justify-center text-ink/80 hover:text-ink transition-colors"
              aria-label="Wishlist"
              title={`Wishlist (${wishlist.length})`}
            >
              <Heart className="h-4 w-4" aria-hidden />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href="/admin"
              className="inline-flex h-9 w-9 items-center justify-center text-ink/80 hover:text-ink transition-colors"
              aria-label="Owner Admin Portal"
              title="Owner Portal"
            >
              <User className="h-4 w-4" aria-hidden />
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              type="button"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-background shadow-md transition-transform hover:scale-105"
              aria-label="Open Cart"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-black shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </Container>

        {/* Mobile Navigation Drawer */}
        <div
          id="mobile-nav"
          className={cn(
            "border-t border-border bg-surface md:hidden shadow-lg",
            open ? "block" : "hidden",
          )}
        >
          <nav className="flex flex-col px-6 py-5 divide-y divide-border/60" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between py-3.5 text-sm uppercase tracking-[0.16em] text-ink hover:text-amber-800"
                onClick={() => setOpen(false)}
              >
                <span>{link.label}</span>
                {link.label.includes("3D") && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    3D
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/admin"
              className="py-3.5 text-sm uppercase tracking-[0.16em] text-amber-900 font-bold"
              onClick={() => setOpen(false)}
            >
              Owner Portal (Admin)
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}

