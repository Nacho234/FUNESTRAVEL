import type { Metadata } from "next";
import { ProductsManager } from "@/components/admin/products-manager";

export const metadata: Metadata = { title: "Productos" };

export default function AdminProductsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-bold tracking-tight text-petrol-900">Productos</h1>
      <p className="mt-1 text-sm text-graphite-500">
        Paquetes publicados en el sitio. Los cupos restantes suman todas las salidas cargadas.
      </p>
      <div className="mt-6">
        <ProductsManager />
      </div>
    </div>
  );
}
