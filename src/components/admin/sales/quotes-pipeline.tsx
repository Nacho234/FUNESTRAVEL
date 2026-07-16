"use client";

import { useEffect, useMemo, useState } from "react";
import { ClockIcon, PlusIcon } from "@phosphor-icons/react";
import { adminQuotes } from "@/data/admin";
import { quoteDrafts, type QuoteDraft, type QuoteOptionDraft } from "@/data/admin-sales";
import { formatDate, formatMoney } from "@/lib/format";
import { AdminButton, Drawer, PageHeader, StatusBadge, useToast } from "../ui";
import { usePermissions } from "./permissions";

/** Quotes CRM: kanban pipeline + full option editor in a wide drawer. */

const PIPE = ["nueva", "en preparación", "enviada", "en negociación", "aceptada"] as const;
type PipeStatus = (typeof PIPE)[number] | "vencida";

interface QuoteRow {
  id: string;
  customer: string;
  destination: string;
  travelers: string;
  approxDate: string;
  status: PipeStatus;
  advisor: string;
  validUntil: string;
  valueUsd: number;
  nextAction: string;
  source: "sistema" | "web";
}

const statusMap: Record<string, PipeStatus> = {
  recibida: "nueva",
  "en-revision": "en preparación",
  "propuesta-enviada": "enviada",
  aprobada: "aceptada",
  vencida: "vencida",
};

const demoValues: Record<string, number> = {
  "Q-2026-0218": 9200,
  "Q-2026-0217": 11920,
  "Q-2026-0216": 3780,
  "Q-2026-0215": 9720,
  "Q-2026-0214": 6450,
  "Q-2026-0209": 5200,
};

const demoNextAction: Record<string, string> = {
  "Q-2026-0218": "Armar propuesta con Andes (exóticos)",
  "Q-2026-0217": "Ajustar fechas a 2.ª quincena de enero",
  "Q-2026-0216": "Llamar antes del vencimiento (18/7)",
  "Q-2026-0215": "Cliente comparando con otra agencia",
  "Q-2026-0214": "Pasar a reserva y pedir seña",
  "Q-2026-0209": "Reabrir en agosto con nueva salida",
};

const emptyOption = (tier: QuoteOptionDraft["tier"]): QuoteOptionDraft => ({
  tier,
  flight: "",
  hotel: "",
  regime: "Desayuno",
  transfers: "Regulares compartidos",
  insurance: "Cobertura USD 60.000",
  priceUsd: 0,
  installments: "6 cuotas",
  included: tier !== "premium",
});

const usd = (n: number) => formatMoney({ amount: n, currency: "USD" });

function hoursTo(dateIso: string): number {
  return Math.round((new Date(`${dateIso}T23:59:00`).getTime() - Date.now()) / 3600000);
}

export function QuotesPipeline({ openNew = false }: { openNew?: boolean }) {
  const [rows, setRows] = useState<QuoteRow[]>(() =>
    adminQuotes.map((q) => ({
      id: q.id,
      customer: q.customer,
      destination: q.destination,
      travelers: q.travelers,
      approxDate: q.approxDate,
      status: q.id === "Q-2026-0215" ? "en negociación" : statusMap[q.status],
      advisor: q.advisor,
      validUntil: q.validUntil,
      valueUsd: demoValues[q.id] ?? 3000,
      nextAction: demoNextAction[q.id] ?? "Definir próxima acción",
      source: "sistema",
    })),
  );
  const [selected, setSelected] = useState<QuoteRow | null>(null);
  const [draft, setDraft] = useState<QuoteDraft | null>(null);
  const [isNew, setIsNew] = useState(openNew);
  const { showToast, toastNode } = useToast();
  const { can } = usePermissions();

  // Merge web quote requests (demo)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("ft-quotes");
      if (!raw) return;
      const web = JSON.parse(raw) as { id: string; destination: string; travelers: string; approxDate: string; createdAt: string }[];
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time merge of client-only storage
      setRows((prev) => [
        ...web
          .filter((w) => !prev.some((p) => p.id === w.id))
          .map((w) => ({
            id: w.id,
            customer: "Cliente web (a completar)",
            destination: w.destination,
            travelers: w.travelers,
            approxDate: w.approxDate,
            status: "nueva" as PipeStatus,
            advisor: "Sin asignar",
            validUntil: "2026-07-31",
            valueUsd: 0,
            nextAction: "Contactar y calificar la consulta",
            source: "web" as const,
          })),
        ...prev,
      ]);
    } catch {
      // ignore
    }
  }, []);

  const openEditor = (row: QuoteRow | null) => {
    if (row) {
      setSelected(row);
      const existing = quoteDrafts.find((d) => d.quoteId === row.id);
      setDraft(
        existing
          ? structuredClone(existing)
          : {
              quoteId: row.id,
              marginPct: 12,
              validUntil: row.validUntil,
              conditions: "Precios por persona en base doble, sujetos a disponibilidad al confirmar.",
              options: [emptyOption("económica"), emptyOption("recomendada"), emptyOption("premium")],
            },
      );
    } else {
      const id = `Q-2026-${String(219 + rows.filter((r) => r.source === "sistema").length).padStart(4, "0")}`;
      const fresh: QuoteRow = {
        id,
        customer: "",
        destination: "",
        travelers: "2 adultos",
        approxDate: "",
        status: "nueva",
        advisor: "Sofía Gachet",
        validUntil: "2026-07-31",
        valueUsd: 0,
        nextAction: "Completar datos y preparar opciones",
        source: "sistema",
      };
      setSelected(fresh);
      setIsNew(true);
      setDraft({
        quoteId: id,
        marginPct: 12,
        validUntil: "2026-07-31",
        conditions: "Precios por persona en base doble, sujetos a disponibilidad al confirmar.",
        options: [emptyOption("económica"), emptyOption("recomendada"), emptyOption("premium")],
      });
    }
  };

  const closeEditor = () => {
    setSelected(null);
    setDraft(null);
    setIsNew(false);
  };

  const saveDraft = () => {
    if (!selected) return;
    if (isNew) {
      if (!selected.customer.trim() || !selected.destination.trim()) {
        showToast("Completá cliente y destino para guardar");
        return;
      }
      setRows((rs) => [{ ...selected, status: "en preparación" }, ...rs.filter((r) => r.id !== selected.id)]);
    } else {
      setRows((rs) => rs.map((r) => (r.id === selected.id ? selected : r)));
    }
    showToast("Borrador guardado");
    closeEditor();
  };

  const columns = useMemo(
    () =>
      PIPE.map((status) => {
        const items = rows.filter((r) => r.status === status);
        return { status, items, totalUsd: items.reduce((s, r) => s + r.valueUsd, 0) };
      }),
    [rows],
  );
  const expired = rows.filter((r) => r.status === "vencida");

  const updateOption = (i: number, patch: Partial<QuoteOptionDraft>) => {
    setDraft((d) => (d ? { ...d, options: d.options.map((o, j) => (j === i ? { ...o, ...patch } : o)) } : d));
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Cotizaciones"
        description="El pipeline comercial completo, de la consulta a la propuesta aceptada."
        breadcrumb={[{ label: "Cotizaciones" }]}
        actions={
          <AdminButton onClick={() => openEditor(null)}>
            <PlusIcon weight="bold" className="size-4" aria-hidden /> Nueva cotización
          </AdminButton>
        }
      />

      {/* Pipeline */}
      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[1080px] grid-cols-5 gap-3">
          {columns.map((col) => (
            <div key={col.status} className="rounded-xl border border-graphite-200/70 bg-sand-50/50">
              <div className="border-b border-graphite-100 px-3 py-2.5">
                <p className="text-xs font-bold uppercase tracking-wide text-graphite-600">{col.status}</p>
                <p className="mt-0.5 text-[0.6875rem] text-graphite-500 tabular">
                  {col.items.length} · {usd(col.totalUsd)}
                </p>
              </div>
              <div className="space-y-2 p-2">
                {col.items.length === 0 && <p className="px-2 py-4 text-center text-xs text-graphite-400">Vacío</p>}
                {col.items.map((q) => {
                  const hrs = hoursTo(q.validUntil);
                  const urgent = hrs < 48;
                  return (
                    <button
                      key={q.id}
                      onClick={() => openEditor(q)}
                      className="block w-full rounded-lg border border-graphite-200/70 bg-white p-3 text-left transition-colors hover:border-teal-500/60 cursor-pointer"
                    >
                      <p className="text-xs font-bold text-petrol-900 tabular">
                        {q.id}
                        {q.source === "web" && (
                          <span className="ml-1.5 rounded-full bg-teal-50 px-1.5 py-0.5 text-[0.625rem] font-bold text-teal-600">Web</span>
                        )}
                      </p>
                      <p className="mt-0.5 truncate text-sm font-medium text-graphite-800">{q.customer || "Cliente a completar"}</p>
                      <p className="truncate text-xs text-graphite-500">{q.destination}</p>
                      {q.valueUsd > 0 && <p className="mt-1 text-xs font-semibold text-graphite-700 tabular">{usd(q.valueUsd)}</p>}
                      <p className={`mt-1 flex items-center gap-1 text-[0.6875rem] ${urgent ? "font-semibold text-danger-700" : "text-graphite-500"}`}>
                        <ClockIcon className="size-3 shrink-0" aria-hidden />
                        Vence {formatDate(q.validUntil)}
                      </p>
                      <p className="mt-1 truncate text-[0.6875rem] text-graphite-500">→ {q.nextAction}</p>
                      <p className="mt-0.5 text-[0.6875rem] text-graphite-400">{q.advisor}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expired */}
      {expired.length > 0 && (
        <section className="mt-4 rounded-xl border border-graphite-200/70 bg-white p-4">
          <h2 className="text-sm font-bold text-petrol-900">Vencidas y archivadas</h2>
          <ul className="mt-2 divide-y divide-graphite-100">
            {expired.map((q) => (
              <li key={q.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                <div>
                  <span className="font-semibold text-graphite-700 tabular">{q.id}</span>
                  <span className="ml-2 text-graphite-600">{q.customer} · {q.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status="vencida" />
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setRows((rs) => rs.map((r) => (r.id === q.id ? { ...r, status: "en preparación", validUntil: "2026-08-15" } : r)));
                      showToast(`${q.id} reabierta con nueva vigencia`);
                    }}
                  >
                    Reabrir
                  </AdminButton>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Editor */}
      <Drawer wide open={Boolean(selected)} onClose={closeEditor} title={isNew ? "Nueva cotización" : `Cotización ${selected?.id}`}>
        {selected && draft && (
          <div className="space-y-6">
            {/* Header data */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="q-customer" className="mb-1 block text-sm font-semibold text-graphite-800">
                  Cliente
                </label>
                <input
                  id="q-customer"
                  value={selected.customer}
                  onChange={(e) => setSelected((s) => (s ? { ...s, customer: e.target.value } : s))}
                  className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="Nombre del cliente"
                />
              </div>
              <div>
                <label htmlFor="q-dest" className="mb-1 block text-sm font-semibold text-graphite-800">
                  Destino
                </label>
                <input
                  id="q-dest"
                  value={selected.destination}
                  onChange={(e) => setSelected((s) => (s ? { ...s, destination: e.target.value } : s))}
                  className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="Destino del viaje"
                />
              </div>
              <div>
                <label htmlFor="q-travelers" className="mb-1 block text-sm font-semibold text-graphite-800">
                  Viajeros
                </label>
                <input
                  id="q-travelers"
                  value={selected.travelers}
                  onChange={(e) => setSelected((s) => (s ? { ...s, travelers: e.target.value } : s))}
                  className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="q-valid" className="mb-1 block text-sm font-semibold text-graphite-800">
                  Vigencia
                </label>
                <input
                  id="q-valid"
                  type="date"
                  value={draft.validUntil}
                  onChange={(e) => {
                    setDraft((d) => (d ? { ...d, validUntil: e.target.value } : d));
                    setSelected((s) => (s ? { ...s, validUntil: e.target.value } : s));
                  }}
                  className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm tabular focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Options */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-petrol-900">Opciones de la propuesta</h3>
              {draft.options.map((opt, i) => (
                <div key={opt.tier} className={`rounded-xl border p-4 ${opt.included ? "border-graphite-200/70 bg-white" : "border-dashed border-graphite-200 bg-sand-50/50 opacity-70"}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-bold capitalize text-petrol-900">Opción {opt.tier}</p>
                    <label className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-graphite-600">
                      <input
                        type="checkbox"
                        checked={opt.included}
                        onChange={(e) => updateOption(i, { included: e.target.checked })}
                        className="size-3.5 accent-teal-600 cursor-pointer"
                      />
                      Incluir en el envío
                    </label>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        ["Vuelos", "flight"],
                        ["Hotel", "hotel"],
                        ["Traslados", "transfers"],
                        ["Seguro", "insurance"],
                      ] as const
                    ).map(([label, key]) => (
                      <div key={key}>
                        <label htmlFor={`opt-${i}-${key}`} className="mb-0.5 block text-xs font-semibold text-graphite-600">
                          {label}
                        </label>
                        <input
                          id={`opt-${i}-${key}`}
                          value={opt[key]}
                          onChange={(e) => updateOption(i, { [key]: e.target.value })}
                          className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-2.5 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                    ))}
                    <div>
                      <label htmlFor={`opt-${i}-regime`} className="mb-0.5 block text-xs font-semibold text-graphite-600">
                        Régimen
                      </label>
                      <select
                        id={`opt-${i}-regime`}
                        value={opt.regime}
                        onChange={(e) => updateOption(i, { regime: e.target.value })}
                        className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-2.5 py-1.5 text-sm cursor-pointer focus:border-teal-500 focus:outline-none"
                      >
                        {["Solo alojamiento", "Desayuno", "Media pensión", "Pensión completa", "All inclusive", "Plan de comidas Disney"].map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={`opt-${i}-price`} className="mb-0.5 block text-xs font-semibold text-graphite-600">
                          Precio (USD p/persona)
                        </label>
                        <input
                          id={`opt-${i}-price`}
                          type="number"
                          min={0}
                          value={opt.priceUsd}
                          onChange={(e) => updateOption(i, { priceUsd: Number(e.target.value) })}
                          className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-2.5 py-1.5 text-sm tabular focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor={`opt-${i}-inst`} className="mb-0.5 block text-xs font-semibold text-graphite-600">
                          Cuotas
                        </label>
                        <select
                          id={`opt-${i}-inst`}
                          value={opt.installments}
                          onChange={(e) => updateOption(i, { installments: e.target.value })}
                          className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-2.5 py-1.5 text-sm cursor-pointer focus:border-teal-500 focus:outline-none"
                        >
                          {["Contado", "3 cuotas", "6 cuotas", "12 cuotas"].map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Margin + conditions */}
            <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
              {can("ver-margenes") ? (
                <div>
                  <label htmlFor="q-margin" className="mb-1 block text-sm font-semibold text-graphite-800">
                    Margen aplicado
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id="q-margin"
                      type="number"
                      min={0}
                      max={40}
                      value={draft.marginPct}
                      onChange={(e) => setDraft((d) => (d ? { ...d, marginPct: Number(e.target.value) } : d))}
                      className="w-20 rounded-[var(--radius-control)] border border-graphite-200 px-2.5 py-2 text-sm tabular focus:border-teal-500 focus:outline-none"
                    />
                    <span className="text-sm text-graphite-500">%</span>
                  </div>
                </div>
              ) : (
                <p className="self-end text-xs text-graphite-500">Margen visible solo con permiso financiero.</p>
              )}
              <div>
                <label htmlFor="q-cond" className="mb-1 block text-sm font-semibold text-graphite-800">
                  Condiciones
                </label>
                <textarea
                  id="q-cond"
                  rows={2}
                  value={draft.conditions}
                  onChange={(e) => setDraft((d) => (d ? { ...d, conditions: e.target.value } : d))}
                  className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Tracking */}
            {draft.tracking && (
              <section className="rounded-xl border border-teal-100 bg-teal-50/50 p-4">
                <h3 className="text-sm font-bold text-petrol-900">Seguimiento</h3>
                <div className="mt-2 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                  <p className="text-graphite-600">Enviada el <span className="font-semibold text-graphite-800">{formatDate(draft.tracking.sentAt)}</span></p>
                  <p className="text-graphite-600">Aperturas: <span className="font-semibold text-graphite-800 tabular">{draft.tracking.opens}</span> · Clicks: <span className="font-semibold text-graphite-800 tabular">{draft.tracking.clicks}</span></p>
                  <p className="text-graphite-600 sm:col-span-2">Próxima acción: <span className="font-semibold text-graphite-800">{draft.tracking.nextAction}</span></p>
                </div>
              </section>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 border-t border-graphite-100 pt-4">
              <AdminButton variant="secondary" onClick={saveDraft}>
                Guardar borrador
              </AdminButton>
              <AdminButton
                onClick={() => {
                  if (!isNew) setRows((rs) => rs.map((r) => (r.id === selected.id && r.status === "nueva" ? { ...r, status: "enviada" } : r.id === selected.id && r.status === "en preparación" ? { ...r, status: "enviada" } : r)));
                  showToast("PDF generado y enviado (demo)");
                }}
              >
                Enviar PDF (demo)
              </AdminButton>
              <AdminButton
                variant="secondary"
                onClick={() => showToast("Link interactivo copiado (demo)")}
              >
                Enviar link (demo)
              </AdminButton>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
