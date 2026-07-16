"use client";

import { useMemo, useState } from "react";
import { CalendarBlankIcon, CopyIcon, PauseIcon, RocketLaunchIcon } from "@phosphor-icons/react";
import { promoShowcase, promotions } from "@/data/content";
import {
  AdminButton,
  DataTable,
  Drawer,
  PageHeader,
  SectionCard,
  StatusBadge,
  useToast,
  type Column,
  type FilterDef,
} from "@/components/admin/ui";

/** Promotions manager: unified table + full editor with live preview. */

const TODAY = "2026-07-16";

const promoTypes = [
  "descuento porcentual",
  "descuento fijo",
  "cuotas",
  "transferencia",
  "compra anticipada",
  "último minuto",
  "cupos limitados",
  "2x1",
  "beneficio grupal",
  "código promocional",
  "regalo",
  "upgrade",
  "paquete destacado",
];

const destinationOptions = ["Punta Cana", "Cancún", "Bariloche", "Río de Janeiro", "Florianópolis", "Búzios", "Europa", "Grecia", "Turquía"];

interface PromoRow {
  id: string;
  internalName: string;
  title: string;
  subtitle: string;
  badge: string;
  type: string;
  discount: string;
  appliesTo: string[];
  buyFrom: string;
  buyUntil: string;
  travelFrom: string;
  travelUntil: string;
  validUntil: string;
  stock: string;
  conditions: string;
  priority: number;
  ctaLabel: string;
  ctaHref: string;
  status: "publicada" | "borrador" | "pausada" | "programada";
  scheduledAt?: string;
  history: { who: string; when: string; what: string }[];
}

function vigenciaState(validUntil: string): "activa" | "por vencer" | "vencida" {
  if (validUntil < TODAY) return "vencida";
  const days = Math.round((new Date(validUntil).getTime() - new Date(TODAY).getTime()) / 86400000);
  return days <= 15 ? "por vencer" : "activa";
}

const seedRows: PromoRow[] = [
  ...promoShowcase.map((p, i) => ({
    id: p.id,
    internalName: p.id,
    title: p.badge,
    subtitle: p.title,
    badge: p.badge,
    type: p.layout === "hero" ? "cuotas" : p.badge.toLowerCase().includes("anticipada") ? "compra anticipada" : "cupos limitados",
    discount: p.installmentsCount ? `${p.installmentsCount} cuotas sin interés` : "",
    appliesTo: [p.destination],
    buyFrom: "2026-06-01",
    buyUntil: p.validUntil,
    travelFrom: "2026-08-01",
    travelUntil: "2027-03-31",
    validUntil: p.validUntil,
    stock: p.availabilityNote ?? "Sin límite",
    conditions: p.conditions,
    priority: p.priority,
    ctaLabel: p.ctaLabel,
    ctaHref: p.ctaHref,
    status: "publicada" as const,
    history: [
      { who: "Sofía Gachet", when: "2026-07-10 11:20", what: `Publicada en la home (posición ${i + 1})` },
      { who: "Tomás Reggiardo", when: "2026-07-08 16:05", what: "Creación de la promoción" },
    ],
  })),
  ...promotions
    .filter((p) => !promoShowcase.some((s) => s.conditions === p.conditions))
    .map((p) => ({
      id: p.id,
      internalName: p.id,
      title: p.title,
      subtitle: p.detail,
      badge: p.tag,
      type: p.tag === "Descuento" ? "transferencia" : p.tag.toLowerCase(),
      discount: p.tag === "Descuento" ? "5%" : "",
      appliesTo: ["Todos los paquetes internacionales"],
      buyFrom: "2026-06-01",
      buyUntil: p.validUntil,
      travelFrom: "2026-07-01",
      travelUntil: "2027-06-30",
      validUntil: p.validUntil,
      stock: "Sin límite",
      conditions: p.conditions,
      priority: 5,
      ctaLabel: "Ver condiciones",
      ctaHref: p.href,
      status: "publicada" as const,
      history: [{ who: "Sofía Gachet", when: "2026-06-28 10:12", what: "Creación y publicación" }],
    })),
];

function PromoPreview({ promo, mobile }: { promo: PromoRow; mobile: boolean }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-sand-200 bg-sand-50 ${mobile ? "max-w-[280px]" : "max-w-md"}`}>
      <div className="bg-gradient-to-br from-petrol-900 to-petrol-800 p-5 text-ivory">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[0.6875rem] font-bold text-petrol-900">{promo.badge || "Badge"}</span>
          <span className="text-[0.625rem] text-white/70">Hasta {promo.validUntil.split("-").reverse().join("/")}</span>
        </div>
        <p className="mt-3 text-xs uppercase tracking-wide text-teal-100">{promo.title || "Título público"}</p>
        <p className="font-display text-xl font-bold leading-snug">{promo.subtitle || "Subtítulo de la promoción"}</p>
        {promo.discount && <p className="mt-1.5 text-sm font-semibold text-teal-100">{promo.discount}</p>}
        <span className="mt-3 inline-block rounded-lg bg-coral-500 px-3 py-1.5 text-xs font-bold text-white">
          {promo.ctaLabel || "CTA"}
        </span>
      </div>
      <p className="px-4 py-2 text-[0.625rem] leading-snug text-graphite-500">{promo.conditions.slice(0, 110)}…</p>
    </div>
  );
}

export function PromotionsAdmin({ openNew = false }: { openNew?: boolean }) {
  const [rows, setRows] = useState<PromoRow[]>(seedRows);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(openNew);
  const [previewMobile, setPreviewMobile] = useState(false);
  const { showToast, toastNode } = useToast();

  const emptyPromo: PromoRow = useMemo(
    () => ({
      id: "promo-nueva",
      internalName: "",
      title: "",
      subtitle: "",
      badge: "",
      type: promoTypes[0],
      discount: "",
      appliesTo: [],
      buyFrom: TODAY,
      buyUntil: "2026-09-30",
      travelFrom: "2026-08-01",
      travelUntil: "2027-03-31",
      validUntil: "2026-09-30",
      stock: "Sin límite",
      conditions: "",
      priority: 5,
      ctaLabel: "Ver fechas y precios",
      ctaHref: "/promociones",
      status: "borrador",
      history: [],
    }),
    [],
  );

  const [draft, setDraft] = useState<PromoRow | null>(openNew ? emptyPromo : null);
  const selected = rows.find((r) => r.id === selectedId) ?? null;
  const editing = draft ?? selected;

  const openEditor = (row: PromoRow) => {
    setSelectedId(row.id);
    setDraft({ ...row });
    setCreating(false);
  };

  const closeEditor = () => {
    setSelectedId(null);
    setDraft(null);
    setCreating(false);
  };

  const patch = (p: Partial<PromoRow>) => setDraft((d) => (d ? { ...d, ...p } : d));

  const persist = (status: PromoRow["status"], message: string, scheduledAt?: string) => {
    if (!draft) return;
    const entry = { who: "Sofía Gachet", when: `${TODAY} ${new Date().toTimeString().slice(0, 5)}`, what: message };
    const next: PromoRow = { ...draft, status, scheduledAt, history: [entry, ...draft.history] };
    setRows((rs) => (rs.some((r) => r.id === next.id) ? rs.map((r) => (r.id === next.id ? next : r)) : [next, ...rs]));
    showToast(message);
    closeEditor();
  };

  const duplicate = () => {
    if (!editing) return;
    const copy: PromoRow = {
      ...editing,
      id: `promo-${Date.now().toString(36)}`,
      internalName: `${editing.internalName}-copia`,
      status: "borrador",
      history: [{ who: "Sofía Gachet", when: TODAY, what: "Duplicada" }],
    };
    setRows((rs) => [copy, ...rs]);
    showToast("Promoción duplicada como borrador");
    closeEditor();
  };

  const active = rows.filter((r) => r.status === "publicada" && vigenciaState(r.validUntil) === "activa").length;
  const expiring = rows.filter((r) => r.status === "publicada" && vigenciaState(r.validUntil) === "por vencer").length;

  const columns: Column<PromoRow>[] = [
    {
      id: "title",
      header: "Promoción",
      essential: true,
      cell: (r) => (
        <div>
          <p className="font-semibold text-graphite-800">{r.title}</p>
          <p className="max-w-xs truncate text-xs text-graphite-500">{r.subtitle}</p>
        </div>
      ),
      sortValue: (r) => r.title,
    },
    { id: "type", header: "Tipo", cell: (r) => <span className="capitalize text-graphite-600">{r.type}</span>, sortValue: (r) => r.type },
    { id: "applies", header: "Aplica a", cell: (r) => <span className="text-xs text-graphite-600">{r.appliesTo.join(", ") || "Sin definir"}</span> },
    {
      id: "validez",
      header: "Vigencia",
      essential: true,
      cell: (r) => (
        <div className="flex items-center gap-2">
          <span className="text-xs tabular">{r.validUntil.split("-").reverse().join("/")}</span>
          <StatusBadge status={vigenciaState(r.validUntil)} />
        </div>
      ),
      sortValue: (r) => r.validUntil,
    },
    { id: "prio", header: "Prioridad", align: "right", cell: (r) => <span className="tabular">{r.priority}</span>, sortValue: (r) => r.priority },
    { id: "status", header: "Estado", essential: true, cell: (r) => <StatusBadge status={r.status} />, sortValue: (r) => r.status },
  ];

  const filters: FilterDef<PromoRow>[] = [
    { id: "estado", label: "Estado", options: ["publicada", "borrador", "pausada", "programada"], matches: (r, v) => r.status === v },
    { id: "vig", label: "Vigencia", options: ["activa", "por vencer", "vencida"], matches: (r, v) => vigenciaState(r.validUntil) === v },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Promociones"
        description="Creá, programá y pausá promociones sin tocar código. Los cambios impactan en la home y en /promociones."
        breadcrumb={[{ label: "Promociones" }]}
        actions={
          <AdminButton
            onClick={() => {
              setDraft({ ...emptyPromo, id: `promo-${Date.now().toString(36)}` });
              setCreating(true);
            }}
          >
            Nueva promoción
          </AdminButton>
        }
      />

      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: "Activas", value: active },
          { label: "Por vencer (15 días)", value: expiring },
          { label: "Ventas atribuidas (mes)", value: "USD 24.490" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-graphite-200/70 bg-white px-4 py-3">
            <p className="text-xs text-graphite-500">{m.label}</p>
            <p className="mt-0.5 font-display text-xl font-bold text-petrol-900 tabular">{m.value}</p>
          </div>
        ))}
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(r) => r.id}
        searchKeys={(r) => `${r.title} ${r.subtitle} ${r.type} ${r.appliesTo.join(" ")}`}
        searchPlaceholder="Buscar promociones…"
        filters={filters}
        exportName="promociones"
        onRowClick={openEditor}
        emptyTitle="No hay promociones con esos criterios"
        emptyDetail="Creá una nueva promoción o quitá los filtros."
      />

      <Drawer open={Boolean(editing) || creating} onClose={closeEditor} title={creating ? "Nueva promoción" : "Editar promoción"} wide>
        {draft && (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-graphite-800">Nombre interno</span>
                  <input value={draft.internalName} onChange={(e) => patch({ internalName: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-graphite-800">Badge</span>
                  <input value={draft.badge} onChange={(e) => patch({ badge: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1 block font-semibold text-graphite-800">Título público</span>
                  <input value={draft.title} onChange={(e) => patch({ title: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1 block font-semibold text-graphite-800">Subtítulo</span>
                  <input value={draft.subtitle} onChange={(e) => patch({ subtitle: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-graphite-800">Tipo</span>
                  <select value={draft.type} onChange={(e) => patch({ type: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer capitalize focus:border-teal-500 focus:outline-none">
                    {promoTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-graphite-800">Descuento / beneficio</span>
                  <input value={draft.discount} onChange={(e) => patch({ discount: e.target.value })} placeholder="Ej.: 10% · 12 cuotas" className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
                </label>
              </div>

              <div>
                <p className="mb-1.5 text-sm font-semibold text-graphite-800">Destinos y productos aplicables</p>
                <div className="flex flex-wrap gap-1.5">
                  {destinationOptions.map((d) => {
                    const on = draft.appliesTo.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => patch({ appliesTo: on ? draft.appliesTo.filter((x) => x !== d) : [...draft.appliesTo, d] })}
                        aria-pressed={on}
                        className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                          on ? "bg-petrol-900 text-ivory" : "bg-graphite-100 text-graphite-600 hover:bg-petrol-50"
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-graphite-800">Compra desde</span>
                  <input type="date" value={draft.buyFrom} onChange={(e) => patch({ buyFrom: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-graphite-800">Vigencia (hasta)</span>
                  <input type="date" value={draft.validUntil} onChange={(e) => patch({ validUntil: e.target.value, buyUntil: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-graphite-800">Viaje desde</span>
                  <input type="date" value={draft.travelFrom} onChange={(e) => patch({ travelFrom: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-graphite-800">Viaje hasta</span>
                  <input type="date" value={draft.travelUntil} onChange={(e) => patch({ travelUntil: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-graphite-800">Stock / cupos</span>
                  <input value={draft.stock} onChange={(e) => patch({ stock: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-graphite-800">Prioridad (1 = más alta)</span>
                  <input type="number" min={1} max={9} value={draft.priority} onChange={(e) => patch({ priority: Number(e.target.value) })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm tabular focus:border-teal-500 focus:outline-none" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-graphite-800">CTA</span>
                  <input value={draft.ctaLabel} onChange={(e) => patch({ ctaLabel: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-graphite-800">URL destino</span>
                  <input value={draft.ctaHref} onChange={(e) => patch({ ctaHref: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
                </label>
              </div>

              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-graphite-800">Condiciones</span>
                <textarea rows={3} value={draft.conditions} onChange={(e) => patch({ conditions: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
              </label>

              <div className="flex flex-wrap gap-2 border-t border-dashed border-sand-200 pt-4">
                <AdminButton onClick={() => persist("publicada", "Promoción publicada")}>
                  <RocketLaunchIcon className="size-4" aria-hidden /> Publicar ahora
                </AdminButton>
                <AdminButton
                  variant="secondary"
                  onClick={() => {
                    const when = window.prompt("Programar publicación (AAAA-MM-DD HH:MM)", `${TODAY} 09:00`);
                    if (when) persist("programada", `Programada para ${when}`, when);
                  }}
                >
                  <CalendarBlankIcon className="size-4" aria-hidden /> Programar
                </AdminButton>
                {draft.status === "publicada" && (
                  <AdminButton variant="secondary" onClick={() => persist("pausada", "Promoción pausada")}>
                    <PauseIcon className="size-4" aria-hidden /> Pausar
                  </AdminButton>
                )}
                <AdminButton variant="secondary" onClick={duplicate}>
                  <CopyIcon className="size-4" aria-hidden /> Duplicar
                </AdminButton>
                <AdminButton variant="ghost" onClick={() => persist(draft.status, "Borrador guardado")}>
                  Guardar sin publicar
                </AdminButton>
              </div>

              {draft.history.length > 0 && (
                <div className="border-t border-graphite-100 pt-4">
                  <p className="mb-2 text-sm font-semibold text-graphite-800">Historial de cambios</p>
                  <ul className="space-y-1.5">
                    {draft.history.map((h, i) => (
                      <li key={i} className="text-xs text-graphite-500">
                        <span className="font-semibold text-graphite-700">{h.who}</span> · {h.when} · {h.what}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Preview */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-graphite-800">Previsualización</p>
                <div className="flex gap-1 rounded-lg border border-graphite-200 p-0.5" role="group" aria-label="Dispositivo">
                  {[
                    { label: "Desktop", value: false },
                    { label: "Mobile", value: true },
                  ].map((d) => (
                    <button
                      key={d.label}
                      onClick={() => setPreviewMobile(d.value)}
                      aria-pressed={previewMobile === d.value}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                        previewMobile === d.value ? "bg-petrol-900 text-ivory" : "text-graphite-500 hover:text-petrol-800"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <PromoPreview promo={draft} mobile={previewMobile} />
              <p className="mt-2 text-xs leading-snug text-graphite-500">
                Render aproximado de la card en la home. La versión final usa la fotografía y el layout de
                cada posición (hero o secundaria).
              </p>
            </div>
          </div>
        )}
      </Drawer>

      <SectionCard className="mt-6" title="Cómo se aplica" description="Las promociones publicadas alimentan la sección de la home y la página /promociones.">
        <p className="text-sm leading-relaxed text-graphite-600">
          En este entorno demo los cambios se guardan localmente. En producción, publicar una promoción
          actualiza los datos que consumen la home (promoShowcase) y el listado público, con revisión de
          quién publicó y cuándo en la auditoría.
        </p>
      </SectionCard>
    </div>
  );
}
