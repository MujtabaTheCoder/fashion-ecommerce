"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Scissors,
  Package,
  Truck,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Save,
  Trash2,
  ExternalLink,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import { useOrders } from "@/lib/orders/OrderContext";
import { formatMoney } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types/orders";

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { getOrderById, getOrderByNumber, updateOrderStatus, deleteOrder } = useOrders();

  const order = getOrderById(resolvedParams.id) || getOrderByNumber(resolvedParams.id);

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order?.status || "pending");
  const [trackingInput, setTrackingInput] = useState<string>(order?.trackingNumber || "");
  const [noteInput, setNoteInput] = useState<string>("");
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if order changes
  React.useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setTrackingInput(order.trackingNumber || "");
    }
  }, [order]);

  if (!order) {
    return (
      <div className="py-20 text-center text-white">
        <AlertCircle className="mx-auto h-12 w-12 text-amber-400" />
        <h2 className="mt-4 font-display text-2xl">Order Not Found</h2>
        <p className="mt-2 text-xs text-white/50">
          The requested order reference ID could not be located in the system.
        </p>
        <Link
          href="/admin/orders"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Live Orders Queue
        </Link>
      </div>
    );
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await updateOrderStatus(
      order.id,
      selectedStatus,
      noteInput.trim() || undefined,
      trackingInput.trim() || undefined
    );

    setIsSubmitting(false);
    setIsSavedToast(true);
    setNoteInput("");
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const STATUS_STEPS: Array<{ id: OrderStatus; label: string; icon: any }> = [
    { id: "pending", label: "1. Pending", icon: Clock },
    { id: "processing", label: "2. Tailoring & Processing", icon: Scissors },
    { id: "dispatched", label: "3. Dispatched", icon: Package },
    { id: "out_for_delivery", label: "4. Out For Delivery", icon: Truck },
    { id: "delivered", label: "5. Delivered", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8 text-white">
      {/* Toast Banner */}
      {isSavedToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-400 bg-emerald-500 px-6 py-4 text-white shadow-2xl animate-pulse">
          <Check className="h-5 w-5" />
          <div className="text-xs font-bold uppercase tracking-wider">
            Order Status & History Updated Successfully!
          </div>
        </div>
      )}

      {/* Back Link & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Live Orders Queue</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">Tracking Page URL:</span>
          <Link
            href={`/track-order/${order.orderNumber.replace("#", "")}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-400 hover:text-black transition-colors"
          >
            <span>Customer View</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Order Dossier Header */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              Fulfillment Command
            </span>
            <h1 className="mt-1 font-mono text-2xl font-bold text-amber-300 sm:text-4xl">
              Order {order.orderNumber}
            </h1>
            <p className="mt-1 text-xs text-white/50">
              Received on {new Date(order.createdAt).toLocaleDateString("en-PK", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-md ${
                order.status === "delivered"
                  ? "bg-emerald-500 text-black"
                  : order.status === "cancelled"
                  ? "bg-red-600 text-white"
                  : "bg-amber-400 text-black"
              }`}
            >
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        {/* Actionable Status Updater Form */}
        <form onSubmit={handleUpdateStatus} className="mt-8 space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-3">
              Actionable Order Status Stepper:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {STATUS_STEPS.map((step) => {
                const Icon = step.icon;
                const isSelected = selectedStatus === step.id;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setSelectedStatus(step.id)}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-xs transition-all ${
                      isSelected
                        ? "border-amber-400 bg-amber-400 text-black font-bold shadow-lg scale-[1.02]"
                        : "border-white/15 bg-black/40 text-white/70 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[11px] font-semibold tracking-wider text-center">
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60 block">
                Courier Tracking Code / Reference Link
              </label>
              <input
                type="text"
                placeholder="e.g. TCS-99420, Trax-88120, or courier link"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-xs text-amber-300 font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60 block">
                Optional Update Audit Note (Appears on Customer Timeline)
              </label>
              <input
                type="text"
                placeholder="e.g. Pattern cut and stitched at Atelier Lahore workshop"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-full bg-amber-400 px-8 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-amber-300 transition-all shadow-lg"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? "Updating..." : "Save Status & Trigger History Log"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Details Grid: Customer Info & Items Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer Info & Timeline Audit (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Customer & Address Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Customer & Shipping Destination
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-white/60">Phone Contact: <strong className="text-white font-mono">{order.customerPhone}</strong></p>
              <p className="text-white/60">Email: <strong className="text-white">{order.customerEmail}</strong></p>
              <p className="text-white/60">Delivery Address: <strong className="text-white">{order.shippingAddress}</strong></p>
            </div>
          </div>

          {/* Status Event History Log */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl space-y-4">
            <h3 className="font-display text-lg font-medium text-white">
              Status Event History ({order.history?.length || 0})
            </h3>

            <div className="space-y-3 divide-y divide-white/10">
              {(order.history || []).map((h, i) => (
                <div key={h.id || i} className="pt-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 uppercase">
                      {h.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                      {new Date(h.createdAt).toLocaleTimeString("en-PK", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  {h.note && <p className="text-white/70 text-[11px]">{h.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Ordered Items Breakdown (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl space-y-6">
          <h3 className="font-display text-lg font-medium text-white">
            Ordered Apparel & Items ({order.items?.length || 0})
          </h3>

          <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-black/40 px-4">
            {(order.items || []).map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{item.productName}</p>
                  <p className="text-white/50 text-[11px] mt-0.5">
                    Size: <span className="font-semibold text-amber-300">{item.size}</span> · Quantity: {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-white text-sm">
                  {formatMoney(item.price * 10)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 flex justify-between items-center text-base font-bold">
            <span>Total Amount Paid:</span>
            <span className="text-amber-300 font-mono">{formatMoney(order.totalAmount * 10)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
