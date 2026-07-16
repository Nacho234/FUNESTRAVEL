import type { Metadata } from "next";
import Link from "next/link";
import { CurrentReservation } from "@/components/checkout/current-reservation";

export const metadata: Metadata = {
  title: "Mi reserva",
  robots: { index: false },
};

export default function ReservationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 pb-20">
      <CurrentReservation />
      <p className="mt-8 text-sm text-graphite-500">
        ¿Reservaste desde otro dispositivo?{" "}
        <Link href="/reserva/recuperar" className="font-semibold text-teal-600 hover:underline">
          Recuperá tu reserva con el código
        </Link>
        .
      </p>
    </div>
  );
}
