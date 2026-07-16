import { PromotionsAdmin } from "@/components/admin/marketing/promotions-admin";

export const metadata = { title: "Promociones" };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  return <PromotionsAdmin openNew={sp.nueva === "1"} />;
}
