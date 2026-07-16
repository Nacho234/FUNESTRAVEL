import type { Metadata } from "next";
import { ProvidersManager } from "@/components/admin/catalog/providers-manager";

export const metadata: Metadata = { title: "Proveedores" };

export default function AdminProvidersPage() {
  return <ProvidersManager />;
}
