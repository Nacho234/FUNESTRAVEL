import type { Metadata } from "next";
import Link from "next/link";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { adminBookings, adminMetrics } from "@/data/admin";
import { getPackage } from "@/data/packages";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Dashboard" };

const usd = (n: number) => `USD ${n.toLocaleString("es-AR")}`;

function StatTile({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-lift)]">
      <p className="text-sm text-graphite-500">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold text-petrol-900 tabular">{value}</p>
      {detail && <p className="mt-1 text-xs text-graphite-500">{detail}</p>}
    </div>
  );
}

function SalesChart() {
  const max = Math.max(...adminMetrics.salesByMonth.map((m) => m.salesUsd));
  return (
    <div
      role="img"
      aria-label={`Ventas de los últimos 6 meses: ${adminMetrics.salesByMonth.map((m) => `${m.month} ${usd(m.salesUsd)}`).join(", ")}`}
    >
      <div className="flex items-end gap-3 h-40">
        {adminMetrics.salesByMonth.map((m) => (
          <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-xs font-semibold text-graphite-600 tabular">{Math.round(m.salesUsd / 1000)}k</span>
            <div
              className={`w-full rounded-t-md ${m.month === "Jul" ? "bg-teal-600" : "bg-teal-500/70"}`}
              style={{ height: `${Math.round((m.salesUsd / max) * 120)}px` }}
              aria-hidden
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-3 border-t border-graphite-100 pt-1.5">
        {adminMetrics.salesByMonth.map((m) => (
          <span key={m.month} className="flex-1 text-center text-xs text-graphite-500">
            {m.month}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const upcoming = [...adminBookings]
    .filter((b) => b.status !== "cancelada")
    .sort((a, b) => a.departureDate.localeCompare(b.departureDate))
    .slice(0, 5);

  const pendingPayments = adminBookings.filter((b) => b.status === "pendiente-de-pago");
  const lowSeats = adminBookings
    .map((b) => {
      const pkg = getPackage(b.packageSlug);
      const dep = pkg?.departures.find((d) => d.id.endsWith(b.departureDate) || d.date === b.departureDate);
      return pkg && dep && dep.seatsLeft <= 6 ? { pkg, dep } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    // dedupe by departure
    .filter((x, i, arr) => arr.findIndex((y) => y.dep.id === x.dep.id) === i)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-bold tracking-tight text-petrol-900">Dashboard</h1>
      <p className="mt-1 text-sm text-graphite-500">Resumen operativo · julio 2026</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Ventas del período" value={usd(adminMetrics.monthSalesUsd)} detail={`Ticket promedio ${usd(adminMetrics.avgBookingUsd)}`} />
        <StatTile label="Reservas nuevas" value={String(adminMetrics.newBookings)} detail={`Conversión ${adminMetrics.conversionPct}% sobre consultas`} />
        <StatTile label="Cotizaciones abiertas" value={String(adminMetrics.openQuotes)} detail="2 propuestas por vencer esta semana" />
        <StatTile label="Pagos pendientes" value={usd(adminMetrics.pendingPaymentsUsd)} detail={`${pendingPayments.length} reservas esperan pago`} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
          <h2 className="font-display text-base font-bold text-petrol-900">Ventas últimos 6 meses</h2>
          <div className="mt-4">
            <SalesChart />
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
          <h2 className="font-display text-base font-bold text-petrol-900">Destinos más vendidos</h2>
          <ol className="mt-4 space-y-3">
            {adminMetrics.topDestinations.map((d, i) => (
              <li key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2.5">
                  <span className="grid size-6 place-items-center rounded-full bg-petrol-50 text-xs font-bold text-petrol-800 tabular">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-graphite-800">{d.name}</span>
                </span>
                <span className="text-graphite-500 tabular">{d.bookings} reservas</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-petrol-900">Salidas próximas</h2>
            <Link href="/admin/reservas" className="text-sm font-semibold text-teal-600 hover:underline">
              Ver todas
            </Link>
          </div>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-graphite-500">
                <th className="pb-2 font-semibold">Salida</th>
                <th className="pb-2 font-semibold">Reserva</th>
                <th className="pb-2 font-semibold">Titular</th>
                <th className="pb-2 font-semibold text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-100">
              {upcoming.map((b) => (
                <tr key={b.code}>
                  <td className="py-2.5 text-graphite-800 tabular">{formatDate(b.departureDate)}</td>
                  <td className="py-2.5">
                    <span className="tabular text-graphite-600">{b.code}</span>
                    <span className="block text-xs text-graphite-500">{getPackage(b.packageSlug)?.name ?? b.packageSlug}</span>
                  </td>
                  <td className="py-2.5 text-graphite-800">{b.holderName}</td>
                  <td className="py-2.5 text-right">
                    <Badge tone={b.status === "confirmada" ? "positive" : b.status === "pendiente-de-pago" ? "warning" : "teal"}>
                      {b.status === "confirmada" ? "Confirmada" : b.status === "pendiente-de-pago" ? "Pend. de pago" : "En revisión"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
          <h2 className="font-display text-base font-bold text-petrol-900">Alertas operativas</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {pendingPayments.map((b) => (
              <li key={b.code} className="flex gap-2.5">
                <WarningCircleIcon className="mt-0.5 size-4.5 shrink-0 text-warning-700" aria-hidden />
                <span className="text-graphite-700">
                  <span className="font-semibold">{b.code}</span> ({b.holderName}) espera pago.
                  {b.notes && <span className="block text-xs text-graphite-500">{b.notes}</span>}
                </span>
              </li>
            ))}
            {lowSeats.map(({ pkg, dep }) => (
              <li key={dep.id} className="flex gap-2.5">
                <WarningCircleIcon className="mt-0.5 size-4.5 shrink-0 text-coral-600" aria-hidden />
                <span className="text-graphite-700">
                  Cupos bajos en <span className="font-semibold">{pkg.name}</span> del {formatDate(dep.date)}:{" "}
                  quedan {dep.seatsLeft}.
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
