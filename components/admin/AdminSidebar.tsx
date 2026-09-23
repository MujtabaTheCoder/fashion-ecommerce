"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Shirt,
  Users,
  Boxes,
  Store,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
} from "lucide-react";
import { useOrders } from "@/lib/orders/OrderContext";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Live Orders", icon: ShoppingBag, badge: true },
  { href: "/admin/products", label: "Outfits & Products", icon: Shirt },
  { href: "/admin/customers", label: "Customer Salon", icon: Users },
  { href: "/admin/inventory", label: "Inventory Stock", icon: Boxes },
];

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { orders } = useOrders();
  const { logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pendingOrdersCount = orders.filter((o) => o.status === "pending" || o.status === "processing").length;

  return (
    <div className="flex min-h-screen bg-[#0f0e0d] text-white">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#141311] transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 font-bold text-black text-sm">
              ✦
            </span>
            <div>
              <span className="font-display text-lg tracking-[0.2em] text-white">ATELIER</span>
              <p className="text-[10px] uppercase tracking-wider text-amber-400">Owner Portal</p>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-white/60 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            Management
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-xs"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-amber-400" : "text-white/50"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && pendingOrdersCount > 0 && (
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-black">
                    {pendingOrdersCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Return to Storefront + Logout */}
        <div className="border-t border-white/10 p-4 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
          >
            <Store className="h-4 w-4 text-amber-400" />
            <span>Visit Storefront</span>
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-3 text-xs font-semibold uppercase tracking-wider text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex h-20 items-center justify-between border-b border-white/10 bg-[#141311]/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Live Salon System · Active Sync
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-Time Orders Connected</span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-xs font-semibold text-black uppercase tracking-wider shadow-sm hover:scale-105 transition-transform"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Live Store</span>
            </Link>
          </div>
        </header>

        {/* Page Children */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#0f0e0d]">{children}</main>
      </div>
    </div>
  );
}
