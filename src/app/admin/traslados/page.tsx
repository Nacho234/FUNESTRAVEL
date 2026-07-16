import type { Metadata } from "next";
import { TransfersManager } from "@/components/admin/catalog/transfers-manager";

export const metadata: Metadata = { title: "Traslados" };

export default function AdminTransfersPage() {
  return <TransfersManager />;
}
