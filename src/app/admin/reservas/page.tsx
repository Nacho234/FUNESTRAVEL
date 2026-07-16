import { BookingsManager } from "@/components/admin/sales/bookings-manager";

export const metadata = { title: "Reservas" };

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <BookingsManager openNew={sp.nueva === "1"} />;
}
