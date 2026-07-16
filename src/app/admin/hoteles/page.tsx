import type { Metadata } from "next";
import { HotelsManager } from "@/components/admin/catalog/hotels-manager";

export const metadata: Metadata = { title: "Hoteles" };

export default function AdminHotelsPage() {
  return <HotelsManager />;
}
