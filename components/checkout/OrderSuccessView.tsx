"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Printer, ArrowRight, MapPin, Shield, Truck } from "lucide-react";
import { useOrders } from "@/lib/orders/OrderContext";
import { formatMoney } from "@/lib/utils";

export function OrderSuccessView() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { getOrderById, orders } = useOrders();

  const order = (orderId ? getOrderById(orderId) : null) || orders[0];

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="font-display text-2xl">Order Received</h2>
        <p className="mt-2 text-xs text-muted">Thank you for your acquisition.</p>
        <Link
          href="/shop"
          className="mt-6 rounded-full bg-ink px-8 py-3 text-xs font-semibold uppercase tracking-wider text-background"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const cleanNum = order.orderNumber.replace("#", "");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Top Thank You Box */}
      <div className="rounded-3xl border border-emerald-600/30 bg-emerald-500/10 p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.22em] text-emerald-800">
          Acquisition Confirmed
        </span>
        <h1 className="mt-2 font-display text-3xl font-normal text-ink sm:text-4xl md:text-5xl">
          Order Placed Successfully!
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-xs sm:text-sm text-muted">
          Your order has been received by the Atelier and sent for master tailoring and express courier preparation.
        </p>

        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-border bg-surface px-6 py-3 shadow-xs text-xs">
          <div>
            <span className="text-muted">Order Identifier: </span>
            <strong className="font-mono text-ink text-sm">{order.orderNumber}</strong>
          </div>
          {order.trackingNumber && (
            <>
              <span className="text-border">|</span>
              <div>
                <span className="text-muted">Tracking Reference: </span>
                <strong className="font-mono text-emerald-700">{order.trackingNumber}</strong>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Live Tracking Banner */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-800">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-lg font-medium text-ink">Real-Time Visual Order Tracking</h3>
            <p className="text-xs text-muted">Track tailoring, dispatch, and courier stages live.</p>
          </div>
        </div>

        <Link
          href={`/track-order/${cleanNum}`}
          className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-wider text-background hover:scale-105 transition-transform"
        >
          Track Order Live
        </Link>
      </div>

      {/* Order Summary & Details */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-12">
        {/* Purchased Items (7 cols) */}
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xs sm:col-span-7 space-y-4">
          <h3 className="font-display text-lg font-medium text-ink">
            Ordered Apparel ({(order.items || []).length})
          </h3>

          <div className="divide-y divide-border">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-4 text-xs">
                <div>
                  <p className="font-semibold text-ink">{item.productName}</p>
                  <p className="text-[11px] text-muted">
                    Size: <span className="font-bold text-ink">{item.size}</span> · Quantity: {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-ink">
                  {formatMoney(item.price * 10)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 flex justify-between items-center text-sm font-bold text-ink">
            <span>Total Paid Amount:</span>
            <span className="text-amber-800 text-base">{formatMoney(order.totalAmount * 10)}</span>
          </div>
        </div>

        {/* Shipping & Payment Destination (5 cols) */}
        <div className="space-y-6 sm:col-span-5">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-2 font-semibold uppercase tracking-wider text-muted">
              <MapPin className="h-4 w-4 text-ink" />
              <span>Destination Address</span>
            </div>
            <p className="font-semibold text-ink">{order.shippingAddress}</p>
            <div className="pt-2 border-t border-border/60 text-muted space-y-1">
              <p>Phone: <strong className="text-ink">{order.customerPhone}</strong></p>
              <p>Email: <strong className="text-ink">{order.customerEmail}</strong></p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 rounded-full border border-border bg-surface py-3 text-xs font-semibold uppercase tracking-wider text-ink hover:border-ink"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </button>

            <Link
              href="/admin/orders"
              className="flex items-center justify-center gap-2 rounded-full bg-ink py-3 text-xs font-semibold uppercase tracking-wider text-background hover:scale-105 transition-transform"
            >
              <span>View in Owner Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
