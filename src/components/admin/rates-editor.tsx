"use client";

import { useState } from "react";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { packages } from "@/data/packages";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

interface EditableDeparture {
  id: string;
  date: string;
  price: number;
  seats: number;
  confirmed: boolean;
}

export function RatesEditor() {
  const [selectedSlug, setSelectedSlug] = useState(packages[0].slug);
  const [edits, setEdits] = useState<Record<string, EditableDeparture[]>>({});
  const [savedRow, setSavedRow] = useState<string | null>(null);

  const pkg = packages.find((p) => p.slug === selectedSlug) ?? packages[0];
  const rows: EditableDeparture[] =
    edits[selectedSlug] ??
    pkg.departures.map((d) => ({
      id: d.id,
      date: d.date,
      price: d.pricePerPerson.amount,
      seats: d.seatsLeft,
      confirmed: d.confirmed,
    }));

  const update = (id: string, patch: Partial<EditableDeparture>) => {
    setEdits((e) => ({
      ...e,
      [selectedSlug]: rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  };

  const save = (id: string) => {
    setSavedRow(id);
    setTimeout(() => setSavedRow(null), 2000);
  };

  const inputClass =
    "w-24 rounded-[var(--radius-control)] border border-graphite-200 bg-white px-2.5 py-1.5 text-right text-sm tabular focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/25";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div>
        <label className="flex flex-col gap-1.5 max-w-md">
          <span className="text-sm font-semibold text-graphite-800">Paquete</span>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="rounded-[var(--radius-control)] border border-graphite-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-graphite-800 cursor-pointer focus:border-teal-500 focus:outline-none"
          >
            {packages.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name} · {p.nights} noches
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4 overflow-x-auto rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)]">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-graphite-500 border-b border-graphite-100">
                <th className="px-4 py-3 font-semibold">Salida</th>
                <th className="px-4 py-3 font-semibold text-right">Precio por persona (USD)</th>
                <th className="px-4 py-3 font-semibold text-right">Cupos</th>
                <th className="px-4 py-3 font-semibold text-right">Estado</th>
                <th className="px-4 py-3" aria-label="Acciones" />
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-sand-50/60">
                  <td className="px-4 py-3 font-medium text-graphite-800 tabular">{formatDate(r.date)}</td>
                  <td className="px-4 py-3 text-right">
                    <label className="sr-only" htmlFor={`price-${r.id}`}>
                      Precio de la salida del {formatDate(r.date)}
                    </label>
                    <input
                      id={`price-${r.id}`}
                      type="number"
                      min={0}
                      value={r.price}
                      onChange={(e) => update(r.id, { price: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <label className="sr-only" htmlFor={`seats-${r.id}`}>
                      Cupos de la salida del {formatDate(r.date)}
                    </label>
                    <input
                      id={`seats-${r.id}`}
                      type="number"
                      min={0}
                      value={r.seats}
                      onChange={(e) => update(r.id, { seats: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.confirmed ? <Badge tone="positive">Confirmada</Badge> : <Badge tone="neutral">Pendiente</Badge>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {savedRow === r.id ? (
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-positive-700" role="status">
                        <CheckCircleIcon weight="fill" className="size-4" aria-hidden /> Guardado
                      </span>
                    ) : (
                      <button
                        onClick={() => save(r.id)}
                        className="rounded-[var(--radius-control)] border border-graphite-200 px-3.5 py-1.5 text-sm font-semibold text-graphite-700 hover:border-petrol-600 cursor-pointer"
                      >
                        Guardar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-graphite-500">
          Demo: los cambios viven en esta pantalla. En producción cada guardado impacta la tarifa publicada y queda auditado.
        </p>
      </div>

      <aside className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-lift)] h-fit">
        <h2 className="font-display text-base font-bold text-petrol-900">Cómo se compone una tarifa</h2>
        <dl className="mt-3 space-y-3 text-sm">
          <div>
            <dt className="font-semibold text-graphite-800">Costo neto</dt>
            <dd className="text-graphite-600">Lo que factura el operador o los prestadores directos (hotel, aéreo, traslados).</dd>
          </div>
          <div>
            <dt className="font-semibold text-graphite-800">Margen de agencia</dt>
            <dd className="text-graphite-600">Sobre el neto, según destino y temporada. El sistema sugiere el margen histórico del producto.</dd>
          </div>
          <div>
            <dt className="font-semibold text-graphite-800">Impuestos</dt>
            <dd className="text-graphite-600">IVA sobre la comisión, percepciones sobre moneda extranjera y tasas locales. Se calculan al cobrar, no acá.</dd>
          </div>
        </dl>
        <p className="mt-4 rounded-lg bg-sand-50 px-3 py-2.5 text-xs leading-relaxed text-graphite-600">
          El precio que cargás en esta tabla es el publicado por persona en base doble, impuestos según la ficha del paquete.
        </p>
      </aside>
    </div>
  );
}
