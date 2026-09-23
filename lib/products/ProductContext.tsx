"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<DetailedProduct[]>(MOCK_PRODUCTS);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      // Clear old cached product keys from localStorage
      localStorage.removeItem("atelier_live_products_v2");
      localStorage.removeItem("atelier_live_products");
      localStorage.removeItem("atelier_live_products_v1");

      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If parsed list has fewer than 12 products (old cache), update with new catalog
        const womenCount = parsed.filter((p: DetailedProduct) => p.category === "women").length;
        const menCount = parsed.filter((p: DetailedProduct) => p.category === "men").length;

        if (womenCount >= 6 && menCount >= 6) {
          setProducts(parsed);
        } else {
          setProducts(MOCK_PRODUCTS);
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS));
        }
      } else {
        setProducts(MOCK_PRODUCTS);
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS));
      }
    } catch {
      setProducts(MOCK_PRODUCTS);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products, isMounted]);

  const addProduct = (newProd: Omit<DetailedProduct, "id">) => {
    const fullProd: DetailedProduct = {
      ...newProd,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [fullProd, ...prev]);
  };

  const updateProductPrice = (id: string, newPriceCents: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, priceCents: newPriceCents } : p)),
    );
  };

  const toggleStockStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p)),
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProductPrice,
        toggleStockStatus,
        deleteProduct,
        getProductBySlug,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
