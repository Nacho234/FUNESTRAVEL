import type { Metadata } from "next";
import { QuotesBoard } from "@/components/admin/quotes-board";

export const metadata: Metadata = { title: "Cotizaciones" };

export default function AdminQuotesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-bold tracking-tight text-petrol-900">Cotizaciones</h1>
      <p className="mt-1 text-sm text-graphite-500">
        Pipeline de solicitudes: de la consulta inicial a la propuesta aprobada. Las Web llegan del formulario del sitio.
      </p>
      <div className="mt-6">
        <QuotesBoard />
      </div>
    </div>
  );
}
