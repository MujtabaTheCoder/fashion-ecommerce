"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { DetailedProduct } from "@/lib/data/mockProducts";

interface UIModalContextType {
  quickViewProduct: DetailedProduct | null;
  setQuickViewProduct: (product: DetailedProduct | null) => void;
  model3dProduct: DetailedProduct | null;
  setModel3dProduct: (product: DetailedProduct | null) => void;
  closeAllModals: () => void;
}

const UIModalContext = createContext<UIModalContextType | undefined>(undefined);

export function UIModalProvider({ children }: { children: React.ReactNode }) {
  const [quickViewProduct, setQuickViewProductState] = useState<DetailedProduct | null>(null);
  const [model3dProduct, setModel3dProductState] = useState<DetailedProduct | null>(null);

  const setQuickViewProduct = useCallback((product: DetailedProduct | null) => {
    setQuickViewProductState(product);
  }, []);

  const setModel3dProduct = useCallback((product: DetailedProduct | null) => {
    setModel3dProductState(product);
  }, []);

  const closeAllModals = useCallback(() => {
    setQuickViewProductState(null);
    setModel3dProductState(null);
  }, []);

  const value = useMemo(
    () => ({
      quickViewProduct,
      setQuickViewProduct,
      model3dProduct,
      setModel3dProduct,
      closeAllModals,
    }),
    [quickViewProduct, setQuickViewProduct, model3dProduct, setModel3dProduct, closeAllModals],
  );

  return <UIModalContext.Provider value={value}>{children}</UIModalContext.Provider>;
}

export function useUIModals() {
  const context = useContext(UIModalContext);
  if (!context) {
    throw new Error("useUIModals must be used within a UIModalProvider");
  }
  return context;
}
