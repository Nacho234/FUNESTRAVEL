import type { Metadata } from "next";
import { RatesEditor } from "@/components/admin/rates-editor";

export const metadata: Metadata = { title: "Tarifas" };

export default function AdminRatesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-bold tracking-tight text-petrol-900">Tarifas y disponibilidad</h1>
      <p className="mt-1 text-sm text-graphite-500">
        Precio y cupo por salida. Elegí un paquete para editar su tarifario.
      </p>
      <div className="mt-6">
        <RatesEditor />
      </div>
    </div>
  );
}
