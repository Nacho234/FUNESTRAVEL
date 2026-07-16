import { InboxView } from "@/components/admin/crm/inbox-view";

export const metadata = { title: "Consultas" };

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <InboxView startCreating={sp.nueva === "1"} />;
}
