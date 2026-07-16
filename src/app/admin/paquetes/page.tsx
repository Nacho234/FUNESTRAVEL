import type { Metadata } from "next";
import { PackagesAdmin } from "@/components/admin/catalog/packages-admin";

export const metadata: Metadata = { title: "Paquetes" };

export default async function AdminPackagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const slug = typeof sp.slug === "string" ? sp.slug : undefined;
  const isNew = sp.nuevo === "1";
  return <PackagesAdmin slug={slug} isNew={isNew} />;
}
