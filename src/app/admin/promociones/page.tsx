import type { Metadata } from "next";
import { PromotionsManager } from "@/components/admin/promotions-manager";

export const metadata: Metadata = { title: "Promociones" };

export default function AdminPromotionsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-bold tracking-tight text-petrol-900">Promociones</h1>
      <p className="mt-1 text-sm text-graphite-500">
        Las promociones publicadas muestran siempre condiciones completas en el sitio. Vigencia controlada desde acá.
      </p>
      <div className="mt-6">
        <PromotionsManager />
      </div>
    </div>
  );
}
