"use client";

import React from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Shirt,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { useOrders } from "@/lib/orders/OrderContext";
import { formatMoney } from "@/lib/utils";
import { MOCK_PRODUCTS } from "@/lib/data/mockProducts";
import type { OrderStatus } from "@/lib/types/orders";

export default function AdminHomePage() {
  const { orders, updateOrderStatus } = useOrders();

  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0) * 10, 0);
  const pendingCount = orders.filter(
    (o) => o.status === "pending" || o.status === "processing",
  ).length;

  return (
    <div className="space-y-8">
      {/* Title & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Salon Command Center
          </span>
          <h1 className="mt-1 font-display text-3xl font-normal text-white sm:text-4xl">
            Live Boutique Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-amber-300 transition-colors"
          >
            <Shirt className="h-4 w-4" />
            <span>Manage Outfits</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10"
          >
            <span>All Orders ({orders.length})</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Total Sales Revenue
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-medium text-white">{formatMoney(totalRevenue)}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Real-time live sales tracking</span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Total Placed Orders
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-medium text-white">{orders.length}</p>
          <p className="mt-2 text-xs text-white/60">Saved & synced to Supabase</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Pending Fulfillment
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-medium text-amber-300">{pendingCount}</p>
          <p className="mt-2 text-xs text-white/60">Awaiting dispatch or tailoring</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Haute Outfits in Catalog
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
              <Shirt className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-medium text-white">{MOCK_PRODUCTS.length}</p>
          <p className="mt-2 text-xs text-white/60">3D Interactive models active</p>
        </div>
      </div>

      {/* Recent Live Orders Section */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <h2 className="font-display text-xl font-medium text-white">
              Recent Live Orders
            </h2>
            <p className="text-xs text-white/50">Real-time sync with customer checkout</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold uppercase tracking-wider text-amber-400 hover:underline"
          >
            View Full Table
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/40">
                <th className="pb-3 font-semibold">Order</th>
                <th className="pb-3 font-semibold">Contact & Phone</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Live Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.slice(0, 6).map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 font-mono font-medium text-amber-300">
                    {order.orderNumber}
                  </td>
                  <td className="py-4">
                    <p className="font-semibold text-white">{order.customerPhone}</p>
                    <p className="text-[11px] text-white/40">{order.customerEmail}</p>
                  </td>
                  <td className="py-4 text-white/70">
                    {(order.items || []).length} creation{(order.items || []).length > 1 ? "s" : ""}
                  </td>
                  <td className="py-4 font-medium text-white">
                    {formatMoney((order.totalAmount || 0) * 10)}
                  </td>
                  <td className="py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="rounded-lg border border-white/15 bg-black/60 px-2.5 py-1 text-xs text-white focus:ring-1 focus:ring-amber-400 focus:outline-none"
                    >
                      <option value="pending">1. Pending</option>
                      <option value="processing">2. Processing</option>
                      <option value="dispatched">3. Dispatched</option>
                      <option value="out_for_delivery">4. Out For Delivery</option>
                      <option value="delivered">5. Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
