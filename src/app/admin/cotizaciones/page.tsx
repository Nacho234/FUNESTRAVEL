import { QuotesPipeline } from "@/components/admin/sales/quotes-pipeline";

export const metadata = { title: "Cotizaciones" };

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <QuotesPipeline openNew={sp.nueva === "1"} />;
}
