"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Trash2,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  X,
  MapPin,
  ShieldCheck,
  BellRing,
  Sparkles,
  Scissors,
} from "lucide-react";
import { useOrders } from "@/lib/orders/OrderContext";
import { formatMoney } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types/orders";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, deleteOrder, clearAllOrders } = useOrders();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [newOrderToast, setNewOrderToast] = useState<string | null>(null);

  // Audio alert effect for new incoming order
  const previousOrdersCount = useRef(orders.length);

  useEffect(() => {
    if (orders.length > previousOrdersCount.current) {
      const newestOrder = orders[0];
      if (newestOrder) {
        setNewOrderToast(`New Order Arrived! #${newestOrder.orderNumber} - ${newestOrder.customerPhone}`);
        try {
          // Soft notification chime using Web Audio API synthesizer
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
          osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5 note
          gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.3);
        } catch {
          // ignore
        }
      }
    }
    previousOrdersCount.current = orders.length;
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus !== "all" && order.status !== selectedStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesNum = order.orderNumber.toLowerCase().includes(q);
      const matchesPhone = order.customerPhone.toLowerCase().includes(q);
      const matchesEmail = order.customerEmail.toLowerCase().includes(q);
      if (!matchesNum && !matchesPhone && !matchesEmail) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Realtime Toast Alert */}
      {newOrderToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-amber-400 bg-amber-400 text-black px-6 py-4 shadow-2xl animate-bounce">
          <BellRing className="h-5 w-5 animate-pulse text-black" />
          <div className="text-xs font-bold uppercase tracking-wider">
            {newOrderToast}
          </div>
          <button
            onClick={() => setNewOrderToast(null)}
            className="ml-2 rounded-full p-1 hover:bg-black/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Fulfillment Center
          </span>
          <h1 className="mt-1 font-display text-3xl font-normal text-white sm:text-4xl">
            Live Order Queue ({orders.length})
          </h1>
        </div>

        {orders.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear all live orders?")) {
                clearAllOrders();
              }
            }}
            className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/20 transition-colors shadow-lg"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All Orders</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search #ORD reference, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-white/15 bg-black/50 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: "All Orders" },
            { id: "pending", label: "Pending" },
            { id: "processing", label: "Processing" },
            { id: "dispatched", label: "Dispatched" },
            { id: "out_for_delivery", label: "Out For Delivery" },
            { id: "delivered", label: "Delivered" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedStatus === tab.id
                  ? "bg-amber-400 text-black shadow-xs font-bold"
                  : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-10 w-10 text-white/30" />
            <h3 className="mt-4 text-base font-medium text-white">No live orders in queue</h3>
            <p className="mt-1 text-xs text-white/50">
              Orders placed on customer checkout will trigger real-time alerts and appear here instantly.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/40">
                  <th className="pb-3 font-semibold">Order #</th>
                  <th className="pb-3 font-semibold">Contact & Phone</th>
                  <th className="pb-3 font-semibold">Received Time</th>
                  <th className="pb-3 font-semibold">Total Cost</th>
                  <th className="pb-3 font-semibold">Fulfillment Action</th>
                  <th className="pb-3 font-semibold text-right">Inspect Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 font-mono font-bold text-amber-300">
                      {order.orderNumber}
                    </td>
                    <td className="py-4">
                      <p className="font-semibold text-white">{order.customerPhone}</p>
                      <p className="text-[11px] text-white/40 line-clamp-1">{order.customerEmail}</p>
                    </td>
                    <td className="py-4 text-white/70">
                      <div>
                        <p className="font-medium text-white/90">
                          {new Date(order.createdAt).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-[10px] text-amber-400/80">
                          {new Date(order.createdAt).toLocaleTimeString("en-PK", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 font-bold text-white">
                      {formatMoney(order.totalAmount * 10)}
                    </td>
                    <td className="py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold focus:outline-none ${
                          order.status === "delivered"
                            ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                            : order.status === "dispatched" || order.status === "out_for_delivery"
                            ? "border-blue-500/40 bg-blue-500/20 text-blue-300"
                            : order.status === "processing"
                            ? "border-amber-500/40 bg-amber-500/20 text-amber-300"
                            : "border-white/20 bg-black/60 text-white"
                        }`}
                      >
                        <option value="pending" className="bg-[#141311] text-white">1. Pending</option>
                        <option value="processing" className="bg-[#141311] text-white">2. Processing & Tailoring</option>
                        <option value="dispatched" className="bg-[#141311] text-white">3. Dispatched</option>
                        <option value="out_for_delivery" className="bg-[#141311] text-white">4. Out For Delivery</option>
                        <option value="delivered" className="bg-[#141311] text-white">5. Delivered</option>
                        <option value="cancelled" className="bg-[#141311] text-white">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-400 hover:text-black transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Manage</span>
                        </Link>

                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500/20"
                          title="Delete Order"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
