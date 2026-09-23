"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Order, OrderItem, OrderStatus, OrderStatusHistory } from "@/lib/types/orders";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { createClient } from "@supabase/supabase-js";

interface OrderContextType {
  orders: Order[];
  isRealtimeConnected: boolean;
  createOrder: (data: {
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    totalAmount: number;
    items: Array<{ productName: string; quantity: number; size: string; price: number }>;
    paymentMethod?: string;
  }) => Promise<Order>;
  updateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    trackingNumber?: string
  ) => Promise<void>;
  lookupOrder: (orderNumber: string, phoneOrEmail: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;
  getOrderById: (id: string) => Order | undefined;
  clearAllOrders: () => void;
  deleteOrder: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STORAGE_KEY = "atelier_realtime_orders_v4";

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  // Initialize orders state from localStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    } catch {
      setOrders([]);
    }
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders, isMounted]);

  // Supabase Realtime Subscription setup (if Supabase env vars are provided)
  useEffect(() => {
    const env = getSupabasePublicEnv();
    if (!env) return;

    try {
      const supabase = createClient(env.url, env.anonKey);
      
      const channel = supabase
        .channel("realtime_orders_channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "orders" },
          (payload) => {
            console.log("Realtime order payload:", payload);
            setIsRealtimeConnected(true);

            if (payload.eventType === "INSERT") {
              const newRecord = payload.new as any;
              setOrders((prev) => {
                if (prev.some((o) => o.id === newRecord.id)) return prev;
                const formatted: Order = {
                  id: newRecord.id,
                  orderNumber: newRecord.order_number,
                  customerEmail: newRecord.customer_email,
                  customerPhone: newRecord.customer_phone,
                  shippingAddress: newRecord.shipping_address,
                  status: newRecord.status,
                  trackingNumber: newRecord.tracking_number,
                  totalAmount: Number(newRecord.total_amount),
                  createdAt: newRecord.created_at,
                  updatedAt: newRecord.updated_at,
                  items: [],
                  history: [
                    {
                      id: `hist-${Date.now()}`,
                      orderId: newRecord.id,
                      status: newRecord.status,
                      note: "Order Placed & Confirmed",
                      createdAt: newRecord.created_at,
                    },
                  ],
                };
                return [formatted, ...prev];
              });
            } else if (payload.eventType === "UPDATE") {
              const updated = payload.new as any;
              setOrders((prev) =>
                prev.map((o) => {
                  if (o.id === updated.id) {
                    return {
                      ...o,
                      status: updated.status,
                      trackingNumber: updated.tracking_number || o.trackingNumber,
                      updatedAt: updated.updated_at,
                    };
                  }
                  return o;
                })
              );
            }
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setIsRealtimeConnected(true);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Fallback to local memory engine
    }
  }, []);

  // Create new Order
  const createOrder = useCallback(
    async (data: {
      customerEmail: string;
      customerPhone: string;
      shippingAddress: string;
      totalAmount: number;
      items: Array<{ productName: string; quantity: number; size: string; price: number }>;
      paymentMethod?: string;
    }): Promise<Order> => {
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

      // Push to local state
      setOrders((prev) => [newOrder, ...prev]);

      // If Supabase configured, attempt remote insert asynchronously
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
          console.warn("Supabase remote insert fallback to local:", err);
        }
      }

      return newOrder;
    },
    []
  );

  // Update Order Status (Admin)
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

      setOrders((prev) =>
        prev.map((o) => {
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
        })
      );

      // Async update Supabase if configured
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
    []
  );

  // Lookup Order by orderNumber AND phone/email
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
    [orders]
  );

  const getOrderByNumber = useCallback(
    (orderNumber: string): Order | undefined => {
      const cleanNumber = orderNumber.trim().toUpperCase().replace(/^#/, "");
      return orders.find((o) => o.orderNumber.toUpperCase().replace(/^#/, "") === cleanNumber);
    },
    [orders]
  );

  const getOrderById = useCallback(
    (id: string): Order | undefined => {
      return orders.find((o) => o.id === id);
    },
    [orders]
  );

  const clearAllOrders = useCallback(() => {
    setOrders([]);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {
      // ignore
    }
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        isRealtimeConnected,
        createOrder,
        updateOrderStatus,
        lookupOrder,
        getOrderByNumber,
        getOrderById,
        clearAllOrders,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
