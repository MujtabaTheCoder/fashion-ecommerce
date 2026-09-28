"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { DetailedProduct } from "@/lib/data/mockProducts";
import { useUIModals } from "@/lib/ui/UIModalContext";
import { useWishlist } from "@/lib/wishlist/WishlistContext";

export type CompactCartProduct = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  compareAtCents?: number | null;
  categoryLabel?: string;
  images: Array<{ src: string; alt: string }>;
  colors?: Array<{ name: string; hex: string }>;
  sizes?: string[];
};

export type CartItem = {
  product: CompactCartProduct;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  subtotalCents: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (
    product: DetailedProduct | CompactCartProduct,
    options?: { quantity?: number; color?: string; size?: string },
  ) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;

  // Backwards compatibility delegations
  quickViewProduct: DetailedProduct | null;
  setQuickViewProduct: (product: DetailedProduct | null) => void;
  model3dProduct: DetailedProduct | null;
  setModel3dProduct: (product: DetailedProduct | null) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "atelier_cart_items_v3";

function readInitialCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Trims a bulky DetailedProduct down to strictly required cart properties.
 * Eliminates paragraphs of descriptions, care guides, and unused fields from storage & RAM.
 */
function trimToCartProduct(p: DetailedProduct | CompactCartProduct): CompactCartProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    categoryLabel: p.categoryLabel,
    images: p.images.slice(0, 1),
    colors: p.colors?.slice(0, 4),
    sizes: p.sizes,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readInitialCart);
  const [isOpen, setIsOpen] = useState(false);

  // Modular Contexts
  const { quickViewProduct, setQuickViewProduct, model3dProduct, setModel3dProduct } = useUIModals();
  const { wishlist, isWishlisted, toggleWishlist } = useWishlist();

  const syncItems = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // ignore quota errors
    }
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (
      product: DetailedProduct | CompactCartProduct,
      options?: { quantity?: number; color?: string; size?: string },
    ) => {
      const qty = options?.quantity ?? 1;
      const compact = trimToCartProduct(product);
      const chosenColor = options?.color || compact.colors?.[0]?.name || "Default";
      const chosenSize = options?.size || compact.sizes?.[0] || "Standard";

      setItems((prev) => {
        const index = prev.findIndex(
          (item) =>
            item.product.id === compact.id &&
            item.selectedColor === chosenColor &&
            item.selectedSize === chosenSize,
        );

        let next: CartItem[];
        if (index > -1 && prev[index]) {
          next = [...prev];
          const current = prev[index]!;
          next[index] = {
            ...current,
            quantity: current.quantity + qty,
          };
        } else {
          next = [
            ...prev,
            {
              product: compact,
              quantity: qty,
              selectedColor: chosenColor,
              selectedSize: chosenSize,
            },
          ];
        }

        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      setIsOpen(true);

      // Dynamic on-demand confetti import (Zero initial bundle cost)
      import("canvas-confetti")
        .then((confettiModule) => {
          const confetti = confettiModule.default ?? confettiModule;
          confetti({
            particleCount: 35,
            spread: 60,
            origin: { y: 0.85, x: 0.85 },
            colors: ["#dfb15b", "#1a1816", "#e6e1d8"],
          });
        })
        .catch(() => {});
    },
    [],
  );

  const removeItem = useCallback(
    (productId: string, color?: string, size?: string) => {
      setItems((prev) => {
        const next = prev.filter(
          (item) =>
            !(
              item.product.id === productId &&
              (!color || item.selectedColor === color) &&
              (!size || item.selectedSize === size)
            ),
        );
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, color?: string, size?: string) => {
      if (quantity <= 0) {
        removeItem(productId, color, size);
        return;
      }

      setItems((prev) => {
        const next = prev.map((item) => {
          if (
            item.product.id === productId &&
            (!color || item.selectedColor === color) &&
            (!size || item.selectedSize === size)
          ) {
            return { ...item, quantity };
          }
          return item;
        });
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    syncItems([]);
  }, [syncItems]);

  const itemCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );

  const subtotalCents = useMemo(
    () =>
      items.reduce(
        (acc, item) => acc + item.product.priceCents * item.quantity,
        0,
      ),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotalCents,
      isOpen,
      setIsOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      quickViewProduct,
      setQuickViewProduct,
      model3dProduct,
      setModel3dProduct,
      wishlist,
      toggleWishlist,
      isWishlisted,
    }),
    [
      items,
      itemCount,
      subtotalCents,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      quickViewProduct,
      setQuickViewProduct,
      model3dProduct,
      setModel3dProduct,
      wishlist,
      toggleWishlist,
      isWishlisted,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
