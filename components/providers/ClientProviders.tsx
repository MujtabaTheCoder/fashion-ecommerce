"use client";

import React from "react";
import dynamic from "next/dynamic";
import { UIModalProvider } from "@/lib/ui/UIModalContext";
import { WishlistProvider } from "@/lib/wishlist/WishlistContext";
import { CartProvider } from "@/lib/cart/CartContext";
import { OrderProvider } from "@/lib/orders/OrderContext";
import { ProductProvider } from "@/lib/products/ProductContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

// Dynamically split heavy interactive modals off the critical initial rendering path
const ProductQuickViewModal = dynamic(
  () =>
    import("@/components/product/ProductQuickViewModal").then(
      (mod) => mod.ProductQuickViewModal,
    ),
  { ssr: false },
);

// High-impact code split: isolates Three.js (600KB+) entirely from initial bundle
const Product3DModal = dynamic(
  () =>
    import("@/components/product/Product3DModal").then(
      (mod) => mod.Product3DModal,
    ),
  { ssr: false },
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ProductProvider>
      <OrderProvider>
        <WishlistProvider>
          <UIModalProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <ProductQuickViewModal />
              <Product3DModal />
            </CartProvider>
          </UIModalProvider>
        </WishlistProvider>
      </OrderProvider>
    </ProductProvider>
  );
}
