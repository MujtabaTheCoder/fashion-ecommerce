"use client";

import React from "react";
import { CartProvider } from "@/lib/cart/CartContext";
import { OrderProvider } from "@/lib/orders/OrderContext";
import { ProductProvider } from "@/lib/products/ProductContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductQuickViewModal } from "@/components/product/ProductQuickViewModal";
import { Product3DModal } from "@/components/product/Product3DModal";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ProductProvider>
      <OrderProvider>
        <CartProvider>
          {children}
          <CartDrawer />
          <ProductQuickViewModal />
          <Product3DModal />
        </CartProvider>
      </OrderProvider>
    </ProductProvider>
  );
}

