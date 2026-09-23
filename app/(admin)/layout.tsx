import React from "react";
import { AdminAuthProvider } from "@/lib/admin/AdminAuthContext";
import { AdminAuthWrapper } from "@/components/admin/AdminAuthWrapper";

export const metadata = {
  title: "Owner Portal · ATELIER",
  description: "Live order management and analytics for ATELIER luxury store.",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AdminAuthProvider>
      <AdminAuthWrapper>{children}</AdminAuthWrapper>
    </AdminAuthProvider>
  );
}
