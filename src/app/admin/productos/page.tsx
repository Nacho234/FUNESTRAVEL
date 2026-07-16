import type { Metadata } from "next";
import { ProductsTable } from "@/components/admin/catalog/products-table";

export const metadata: Metadata = { title: "Productos" };

export default function AdminProductsPage() {
  return <ProductsTable />;
}
