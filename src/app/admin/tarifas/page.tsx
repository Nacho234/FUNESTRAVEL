import type { Metadata } from "next";
import { RatesEngine } from "@/components/admin/catalog/rates-engine";

export const metadata: Metadata = { title: "Tarifas" };

export default function AdminRatesPage() {
  return <RatesEngine />;
}
