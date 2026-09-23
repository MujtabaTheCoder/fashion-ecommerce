"use client";

import React, { useState } from "react";
import { Search, Mail, Phone, MapPin } from "lucide-react";
import { useOrders } from "@/lib/orders/OrderContext";
import { formatMoney } from "@/lib/utils";

export default function AdminCustomersPage() {
  const { orders } = useOrders();
  const [search, setSearch] = useState("");

  // Aggregate unique customers from orders by phone or email
  const customersMap = new Map<
    string,
    {
      email: string;
      phone: string;
      address: string;
      totalSpendRupees: number;
      ordersCount: number;
      lastOrderDate: string;
    }
  >();

  orders.forEach((order) => {
    const key = (order.customerEmail || order.customerPhone || order.id).toLowerCase();
    const existing = customersMap.get(key);
    if (existing) {
      existing.totalSpendRupees += order.totalAmount || 0;
      existing.ordersCount += 1;
    } else {
      customersMap.set(key, {
        email: order.customerEmail || "Guest Client",
        phone: order.customerPhone || "N/A",
        address: order.shippingAddress || "Delivery Address",
        totalSpendRupees: order.totalAmount || 0,
        ordersCount: 1,
        lastOrderDate: order.createdAt,
      });
    }
  });

  const customers = Array.from(customersMap.values()).filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          Client Relations
        </span>
        <h1 className="mt-1 font-display text-3xl font-normal text-white sm:text-4xl">
          Private Client Directory ({customers.length})
        </h1>
      </div>

      {/* Search */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 backdrop-blur-xl">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search client by phone, email, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-white/15 bg-black/50 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/40">
                <th className="pb-3 font-semibold">Contact Phone</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Destination Address</th>
                <th className="pb-3 font-semibold">Total Orders</th>
                <th className="pb-3 font-semibold">Lifetime Spend</th>
                <th className="pb-3 font-semibold">Client Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((customer, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 font-bold text-black text-xs">
                        {customer.phone.charAt(customer.phone.length - 1) || "C"}
                      </div>
                      <div>
                        <p className="font-semibold text-white font-mono">{customer.phone}</p>
                        <p className="text-[10px] text-amber-300">Verified Client</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-white/70">
                    <p className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3 text-white/40" />
                      <span>{customer.email}</span>
                    </p>
                  </td>
                  <td className="py-4 text-white/70 max-w-xs truncate">
                    <p className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3 w-3 text-white/40 flex-shrink-0" />
                      <span className="truncate">{customer.address}</span>
                    </p>
                  </td>
                  <td className="py-4 font-medium text-white">
                    {customer.ordersCount} order{customer.ordersCount > 1 ? "s" : ""}
                  </td>
                  <td className="py-4 font-semibold text-amber-300">
                    {formatMoney(customer.totalSpendRupees * 10)}
                  </td>
                  <td className="py-4">
                    <span className="rounded-full bg-amber-400/15 border border-amber-400/30 px-3 py-1 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                      {customer.totalSpendRupees > 10000 ? "VIP Platinum" : "Gold Member"}
                    </span>
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
