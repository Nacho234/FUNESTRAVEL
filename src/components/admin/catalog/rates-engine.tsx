"use client";

import { useMemo, useState } from "react";
import { packages } from "@/data/packages";
import { rateHistory } from "@/data/admin-catalog";
import { formatDate } from "@/lib/format";
import { AdminButton, PageHeader, SectionCard, StatusBadge, useToast } from "../ui";
import { usePerms } from "./use-perms";

/**
 * Rates engine: cost + markup + taxes → final price per departure, with a
 * simulator, bulk updates and an audited change history.
 */

interface RateRow {
  departureId: string;
  date: string;
  cost: number;
  markupPct: number;
  taxPct: number;
  currency: "USD";
  dirty: boolean;
}

function finalPrice(r: { cost: number; markupPct: number; taxPct: number }): number {
  return Math.round(r.cost * (1 + r.markupPct / 100) * (1 + r.taxPct / 100));
}

export function RatesEngine() {
  const [slug, setSlug] = useState(packages[0].slug);
  const pkg = useMemo(() => packages.find((p) => p.slug === slug)!, [slug]);
  const { showToast, toastNode } = useToast();
  const { has } = usePerms();
  const canCosts = has("ver-costos");
  const canApprove = has("aprobar");

  const [rows, setRows] = useState<RateRow[]>(() =>
    pkg.departures.map((d) => ({
      departureId: d.id,
      date: d.date,
      cost: Math.round(d.pricePerPerson.amount / 1.21 / 1.17),
      markupPct: 17,
      taxPct: 21,
      currency: "USD" as const,
      dirty: false,
    })),
  );

  const selectPackage = (nextSlug: string) => {
    setSlug(nextSlug);
    const next = packages.find((p) => p.slug === nextSlug)!;
    setRows(
      next.departures.map((d) => ({
        departureId: d.id,
        date: d.date,
        cost: Math.round(d.pricePerPerson.amount / 1.21 / 1.17),
        markupPct: 17,
        taxPct: 21,
        currency: "USD" as const,
        dirty: false,
      })),
    );
  };

  const update = (id: string, patch: Partial<RateRow>) => {
    setRows((rs) => rs.map((r) => (r.departureId === id ? { ...r, ...patch, dirty: true } : r)));
  };

  const saveRow = (id: string) => {
    setRows((rs) => rs.map((r) => (r.departureId === id ? { ...r, dirty: false } : r)));
    showToast(canApprove ? "Tarifa guardada y auditada" : "Cambio enviado a aprobación");
  };

  // Simulador
  const [simCost, setSimCost] = useState(1000);
  const [simMarkup, setSimMarkup] = useState(17);
  const [simTax, setSimTax] = useState(21);
  const simFinal = finalPrice({ cost: simCost, markupPct: simMarkup, taxPct: simTax });
  const simMargin = Math.round(simCost * (simMarkup / 100));

  // Actualización masiva
  const [bulkPct, setBulkPct] = useState(5);
  const [confirmBulk, setConfirmBulk] = useState(false);

  const applyBulk = () => {
    setRows((rs) => rs.map((r) => ({ ...r, cost: Math.round(r.cost * (1 + bulkPct / 100)), dirty: true })));
    setConfirmBulk(false);
    showToast(`Costos actualizados ${bulkPct > 0 ? "+" : ""}${bulkPct}% (pendiente de guardar)`);
  };

  const inputClass =
    "w-20 rounded-md border border-graphite-200 px-2 py-1 text-right text-sm tabular focus:border-teal-500 focus:outline-none";

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Tarifas"
        description="Motor de precios: costo, markup e impuestos componen el precio final por salida."
        breadcrumb={[{ label: "Tarifas" }]}
        actions={
          <select
            value={slug}
            onChange={(e) => selectPackage(e.target.value)}
            className="rounded-[var(--radius-control)] border border-graphite-200 bg-white px-3 py-2 text-sm font-semibold cursor-pointer focus:border-teal-500 focus:outline-none"
            aria-label="Elegir paquete"
          >
            {packages.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        }
      />

      <div className="mb-4 rounded-xl border border-warning-700/25 bg-warning-100/50 px-4 py-3 text-sm text-graphite-700">
        Todo cambio de precio queda registrado en la auditoría con usuario, fecha y valores anteriores.
        {!canApprove && " Tu rol requiere aprobación de gerencia para publicar cambios."}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <div className="min-w-0 space-y-4">
          <SectionCard title={`Tarifario: ${pkg.name}`} description="El precio final se recalcula en vivo al editar.">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-graphite-100 text-left text-xs font-bold uppercase tracking-wide text-graphite-500">
                    <th className="px-2 py-2">Salida</th>
                    {canCosts && <th className="px-2 py-2 text-right">Costo USD</th>}
                    <th className="px-2 py-2 text-right">Markup %</th>
                    <th className="px-2 py-2 text-right">Impuestos %</th>
                    <th className="px-2 py-2 text-right">Precio final</th>
                    {canCosts && <th className="px-2 py-2 text-right">Margen</th>}
                    <th className="px-2 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-graphite-100">
                  {rows.map((r) => {
                    const price = finalPrice(r);
                    const margin = Math.round(r.cost * (r.markupPct / 100));
                    return (
                      <tr key={r.departureId}>
                        <td className="px-2 py-2.5 font-semibold text-graphite-800 whitespace-nowrap tabular">{formatDate(r.date)}</td>
                        {canCosts && (
                          <td className="px-2 py-2.5 text-right">
                            <input
                              type="number"
                              value={r.cost}
                              onChange={(e) => update(r.departureId, { cost: Number(e.target.value) })}
                              className={`${inputClass} w-24`}
                              aria-label={`Costo salida ${formatDate(r.date)}`}
                            />
                          </td>
                        )}
                        <td className="px-2 py-2.5 text-right">
                          <input
                            type="number"
                            value={r.markupPct}
                            onChange={(e) => update(r.departureId, { markupPct: Number(e.target.value) })}
                            className={inputClass}
                            aria-label={`Markup salida ${formatDate(r.date)}`}
                          />
                        </td>
                        <td className="px-2 py-2.5 text-right">
                          <input
                            type="number"
                            value={r.taxPct}
                            onChange={(e) => update(r.departureId, { taxPct: Number(e.target.value) })}
                            className={inputClass}
                            aria-label={`Impuestos salida ${formatDate(r.date)}`}
                          />
                        </td>
                        <td className="px-2 py-2.5 text-right font-bold text-petrol-900 tabular">USD {price.toLocaleString("es-AR")}</td>
                        {canCosts && <td className="px-2 py-2.5 text-right tabular text-positive-700">USD {margin.toLocaleString("es-AR")}</td>}
                        <td className="px-2 py-2.5 text-right">
                          <AdminButton size="sm" variant={r.dirty ? "primary" : "secondary"} disabled={!r.dirty} onClick={() => saveRow(r.departureId)}>
                            Guardar
                          </AdminButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="Actualización masiva" description="Aplicá un ajuste porcentual a los costos de todas las salidas del paquete.">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-graphite-700">
                Ajuste
                <input
                  type="number"
                  value={bulkPct}
                  onChange={(e) => setBulkPct(Number(e.target.value))}
                  className="w-20 rounded-md border border-graphite-200 px-2 py-1.5 text-right text-sm tabular focus:border-teal-500 focus:outline-none"
                />
                %
              </label>
              {!confirmBulk ? (
                <AdminButton variant="secondary" onClick={() => setConfirmBulk(true)}>
                  Aplicar a {rows.length} salidas
                </AdminButton>
              ) : (
                <span className="flex items-center gap-2 text-sm">
                  <span className="text-graphite-600">
                    ¿Aplicar {bulkPct > 0 ? "+" : ""}
                    {bulkPct}% a todas las salidas de {pkg.name}?
                  </span>
                  <AdminButton size="sm" onClick={applyBulk}>
                    Confirmar
                  </AdminButton>
                  <AdminButton size="sm" variant="ghost" onClick={() => setConfirmBulk(false)}>
                    Cancelar
                  </AdminButton>
                </span>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Historial de cambios" description="Últimos movimientos de tarifas (auditados).">
            <ul className="divide-y divide-graphite-100 text-sm">
              {rateHistory.map((c) => (
                <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2.5 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium text-graphite-800">{c.target}</p>
                    <p className="text-xs text-graphite-500">
                      {c.user} · {formatDate(c.date)}
                    </p>
                  </div>
                  <p className="text-xs tabular">
                    <span className="text-graphite-400 line-through">{c.before}</span>{" "}
                    <span className="font-bold text-graphite-800">{c.after}</span>
                  </p>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        {/* Simulador */}
        <div className="min-w-0 space-y-4">
          <SectionCard title="Simulador de tarifa" description="Probá combinaciones sin tocar el tarifario.">
            <div className="space-y-3">
              {[
                { label: "Costo (USD)", value: simCost, set: setSimCost },
                { label: "Markup (%)", value: simMarkup, set: setSimMarkup },
                { label: "Impuestos (%)", value: simTax, set: setSimTax },
              ].map((f) => (
                <label key={f.label} className="flex items-center justify-between gap-3 text-sm text-graphite-700">
                  {f.label}
                  <input
                    type="number"
                    value={f.value}
                    onChange={(e) => f.set(Number(e.target.value))}
                    className="w-28 rounded-md border border-graphite-200 px-2.5 py-1.5 text-right text-sm tabular focus:border-teal-500 focus:outline-none"
                  />
                </label>
              ))}
              <div className="rounded-lg bg-petrol-50 px-4 py-3">
                <p className="flex items-baseline justify-between text-sm">
                  <span className="text-graphite-600">Precio final</span>
                  <span className="font-display text-xl font-bold text-petrol-900 tabular">USD {simFinal.toLocaleString("es-AR")}</span>
                </p>
                <p className="mt-1 flex items-baseline justify-between text-xs text-graphite-500">
                  <span>Margen bruto</span>
                  <span className="font-semibold text-positive-700 tabular">USD {simMargin.toLocaleString("es-AR")}</span>
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Composición del precio">
            <ol className="space-y-1.5 text-sm text-graphite-600">
              <li>1. Costo neto del proveedor.</li>
              <li>2. Markup de agencia sobre el costo.</li>
              <li>3. Impuestos y percepciones sobre el subtotal.</li>
            </ol>
            <p className="mt-3 text-xs text-graphite-500">
              Los precios publicados en el sitio son por persona en base doble. Las comisiones de canal se
              descuentan del margen en el módulo Finanzas.
            </p>
          </SectionCard>

          <SectionCard title="Estado">
            <div className="flex items-center justify-between text-sm">
              <span className="text-graphite-600">Cambios sin guardar</span>
              {rows.some((r) => r.dirty) ? <StatusBadge status="pendiente" /> : <StatusBadge status="conciliado" />}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
