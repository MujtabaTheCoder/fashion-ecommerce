"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { MOCK_PRODUCTS, type DetailedProduct } from "@/lib/data/mockProducts";

type ProductContextType = {
  products: DetailedProduct[];
  addProduct: (product: Omit<DetailedProduct, "id">) => void;
  updateProductPrice: (id: string, newPriceCents: number) => void;
  toggleStockStatus: (id: string) => void;
  deleteProduct: (id: string) => void;
  getProductBySlug: (slug: string) => DetailedProduct | undefined;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = "atelier_live_outfits_v5";

function readInitialProducts(): DetailedProduct[] {
  if (typeof window === "undefined") return MOCK_PRODUCTS;
  try {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const womenCount = parsed.filter((p: DetailedProduct) => p.category === "women").length;
      const menCount = parsed.filter((p: DetailedProduct) => p.category === "men").length;
      if (womenCount >= 6 && menCount >= 6) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return MOCK_PRODUCTS;
}

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<DetailedProduct[]>(readInitialProducts);

  const addProduct = useCallback(
    (newProd: Omit<DetailedProduct, "id">) => {
      const fullProd: DetailedProduct = {
        ...newProd,
        id: `prod-${Date.now()}`,
      };
      setProducts((prev) => {
        const next = [fullProd, ...prev];
        try {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [],
  );

  const updateProductPrice = useCallback((id: string, newPriceCents: number) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, priceCents: newPriceCents } : p));
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const toggleStockStatus = useCallback((id: string) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p));
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const getProductBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products],
  );

  const value = useMemo(
    () => ({
      products,
      addProduct,
      updateProductPrice,
      toggleStockStatus,
      deleteProduct,
      getProductBySlug,
    }),
    [
      products,
      addProduct,
      updateProductPrice,
      toggleStockStatus,
      deleteProduct,
      getProductBySlug,
    ],
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
