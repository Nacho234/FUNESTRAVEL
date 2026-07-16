import type { Metadata } from "next";
import { AvailabilityBoard } from "@/components/admin/catalog/availability-board";

export const metadata: Metadata = { title: "Disponibilidad" };

export default function AdminAvailabilityPage() {
  return <AvailabilityBoard />;
}
