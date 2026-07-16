import type { Metadata } from "next";
import { CustomersTable } from "@/components/admin/customers-table";

export const metadata: Metadata = { title: "Clientes" };

export default function AdminCustomersPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-bold tracking-tight text-petrol-900">Clientes</h1>
      <p className="mt-1 text-sm text-graphite-500">
        Base de clientes con historial, valor total y preferencias para vender mejor el próximo viaje.
      </p>
      <div className="mt-6">
        <CustomersTable />
      </div>
    </div>
  );
}
