"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

// ── Hardcoded Admin Credentials ──────────────────────────────────────────────
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "atelier2026";
const SESSION_KEY = "atelier_admin_session";
// ─────────────────────────────────────────────────────────────────────────────

type AdminAuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

function readInitialAuth(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(readInitialAuth);

  const login = useCallback((username: string, password: string): boolean => {
    if (
      username.trim().toLowerCase() === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD
    ) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        /* ignore */
      }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
