"use client";

import { useEffect, useMemo, useState } from "react";
import { CaretRightIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { adminBookings, type AdminBooking } from "@/data/admin";
import { adminPayments } from "@/data/admin-sales";
import { getPackage } from "@/data/packages";
import { formatDate, formatMoney } from "@/lib/format";
import {
  AdminButton,
  DataTable,
  Drawer,
  EmptyState,
  KVGrid,
  PageHeader,
  StatusBadge,
  useToast,
  type Column,
  type FilterDef,
} from "../ui";

/** Bookings module: list + kanban views, wide detail drawer with an
 * interactive operational checklist. Web demo bookings merge in with a badge. */

const OP_STATUSES = [
  "pendiente de pago",
  "en confirmación",
  "confirmada",
  "documentación pendiente",
  "lista para viajar",
] as const;
type OpStatus = (typeof OP_STATUSES)[number] | "cancelada";

interface BookingRow extends AdminBooking {
  source: "sistema" | "web";
  opStatus: OpStatus;
}

const initialOpStatus: Record<string, OpStatus> = {
  "FT-2026-1042": "documentación pendiente",
  "FT-2026-1041": "pendiente de pago",
  "FT-2026-1040": "lista para viajar",
  "FT-2026-1039": "confirmada",
  "FT-2026-1038": "en confirmación",
  "FT-2026-1037": "lista para viajar",
  "FT-2026-1036": "pendiente de pago",
  "FT-2026-1035": "confirmada",
  "FT-2026-1034": "en confirmación",
  "FT-2026-1033": "cancelada",
  "FT-2026-1032": "documentación pendiente",
  "FT-2026-1031": "pendiente de pago",
};

function deriveOpStatus(b: AdminBooking): OpStatus {
  if (initialOpStatus[b.code]) return initialOpStatus[b.code];
  if (b.status === "cancelada") return "cancelada";
  if (b.status === "pendiente-de-pago") return "pendiente de pago";
  if (b.status === "en-revision") return "en confirmación";
  return "confirmada";
}

const CHECKLIST = [
  "Pago inicial",
  "Documentación",
  "Confirmación aérea",
  "Confirmación hotel",
  "Traslado",
  "Seguro",
  "Vouchers",
  "Itinerario final",
  "Contacto de emergencia",
  "Saldo",
  "Mensaje previo al viaje",
  "Seguimiento posterior",
];

const checklistSeed: Record<OpStatus, number> = {
  "pendiente de pago": 1,
  "en confirmación": 2,
  confirmada: 5,
  "documentación pendiente": 6,
  "lista para viajar": 10,
  cancelada: 0,
};

const advisors = ["Sofía Gachet", "Marcela Buttini", "Diego Anselmi"];
const usd = (n: number) => formatMoney({ amount: n, currency: "USD" });

export function BookingsManager({ openNew = false }: { openNew?: boolean }) {
  const [rows, setRows] = useState<BookingRow[]>(() =>
    adminBookings.map((b) => ({ ...b, source: "sistema", opStatus: deriveOpStatus(b) })),
  );
  const [view, setView] = useState<"lista" | "kanban">("lista");
  const [selected, setSelected] = useState<BookingRow | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean[]>>({});
  const [assigning, setAssigning] = useState<BookingRow[] | null>(null);
  const [assignTo, setAssignTo] = useState(advisors[0]);
  const [reschedule, setReschedule] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [note, setNote] = useState("");
  const [newOpen, setNewOpen] = useState(openNew);
  const [newForm, setNewForm] = useState({ holder: "", packageSlug: "punta-cana-7-noches-all-inclusive", adults: 2 });
  const { showToast, toastNode } = useToast();

  // Merge demo bookings created from the public site
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("ft-bookings");
      if (!raw) return;
      const web = JSON.parse(raw) as {
        code: string;
        packageSlug: string;
        holderName: string;
        holderEmail: string;
        adults: number;
        children: number;
        totalUsd: number;
        status: string;
        createdAt: string;
      }[];
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time merge of client-only storage
      setRows((prev) => [
        ...web
          .filter((w) => !prev.some((p) => p.code === w.code))
          .map((w) => ({
            code: w.code,
            packageSlug: w.packageSlug,
            holderName: w.holderName,
            holderEmail: w.holderEmail,
            adults: w.adults,
            children: w.children,
            totalUsd: w.totalUsd,
            status: (w.status === "confirmada" ? "confirmada" : "pendiente-de-pago") as AdminBooking["status"],
            payMethod: "Web",
            advisor: "Sin asignar",
            createdAt: w.createdAt.slice(0, 10),
            departureDate: getPackage(w.packageSlug)?.departures[0]?.date ?? "2026-09-01",
            source: "web" as const,
            opStatus: (w.status === "confirmada" ? "confirmada" : "pendiente de pago") as OpStatus,
          })),
        ...prev,
      ]);
    } catch {
      // ignore malformed storage
    }
  }, []);

  const getChecklist = (code: string, op: OpStatus) =>
    checklist[code] ?? CHECKLIST.map((_, i) => i < checklistSeed[op]);

  const toggleCheck = (code: string, op: OpStatus, index: number) => {
    setChecklist((c) => {
      const current = c[code] ?? CHECKLIST.map((_, i) => i < checklistSeed[op]);
      const next = [...current];
      next[index] = !next[index];
      return { ...c, [code]: next };
    });
  };

  const moveTo = (code: string, status: OpStatus) => {
    setRows((rs) => rs.map((r) => (r.code === code ? { ...r, opStatus: status } : r)));
    setSelected((s) => (s && s.code === code ? { ...s, opStatus: status } : s));
    showToast(`Reserva movida a “${status}”`);
  };

  const columns: Column<BookingRow>[] = [
    {
      id: "code",
      header: "Código",
      essential: true,
      cell: (r) => (
        <span className="font-semibold text-petrol-900 tabular">
          {r.code}
          {r.source === "web" && (
            <span className="ml-1.5 rounded-full bg-teal-50 px-1.5 py-0.5 text-[0.625rem] font-bold text-teal-600">Web</span>
          )}
        </span>
      ),
      sortValue: (r) => r.code,
    },
    { id: "holder", header: "Titular", essential: true, cell: (r) => r.holderName, sortValue: (r) => r.holderName },
    {
      id: "pkg",
      header: "Paquete",
      cell: (r) => <span className="text-graphite-700">{getPackage(r.packageSlug)?.name ?? r.packageSlug}</span>,
      sortValue: (r) => getPackage(r.packageSlug)?.name ?? r.packageSlug,
    },
    { id: "dep", header: "Salida", cell: (r) => <span className="tabular">{formatDate(r.departureDate)}</span>, sortValue: (r) => r.departureDate },
    { id: "pax", header: "Pax", align: "right", cell: (r) => <span className="tabular">{r.adults + r.children}</span>, sortValue: (r) => r.adults + r.children },
    { id: "total", header: "Total", essential: true, align: "right", cell: (r) => <span className="font-semibold tabular">{usd(r.totalUsd)}</span>, sortValue: (r) => r.totalUsd },
    { id: "op", header: "Estado", essential: true, cell: (r) => <StatusBadge status={r.opStatus} />, sortValue: (r) => r.opStatus },
    { id: "pay", header: "Pago", cell: (r) => r.payMethod, sortValue: (r) => r.payMethod },
    { id: "advisor", header: "Asesor", cell: (r) => r.advisor, sortValue: (r) => r.advisor },
  ];

  const filters: FilterDef<BookingRow>[] = [
    { id: "op", label: "Estado", options: [...OP_STATUSES, "cancelada"], matches: (r, v) => r.opStatus === v },
    { id: "advisor", label: "Asesor", options: [...advisors, "Sin asignar"], matches: (r, v) => r.advisor === v },
  ];

  const kanban = useMemo(
    () =>
      OP_STATUSES.map((status) => {
        const items = rows.filter((r) => r.opStatus === status);
        return { status, items, totalUsd: items.reduce((s, r) => s + r.totalUsd, 0) };
      }),
    [rows],
  );

  const detailPkg = selected ? getPackage(selected.packageSlug) : undefined;
  const detailPayments = selected ? adminPayments.filter((p) => p.bookingCode === selected.code) : [];
  const checks = selected ? getChecklist(selected.code, selected.opStatus) : [];
  const doneCount = checks.filter(Boolean).length;

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Reservas"
        description="La operación completa: estados, pagos, documentación y checklist de cada viaje."
        breadcrumb={[{ label: "Reservas" }]}
        actions={
          <>
            <div className="flex rounded-[var(--radius-control)] border border-graphite-200 bg-white p-0.5" role="group" aria-label="Vista">
              {(["lista", "kanban"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize cursor-pointer transition-colors ${
                    view === v ? "bg-petrol-900 text-ivory" : "text-graphite-600 hover:text-petrol-900"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <AdminButton onClick={() => setNewOpen(true)}>Nueva reserva</AdminButton>
          </>
        }
      />

      {view === "lista" ? (
        <DataTable
          rows={rows}
          columns={columns}
          rowKey={(r) => r.code}
          searchKeys={(r) => `${r.code} ${r.holderName} ${r.holderEmail} ${getPackage(r.packageSlug)?.name ?? ""} ${r.advisor}`}
          searchPlaceholder="Buscar por código, titular o paquete…"
          filters={filters}
          exportName="reservas"
          onRowClick={(r) => {
            setSelected(r);
            setConfirmCancel(false);
            setReschedule("");
          }}
          bulkActions={[
            {
              label: "Confirmar",
              onApply: (sel) => {
                setRows((rs) => rs.map((r) => (sel.some((s) => s.code === r.code) ? { ...r, opStatus: "confirmada" } : r)));
                showToast(`${sel.length} reservas confirmadas`);
              },
            },
            { label: "Asignar asesor…", onApply: (sel) => setAssigning(sel) },
          ]}
          emptyTitle="No hay reservas con esos criterios"
          emptyDetail="Ajustá los filtros o creá una reserva con “Nueva reserva”."
        />
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-[1080px] grid-cols-5 gap-3">
            {kanban.map((col) => (
              <div key={col.status} className="rounded-xl border border-graphite-200/70 bg-sand-50/50">
                <div className="border-b border-graphite-100 px-3 py-2.5">
                  <p className="text-xs font-bold uppercase tracking-wide text-graphite-600">{col.status}</p>
                  <p className="mt-0.5 text-[0.6875rem] text-graphite-500 tabular">
                    {col.items.length} {col.items.length === 1 ? "reserva" : "reservas"} · {usd(col.totalUsd)}
                  </p>
                </div>
                <div className="space-y-2 p-2">
                  {col.items.length === 0 && <p className="px-2 py-4 text-center text-xs text-graphite-400">Sin reservas</p>}
                  {col.items.map((r) => (
                    <div key={r.code} className="rounded-lg border border-graphite-200/70 bg-white p-3">
                      <button onClick={() => setSelected(r)} className="block w-full text-left cursor-pointer">
                        <p className="text-xs font-bold text-petrol-900 tabular">
                          {r.code} {r.source === "web" && <span className="ml-1 rounded-full bg-teal-50 px-1.5 text-[0.625rem] font-bold text-teal-600">Web</span>}
                        </p>
                        <p className="mt-0.5 truncate text-sm font-medium text-graphite-800">{r.holderName}</p>
                        <p className="truncate text-xs text-graphite-500">{getPackage(r.packageSlug)?.name ?? r.packageSlug}</p>
                        <p className="mt-1 text-xs font-semibold text-graphite-700 tabular">{usd(r.totalUsd)}</p>
                      </button>
                      <label className="mt-2 flex items-center gap-1 text-[0.6875rem] text-graphite-500">
                        <CaretRightIcon className="size-3" aria-hidden />
                        <span className="sr-only">Mover {r.code} a</span>
                        <select
                          value={r.opStatus}
                          onChange={(e) => moveTo(r.code, e.target.value as OpStatus)}
                          className="w-full rounded border border-graphite-200 bg-white px-1.5 py-1 text-[0.6875rem] cursor-pointer focus:border-teal-500 focus:outline-none"
                        >
                          {OP_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk assign drawer */}
      <Drawer open={Boolean(assigning)} onClose={() => setAssigning(null)} title="Asignar asesor">
        {assigning && (
          <div className="space-y-4">
            <p className="text-sm text-graphite-600">
              Vas a asignar {assigning.length} {assigning.length === 1 ? "reserva" : "reservas"} a un asesor.
            </p>
            <select
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none"
              aria-label="Asesor"
            >
              {advisors.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <AdminButton
              onClick={() => {
                setRows((rs) => rs.map((r) => (assigning.some((s) => s.code === r.code) ? { ...r, advisor: assignTo } : r)));
                showToast(`Asignadas a ${assignTo}`);
                setAssigning(null);
              }}
            >
              Asignar
            </AdminButton>
          </div>
        )}
      </Drawer>

      {/* New booking drawer */}
      <Drawer open={newOpen} onClose={() => setNewOpen(false)} title="Nueva reserva">
        <div className="space-y-4">
          <div>
            <label htmlFor="nb-holder" className="mb-1 block text-sm font-semibold text-graphite-800">
              Titular
            </label>
            <input
              id="nb-holder"
              value={newForm.holder}
              onChange={(e) => setNewForm((f) => ({ ...f, holder: e.target.value }))}
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              placeholder="Nombre y apellido"
            />
          </div>
          <div>
            <label htmlFor="nb-pkg" className="mb-1 block text-sm font-semibold text-graphite-800">
              Paquete
            </label>
            <select
              id="nb-pkg"
              value={newForm.packageSlug}
              onChange={(e) => setNewForm((f) => ({ ...f, packageSlug: e.target.value }))}
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none"
            >
              {adminBookings
                .map((b) => b.packageSlug)
                .filter((v, i, a) => a.indexOf(v) === i)
                .map((slug) => (
                  <option key={slug} value={slug}>
                    {getPackage(slug)?.name ?? slug}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="nb-adults" className="mb-1 block text-sm font-semibold text-graphite-800">
              Adultos
            </label>
            <input
              id="nb-adults"
              type="number"
              min={1}
              max={40}
              value={newForm.adults}
              onChange={(e) => setNewForm((f) => ({ ...f, adults: Number(e.target.value) }))}
              className="w-28 rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm tabular focus:border-teal-500 focus:outline-none"
            />
          </div>
          <AdminButton
            onClick={() => {
              if (newForm.holder.trim().length < 3) {
                showToast("Ingresá el nombre del titular");
                return;
              }
              const pkg = getPackage(newForm.packageSlug);
              const price = pkg?.priceFrom.amount ?? 1000;
              const code = `FT-2026-${1044 + rows.filter((r) => r.source === "sistema").length}`;
              setRows((rs) => [
                {
                  code,
                  packageSlug: newForm.packageSlug,
                  holderName: newForm.holder.trim(),
                  holderEmail: "",
                  adults: newForm.adults,
                  children: 0,
                  totalUsd: price * newForm.adults,
                  status: "pendiente-de-pago",
                  payMethod: "A definir",
                  advisor: "Sin asignar",
                  createdAt: new Date().toISOString().slice(0, 10),
                  departureDate: pkg?.departures[0]?.date ?? "2026-10-01",
                  source: "sistema",
                  opStatus: "pendiente de pago",
                },
                ...rs,
              ]);
              setNewOpen(false);
              setNewForm({ holder: "", packageSlug: newForm.packageSlug, adults: 2 });
              showToast(`Reserva ${code} creada como borrador`);
            }}
          >
            Crear reserva
          </AdminButton>
          <p className="text-xs text-graphite-500">
            La reserva se crea en “pendiente de pago”. Después podés sumar pasajeros, servicios y pagos desde el detalle.
          </p>
        </div>
      </Drawer>

      {/* Detail drawer */}
      <Drawer wide open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `Reserva ${selected.code}` : ""}>
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={selected.opStatus} />
              {selected.source === "web" && <StatusBadge status="nueva" />}
              <span className="text-xs text-graphite-500">Creada el {formatDate(selected.createdAt)}</span>
            </div>

            <KVGrid
              cols={3}
              items={[
                { label: "Titular", value: selected.holderName },
                { label: "Contacto", value: selected.holderEmail || "Sin correo registrado" },
                { label: "Asesor", value: selected.advisor },
                { label: "Paquete", value: detailPkg?.name ?? selected.packageSlug },
                { label: "Salida", value: formatDate(selected.departureDate) },
                { label: "Pasajeros", value: `${selected.adults} adultos${selected.children ? ` + ${selected.children} menores` : ""}` },
                { label: "Total", value: <span className="tabular">{usd(selected.totalUsd)}</span> },
                { label: "Forma de pago", value: selected.payMethod },
                { label: "Estado de pago", value: <StatusBadge status={selected.status === "pendiente-de-pago" ? "pendiente" : selected.status === "confirmada" ? "pagado" : selected.status} /> },
              ]}
            />

            {/* Checklist */}
            <section className="rounded-xl border border-graphite-200/70 bg-sand-50/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold text-petrol-900">Checklist operativo</h3>
                <span className="text-xs font-semibold text-graphite-600 tabular">
                  {doneCount}/{CHECKLIST.length}
                </span>
              </div>
              <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-graphite-100">
                <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${(doneCount / CHECKLIST.length) * 100}%` }} />
              </div>
              <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {CHECKLIST.map((item, i) => (
                  <li key={item}>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-graphite-700">
                      <input
                        type="checkbox"
                        checked={checks[i]}
                        onChange={() => toggleCheck(selected.code, selected.opStatus, i)}
                        className="size-4 accent-teal-600 cursor-pointer"
                      />
                      <span className={checks[i] ? "text-graphite-400 line-through" : ""}>{item}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            {/* Passengers */}
            <section>
              <h3 className="mb-2 text-sm font-bold text-petrol-900">Pasajeros</h3>
              <ul className="divide-y divide-graphite-100 rounded-xl border border-graphite-200/70">
                {Array.from({ length: selected.adults + selected.children }, (_, i) => {
                  const isChild = i >= selected.adults;
                  const docOk = i % 3 !== 1;
                  return (
                    <li key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="font-medium text-graphite-800">
                        {i === 0 ? selected.holderName : `${isChild ? "Menor" : "Acompañante"} ${i}`}
                        {isChild && <span className="ml-1.5 text-xs text-graphite-500">(menor)</span>}
                      </span>
                      <StatusBadge status={docOk ? "aprobado" : "pendiente"} />
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Services */}
            {detailPkg && (
              <section>
                <h3 className="mb-2 text-sm font-bold text-petrol-900">Servicios incluidos</h3>
                <ul className="space-y-1 text-sm text-graphite-600">
                  {detailPkg.includes.slice(0, 6).map((s) => (
                    <li key={s}>· {s}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Payments */}
            <section>
              <h3 className="mb-2 text-sm font-bold text-petrol-900">Pagos</h3>
              {detailPayments.length === 0 ? (
                <EmptyState title="Sin pagos registrados" detail="Registrá el primer pago desde las acciones de esta reserva." />
              ) : (
                <ul className="divide-y divide-graphite-100 rounded-xl border border-graphite-200/70">
                  {detailPayments.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                      <div>
                        <p className="font-medium text-graphite-800">{p.concept}</p>
                        <p className="text-xs text-graphite-500">
                          {p.method} · {formatDate(p.date)} · ref. {p.reference}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold tabular">{formatMoney({ amount: p.amount, currency: p.currency })}</span>
                        <StatusBadge status={p.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* History + notes */}
            <section>
              <h3 className="mb-2 text-sm font-bold text-petrol-900">Historial</h3>
              <ol className="space-y-1.5 text-xs text-graphite-500">
                <li>· {formatDate(selected.createdAt)}: reserva creada ({selected.source === "web" ? "desde la web" : "en oficina"}).</li>
                <li>· Estado actual: {selected.opStatus}.</li>
                {selected.notes && <li>· Nota: {selected.notes}</li>}
              </ol>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Agregar nota interna…"
                className="mt-2 w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                aria-label="Nota interna"
              />
              <AdminButton
                variant="ghost"
                size="sm"
                className="mt-1"
                onClick={() => {
                  if (note.trim()) {
                    showToast("Nota agregada al historial");
                    setNote("");
                  }
                }}
              >
                Guardar nota
              </AdminButton>
            </section>

            {/* Actions */}
            <section className="space-y-3 border-t border-graphite-100 pt-4">
              <div className="flex flex-wrap gap-2">
                {selected.opStatus !== "confirmada" && selected.opStatus !== "lista para viajar" && (
                  <AdminButton onClick={() => moveTo(selected.code, "confirmada")}>Confirmar</AdminButton>
                )}
                <AdminButton variant="secondary" onClick={() => showToast("Pago registrado (demo)")}>
                  Registrar pago
                </AdminButton>
                <AdminButton variant="secondary" onClick={() => showToast("Voucher generado (demo)")}>
                  Generar voucher
                </AdminButton>
                <a
                  href={`https://wa.me/5493415550123?text=${encodeURIComponent(`Hola, te escribimos de Funes Travel por tu reserva ${selected.code}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-graphite-200 px-3.5 py-2 text-sm font-semibold text-positive-700 hover:border-positive-700"
                >
                  <WhatsappLogoIcon className="size-4" aria-hidden /> WhatsApp
                </a>
              </div>
              <div className="flex flex-wrap items-end gap-2">
                <div>
                  <label htmlFor="resched" className="mb-1 block text-xs font-semibold text-graphite-600">
                    Reprogramar salida
                  </label>
                  <input
                    id="resched"
                    type="date"
                    value={reschedule}
                    onChange={(e) => setReschedule(e.target.value)}
                    className="rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm tabular focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <AdminButton
                  variant="secondary"
                  size="sm"
                  disabled={!reschedule}
                  onClick={() => {
                    setRows((rs) => rs.map((r) => (r.code === selected.code ? { ...r, departureDate: reschedule } : r)));
                    setSelected((s) => (s ? { ...s, departureDate: reschedule } : s));
                    showToast(`Salida reprogramada al ${formatDate(reschedule)}`);
                    setReschedule("");
                  }}
                >
                  Aplicar
                </AdminButton>
              </div>
              {selected.opStatus !== "cancelada" &&
                (confirmCancel ? (
                  <div className="rounded-xl border border-danger-100 bg-danger-100/40 p-3">
                    <p className="text-sm font-semibold text-danger-700">¿Cancelar la reserva {selected.code}?</p>
                    <p className="mt-0.5 text-xs text-graphite-600">Aplica la política de cancelación del paquete. Esta acción queda en la auditoría.</p>
                    <div className="mt-2 flex gap-2">
                      <AdminButton variant="danger" size="sm" onClick={() => { moveTo(selected.code, "cancelada"); setConfirmCancel(false); }}>
                        Sí, cancelar
                      </AdminButton>
                      <AdminButton variant="ghost" size="sm" onClick={() => setConfirmCancel(false)}>
                        Volver
                      </AdminButton>
                    </div>
                  </div>
                ) : (
                  <AdminButton variant="danger" size="sm" onClick={() => setConfirmCancel(true)}>
                    Cancelar reserva
                  </AdminButton>
                ))}
            </section>
          </div>
        )}
      </Drawer>
    </div>
  );
}
