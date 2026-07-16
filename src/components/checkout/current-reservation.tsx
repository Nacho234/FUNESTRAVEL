"use client";

import Link from "next/link";
import { SuitcaseRollingIcon } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";
import { getPackage } from "@/data/packages";
import { formatDate, formatMoney } from "@/lib/format";
import { computeTotal } from "@/components/packages/booking-panel";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CurrentReservation() {
  const { draft, setDraft, bookings, ready } = useStore();

  if (!ready) {
    return <div className="h-48 animate-pulse rounded-2xl bg-graphite-100" />;
  }

  const pkg = draft ? getPackage(draft.packageSlug) : undefined;
  const calc = draft && pkg ? computeTotal(pkg, draft.departureId, draft.adults, draft.children) : null;

  return (
    <div className="space-y-10">
      <section>
        <h1 className="font-display text-3xl font-bold tracking-tight text-petrol-900">Mi reserva actual</h1>
        {draft && pkg && calc ? (
          <div className="mt-5 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge tone="teal">En curso, sin confirmar</Badge>
                <h2 className="mt-2 font-display text-xl font-bold text-petrol-900">{pkg.name}</h2>
                <p className="mt-1 text-sm text-graphite-600">
                  Salida {formatDate(calc.departure.date)} · {draft.adults + draft.children} pasajeros ·{" "}
                  {formatMoney({ amount: calc.total, currency: "USD" })} estimado
                </p>
                <p className="mt-2 text-xs text-graphite-500">
                  Los lugares no quedan bloqueados hasta que confirmes. Si la salida se llena, te proponemos otra fecha.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <ButtonLink href="/checkout">Continuar la reserva</ButtonLink>
                <button
                  onClick={() => setDraft(null)}
                  className="text-sm font-semibold text-graphite-500 hover:text-danger-700 cursor-pointer"
                >
                  Descartar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-[var(--radius-card)] bg-white p-10 text-center shadow-[var(--shadow-lift)]">
            <SuitcaseRollingIcon className="mx-auto size-10 text-graphite-300" aria-hidden />
            <p className="mt-3 font-semibold text-graphite-800">No tenés ninguna reserva en curso</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-graphite-500">
              Cuando elijas un paquete y una fecha, tu reserva aparece acá para retomarla cuando quieras.
            </p>
            <ButtonLink href="/paquetes" className="mt-5">Explorar paquetes</ButtonLink>
          </div>
        )}
      </section>

      {bookings.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold text-petrol-900">Reservas confirmadas</h2>
          <ul className="mt-4 space-y-3">
            {bookings.map((b) => {
              const bpkg = getPackage(b.packageSlug);
              return (
                <li key={b.code} className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-lift)]">
                  <div>
                    <p className="font-semibold text-graphite-800">
                      {bpkg?.name ?? b.packageSlug} <span className="text-graphite-400">·</span>{" "}
                      <span className="tabular text-sm text-graphite-500">{b.code}</span>
                    </p>
                    <p className="text-sm text-graphite-500">
                      {b.adults + b.children} pasajeros · {formatMoney({ amount: b.totalUsd, currency: "USD" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={b.status === "confirmada" ? "positive" : b.status === "pendiente-de-pago" ? "warning" : "teal"}>
                      {b.status === "confirmada" ? "Confirmada" : b.status === "pendiente-de-pago" ? "Pendiente de pago" : "En revisión"}
                    </Badge>
                    <Link href="/cuenta" className="text-sm font-semibold text-teal-600 hover:underline">
                      Ver en mi cuenta
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
