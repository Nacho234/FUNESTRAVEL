import type { Metadata } from "next";
import { FlightsManager } from "@/components/admin/catalog/flights-manager";

export const metadata: Metadata = { title: "Vuelos" };

export default function AdminFlightsPage() {
  return <FlightsManager />;
}
