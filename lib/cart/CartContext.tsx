"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { DetailedProduct } from "@/lib/data/mockProducts";
import confetti from "canvas-confetti";

export type CartItem = {
  product: DetailedProduct;
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
  addItem: (product: DetailedProduct, options?: { quantity?: number; color?: string; size?: string }) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  
  // Quick View Modal
  quickViewProduct: DetailedProduct | null;
  setQuickViewProduct: (product: DetailedProduct | null) => void;
  
  // 3D Studio Modal
  model3dProduct: DetailedProduct | null;
  setModel3dProduct: (product: DetailedProduct | null) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "atelier_cart_items_v2";
const WISHLIST_STORAGE_KEY = "atelier_wishlist_items_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<DetailedProduct | null>(null);
  const [model3dProduct, setModel3dProduct] = useState<DetailedProduct | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist, isMounted]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (
    product: DetailedProduct,
    options?: { quantity?: number; color?: string; size?: string },
  ) => {
    const qty = options?.quantity ?? 1;
    const chosenColor = options?.color || product.colors[0]?.name || "Default";
    const chosenSize = options?.size || product.sizes[0] || "Standard";

    setItems((prev) => {
      const index = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === chosenColor &&
          item.selectedSize === chosenSize,
      );

      if (index > -1 && prev[index]) {
        const updated = [...prev];
        const current = prev[index]!;
        updated[index] = {
          ...current,
          quantity: current.quantity + qty,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: qty,
            selectedColor: chosenColor,
            selectedSize: chosenSize,
          },
        ];
      }
    });

    setIsOpen(true);

    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.85, x: 0.85 },
        colors: ["#dfb15b", "#1a1816", "#e6e1d8"],
      });
    } catch {
      // ignore
    }
  };

  const removeItem = (productId: string, color?: string, size?: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (!color || item.selectedColor === color) &&
            (!size || item.selectedSize === size)
          ),
      ),
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    color?: string,
    size?: string,
  ) => {
    if (quantity <= 0) {
      removeItem(productId, color, size);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          (!color || item.selectedColor === color) &&
          (!size || item.selectedSize === size)
        ) {
          return { ...item, quantity };
        }
        return item;
      }),
    );
  };

  const clearCart = () => setItems([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalCents = items.reduce(
    (acc, item) => acc + item.product.priceCents * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
