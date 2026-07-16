import type { Metadata } from "next";
import { BookingsTable } from "@/components/admin/bookings-table";

export const metadata: Metadata = { title: "Reservas" };

export default function AdminBookingsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-bold tracking-tight text-petrol-900">Reservas</h1>
      <p className="mt-1 text-sm text-graphite-500">
        Todas las reservas de la agencia. Las marcadas como Web entraron solas desde el sitio y esperan asignación de asesor.
      </p>
      <div className="mt-6">
        <BookingsTable />
      </div>
    </div>
  );
}
