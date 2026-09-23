"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const session = sessionStorage.getItem(SESSION_KEY);
      if (session === "true") setIsAuthenticated(true);
    } catch {
      // ignore
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (
      username.trim().toLowerCase() === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD
    ) {
      setIsAuthenticated(true);
      try { sessionStorage.setItem(SESSION_KEY, "true"); } catch { /* ignore */ }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  };

  if (!isMounted) return null;

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
