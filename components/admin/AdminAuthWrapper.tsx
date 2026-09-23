"use client";

import React from "react";
import { useAdminAuth } from "@/lib/admin/AdminAuthContext";
import { AdminLoginGate } from "@/components/admin/AdminLoginGate";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLoginGate />;
  }

  return <AdminSidebar>{children}</AdminSidebar>;
}
