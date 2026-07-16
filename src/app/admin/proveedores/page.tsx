import type { Metadata } from "next";
import { EnvelopeSimpleIcon, PhoneIcon } from "@phosphor-icons/react/dist/ssr";
import { providers } from "@/data/admin";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Proveedores" };

// Reference date for the demo dataset.
const TODAY = new Date("2026-07-15");

function contractStatus(until: string) {
  const days = Math.round((new Date(until).getTime() - TODAY.getTime()) / 86400000);
  if (days < 0) return <Badge tone="danger">Contrato vencido</Badge>;
  if (days <= 90) return <Badge tone="warning">Vence en {days} días</Badge>;
  return <Badge tone="positive">Vigente</Badge>;
}

export default function AdminProvidersPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-bold tracking-tight text-petrol-900">Proveedores</h1>
      <p className="mt-1 text-sm text-graphite-500">
        Operadores, receptivos, aéreas y asistencia con los que trabaja la agencia, y el estado de cada contrato.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {providers.map((p) => (
          <article key={p.name} className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-lift)]">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="font-display text-base font-bold text-petrol-900">{p.name}</h2>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">{p.kind}</p>
              </div>
              {contractStatus(p.contractUntil)}
            </div>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {p.services.map((s) => (
                <li key={s} className="rounded-full bg-sand-50 px-2.5 py-0.5 text-xs font-medium text-graphite-600">
                  {s}
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 border-t border-graphite-100 pt-3.5 text-sm">
              <div className="flex items-center gap-2 text-graphite-700">
                <dt className="sr-only">Contacto</dt>
                <dd className="font-semibold">{p.contactName}</dd>
              </div>
              <div className="flex items-center gap-2 text-graphite-600">
                <EnvelopeSimpleIcon className="size-4 text-graphite-400" aria-hidden />
                <dd>{p.contactEmail}</dd>
              </div>
              <div className="flex items-center gap-2 text-graphite-600">
                <PhoneIcon className="size-4 text-graphite-400" aria-hidden />
                <dd className="tabular">{p.phone}</dd>
              </div>
              <div className="flex items-center gap-2 text-graphite-600">
                <dt className="text-graphite-500">Contrato hasta:</dt>
                <dd className="tabular">{formatDate(p.contractUntil)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
