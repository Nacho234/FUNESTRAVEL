import { ClientsView } from "@/components/admin/crm/clients-view";

export const metadata = { title: "Clientes" };

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <ClientsView startCreating={sp.nuevo === "1"} />;
}
