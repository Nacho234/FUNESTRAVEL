import type { Metadata } from "next";
import { ExcursionsManager } from "@/components/admin/catalog/excursions-manager";

export const metadata: Metadata = { title: "Excursiones" };

export default function AdminExcursionsPage() {
  return <ExcursionsManager />;
}
