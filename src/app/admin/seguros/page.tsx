import type { Metadata } from "next";
import { InsurancesManager } from "@/components/admin/catalog/insurances-manager";

export const metadata: Metadata = { title: "Seguros" };

export default function AdminInsurancesPage() {
  return <InsurancesManager />;
}
