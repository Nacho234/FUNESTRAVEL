import type { Metadata } from "next";
import { DestinationsGrid } from "@/components/admin/catalog/destinations-grid";

export const metadata: Metadata = { title: "Destinos" };

export default function AdminDestinationsPage() {
  return <DestinationsGrid />;
}
