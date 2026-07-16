import { DocumentsView } from "@/components/admin/crm/documents-view";

export const metadata = { title: "Documentación" };

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <DocumentsView startCreating={sp.nuevo === "1"} />;
}
