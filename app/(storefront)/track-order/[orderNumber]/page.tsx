"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  Clock,
  Scissors,
  Package,
  Truck,
  CheckCircle2,
  ExternalLink,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useOrders } from "@/lib/orders/OrderContext";
import { formatMoney } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types/orders";

export default function OrderTrackingDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const resolvedParams = use(params);
  const { getOrderByNumber, isRealtimeConnected } = useOrders();
  const [copied, setCopied] = React.useState(false);

  const order = getOrderByNumber(resolvedParams.orderNumber);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!order) {
    return (
      <div className="py-24 bg-background min-h-[70vh]">
        <Container className="max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface border border-border shadow-xs">
            <AlertCircle className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-medium text-ink sm:text-3xl">
            Order Reference Not Found
          </h1>
          <p className="mt-2 text-xs text-muted">
            We could not locate order <strong className="text-ink">#{resolvedParams.orderNumber}</strong> in our live database.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/track-order"
              className="rounded-full bg-ink px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-background hover:scale-105 transition-transform"
            >
              Try Order Lookup
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-border bg-surface px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink hover:border-ink"
            >
              Explore Collection
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Calculate 4 Core Stages Progress
  const statusRanks: Record<OrderStatus, number> = {
    pending: 1,
    processing: 2,
    dispatched: 3,
    out_for_delivery: 4,
    delivered: 4,
    cancelled: 0,
  };

  const currentRank = statusRanks[order.status] || 1;

  const STAGES = [
    {
      id: "pending",
      rank: 1,
      title: "Order Placed",
      subtitle: "Payment confirmed",
      icon: Clock,
    },
    {
      id: "processing",
      rank: 2,
      title: "Processing & Tailoring",
      subtitle: "Fabric cut & hand-stitched",
      icon: Scissors,
    },
    {
      id: "dispatched",
      rank: 3,
      title: "Dispatched",
      subtitle: "Handed to priority courier",
      icon: Package,
    },
    {
      id: "delivered",
      rank: 4,
      title: "Out for Delivery / Delivered",
      subtitle: order.status === "delivered" ? "Successfully received" : "Courier en route",
      icon: order.status === "delivered" ? CheckCircle2 : Truck,
    },
  ];

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen">
      <Container className="max-w-5xl space-y-8">
        {/* Back Link & Realtime Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/track-order"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Order Lookup</span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Supabase Realtime Sync Active</span>
          </div>
        </div>

        {/* Order Header Summary Card */}
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                  Haute Atelier Dossier
                </span>
                <span className="rounded-full bg-ink text-background px-2.5 py-0.5 text-[10px] font-mono font-bold">
                  {order.orderNumber}
                </span>
              </div>
              <h1 className="mt-1 font-display text-2xl font-normal text-ink sm:text-4xl">
                Order Tracking Status
              </h1>
              <p className="mt-1 text-xs text-muted">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Current Status Pill */}
            <div className="flex flex-col items-start md:items-end">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">
                Current Fulfillment State
              </span>
              <span
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-xs ${
                  order.status === "delivered"
                    ? "bg-emerald-600 text-white"
                    : order.status === "cancelled"
                    ? "bg-red-600 text-white"
                    : "bg-amber-500 text-black"
                }`}
              >
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          {/* 4 Core Stages Visual Progress Bar */}
          <div className="mt-8 pt-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-6">
              Visual Tailoring & Delivery Progression
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STAGES.map((stage) => {
                const Icon = stage.icon;
                const isCompleted = currentRank > stage.rank || (currentRank === 4 && order.status === "delivered");
                const isActive = currentRank === stage.rank && order.status !== "delivered";

                return (
                  <div
                    key={stage.id}
                    className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                      isCompleted
                        ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-950 shadow-xs"
                        : isActive
                        ? "border-amber-600 bg-amber-500/15 text-amber-950 ring-2 ring-amber-500/30"
                        : "border-border bg-background/50 text-muted opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                          isCompleted
                            ? "bg-emerald-600 text-white"
                            : isActive
                            ? "bg-amber-600 text-white animate-pulse"
                            : "bg-border text-muted"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-muted">
                        STAGE 0{stage.rank}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-ink">
                        {stage.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted line-clamp-2">
                        {stage.subtitle}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[10px] font-semibold uppercase">
                      {isCompleted ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="h-3 w-3" /> Completed
                        </span>
                      ) : isActive ? (
                        <span className="text-amber-800 font-bold animate-pulse">In Progress</span>
                      ) : (
                        <span className="text-muted">Pending Stage</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Courier & Tracking Details Box (if tracking number is provided) */}
        {order.trackingNumber && (
          <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-md">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900 block">
                    Express Courier Assigned
                  </span>
                  <h3 className="font-display text-lg font-medium text-ink">
                    Tracking Code: <span className="font-mono text-amber-950 font-bold">{order.trackingNumber}</span>
                  </h3>
                  <p className="text-xs text-amber-900/80 mt-0.5">
                    Verified courier dispatch code for TCS / Trax / FedEx Express delivery.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(order.trackingNumber || "")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-900/30 bg-surface px-4 py-2 text-xs font-semibold text-ink hover:bg-white"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Code"}</span>
                </button>

                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(order.trackingNumber)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2 text-xs font-bold uppercase tracking-wider text-background hover:scale-105 transition-transform"
                >
                  <span>Track Courier</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Event Timeline & Ordered Items Grid (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Event Status History Timeline (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-border pb-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                Log Audit
              </span>
              <h2 className="font-display text-xl font-medium text-ink">
                Status Update Timeline
              </h2>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {(order.history || []).map((hist, idx) => (
                <div key={hist.id || idx} className="relative">
                  <span className="absolute -left-6 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-background ring-4 ring-surface">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  </span>

                  <div className="rounded-2xl border border-border/80 bg-background p-4 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase text-ink tracking-wider">
                        {hist.status.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-muted font-mono">
                        {new Date(hist.createdAt).toLocaleTimeString("en-PK", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    {hist.note && (
                      <p className="text-muted text-[11px] leading-relaxed pt-1">
                        {hist.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Ordered Items & Client Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Ordered Items Summary */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-xs space-y-4">
              <div className="border-b border-border pb-3">
                <h3 className="font-display text-lg font-medium text-ink">
                  Ordered Outfits ({order.items?.length || 0})
                </h3>
              </div>

              <div className="divide-y divide-border/60 space-y-3">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="pt-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-ink">{item.productName}</p>
                      <p className="text-[11px] text-muted">
                        Size: <span className="font-semibold text-ink">{item.size}</span> · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-ink">{formatMoney(item.price * 10)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-center text-sm font-bold text-ink">
                <span>Total Amount:</span>
                <span className="text-amber-800 text-base">{formatMoney(order.totalAmount * 10)}</span>
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 text-amber-700 font-semibold uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                <span>Shipping Address</span>
              </div>
              <p className="font-medium text-ink">{order.shippingAddress}</p>
              <div className="pt-2 border-t border-border/60 space-y-1 text-muted">
                <p>Phone: <strong className="text-ink">{order.customerPhone}</strong></p>
                <p>Email: <strong className="text-ink">{order.customerEmail}</strong></p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
