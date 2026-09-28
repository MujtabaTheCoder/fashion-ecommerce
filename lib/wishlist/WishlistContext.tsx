"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

const WISHLIST_STORAGE_KEY = "atelier_wishlist_items_v3";

interface WishlistContextType {
  wishlist: string[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function readStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>(readStorage);
  const [wishlistSet, setWishlistSet] = useState<Set<string>>(() => new Set(readStorage()));

  // Keep Set synchronized with minimal overhead
  const updateWishlist = useCallback((newItems: string[]) => {
    setItems(newItems);
    setWishlistSet(new Set(newItems));
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // ignore
    }
  }, []);

  const toggleWishlist = useCallback(
    (id: string) => {
      const next = wishlistSet.has(id)
        ? items.filter((itemId) => itemId !== id)
        : [...items, id];
      updateWishlist(next);
    },
    [items, wishlistSet, updateWishlist],
  );

  const isWishlisted = useCallback(
    (id: string) => wishlistSet.has(id),
    [wishlistSet],
  );

  const value = useMemo(
    () => ({
      wishlist: items,
      isWishlisted,
      toggleWishlist,
    }),
    [items, isWishlisted, toggleWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
