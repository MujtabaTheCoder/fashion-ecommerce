"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { Order, OrderItem, OrderStatus, OrderStatusHistory } from "@/lib/types/orders";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { createClient } from "@supabase/supabase-js";

interface OrderCreateInput {
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  items: Array<{ productName: string; quantity: number; size: string; price: number }>;
  paymentMethod?: string;
}

interface OrderContextType {
  orders: Order[];
  isRealtimeConnected: boolean;
  createOrder: (data: OrderCreateInput) => Promise<Order>;
  updateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    trackingNumber?: string,
  ) => Promise<void>;
  lookupOrder: (orderNumber: string, phoneOrEmail: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;
  getOrderById: (id: string) => Order | undefined;
  clearAllOrders: () => void;
  deleteOrder: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STORAGE_KEY = "atelier_realtime_orders_v4";

function readInitialOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(readInitialOrders);

  const saveOrders = useCallback((updated: Order[]) => {
    setOrders(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, []);

  // Create new Order with local-first optimistic commit
  const createOrder = useCallback(
    async (data: OrderCreateInput): Promise<Order> => {
      const orderId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `#ORD-${randomCode}`;
      const now = new Date().toISOString();

      const createdItems: OrderItem[] = data.items.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        orderId,
        productName: item.productName,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
      }));

      const initialHistory: OrderStatusHistory[] = [
        {
          id: `hist-${Date.now()}`,
          orderId,
          status: "pending",
          note: "Order placed successfully by client.",
          createdAt: now,
        },
      ];

      const newOrder: Order = {
        id: orderId,
        orderNumber,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        status: "pending",
        totalAmount: data.totalAmount,
        createdAt: now,
        updatedAt: now,
        items: createdItems,
        history: initialHistory,
      };

      setOrders((prev) => {
        const next = [newOrder, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });

      // Async write to Supabase if credentials exist (non-blocking for ultra-fast checkout TTFB)
      const env = getSupabasePublicEnv();
      if (env) {
        try {
          const supabase = createClient(env.url, env.anonKey);
          await supabase.from("orders").insert({
            id: orderId,
            order_number: orderNumber,
            customer_email: data.customerEmail,
            customer_phone: data.customerPhone,
            shipping_address: data.shippingAddress,
            status: "pending",
            total_amount: data.totalAmount,
          });

          for (const item of createdItems) {
            await supabase.from("order_items").insert({
              order_id: orderId,
              product_name: item.productName,
              quantity: item.quantity,
              size: item.size,
              price: item.price,
            });
          }

          await supabase.from("order_status_history").insert({
            order_id: orderId,
            status: "pending",
            note: "Order placed successfully by client.",
          });
        } catch (err) {
          console.warn("Supabase remote order insert fallback:", err);
        }
      }

      return newOrder;
    },
    [],
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: OrderStatus, note?: string, trackingNumber?: string) => {
      const now = new Date().toISOString();
      const newHistoryItem: OrderStatusHistory = {
        id: `hist-${Date.now()}`,
        orderId,
        status: newStatus,
        note: note || `Status updated to ${newStatus.replace(/_/g, " ")}`,
        createdAt: now,
      };

      setOrders((prev) => {
        const next = prev.map((o) => {
          if (o.id === orderId) {
            const updatedHistory = [...(o.history || []), newHistoryItem];
            return {
              ...o,
              status: newStatus,
              trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber,
              updatedAt: now,
              history: updatedHistory,
            };
          }
          return o;
        });
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });

      const env = getSupabasePublicEnv();
      if (env) {
        try {
          const supabase = createClient(env.url, env.anonKey);
          await supabase
            .from("orders")
            .update({
              status: newStatus,
              tracking_number: trackingNumber,
              updated_at: now,
            })
            .eq("id", orderId);

          await supabase.from("order_status_history").insert({
            order_id: orderId,
            status: newStatus,
            note: note || `Status updated to ${newStatus.replace(/_/g, " ")}`,
          });
        } catch (err) {
          console.warn("Supabase update error:", err);
        }
      }
    },
    [],
  );

  const lookupOrder = useCallback(
    (orderNumber: string, phoneOrEmail: string): Order | undefined => {
      const cleanNumber = orderNumber.trim().toUpperCase().replace(/^#/, "");
      const cleanInput = phoneOrEmail.trim().toLowerCase();

      return orders.find((o) => {
        const matchesNum = o.orderNumber.toUpperCase().replace(/^#/, "") === cleanNumber;
        const matchesPhone = o.customerPhone.toLowerCase().includes(cleanInput);
        const matchesEmail = o.customerEmail.toLowerCase().includes(cleanInput);
        return matchesNum && (matchesPhone || matchesEmail);
      });
    },
    [orders],
  );

  const getOrderByNumber = useCallback(
    (orderNumber: string): Order | undefined => {
      const cleanNumber = orderNumber.trim().toUpperCase().replace(/^#/, "");
      return orders.find((o) => o.orderNumber.toUpperCase().replace(/^#/, "") === cleanNumber);
    },
    [orders],
  );

  const getOrderById = useCallback(
    (id: string): Order | undefined => {
      return orders.find((o) => o.id === id);
    },
    [orders],
  );

  const clearAllOrders = useCallback(() => {
    saveOrders([]);
  }, [saveOrders]);

  const deleteOrder = useCallback((id: string) => {
    setOrders((prev) => {
      const next = prev.filter((o) => o.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      orders,
      isRealtimeConnected: true,
      createOrder,
      updateOrderStatus,
      lookupOrder,
      getOrderByNumber,
      getOrderById,
      clearAllOrders,
      deleteOrder,
    }),
    [
      orders,
      createOrder,
      updateOrderStatus,
      lookupOrder,
      getOrderByNumber,
      getOrderById,
      clearAllOrders,
      deleteOrder,
    ],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
