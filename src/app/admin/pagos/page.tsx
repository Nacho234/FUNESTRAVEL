import { PaymentsManager } from "@/components/admin/sales/payments-manager";

export const metadata = { title: "Pagos" };

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <PaymentsManager openNew={sp.nuevo === "1"} />;
}
