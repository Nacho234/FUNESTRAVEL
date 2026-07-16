"use client";

import { useState } from "react";
import { CheckCircleIcon, ClockIcon, LifebuoyIcon, TimerIcon } from "@phosphor-icons/react";
import { tickets as seedTickets, type Ticket, type TicketStatus } from "@/data/admin-crm";
import { formatDate } from "@/lib/format";
import {
  AdminButton,
  DataTable,
  Drawer,
  KVGrid,
  PageHeader,
  StatusBadge,
  useToast,
  type Column,
  type FilterDef,
} from "@/components/admin/ui";

/** Support tickets with visible SLA and resolution flow. */

function slaInfo(t: Ticket): { label: string; overdue: boolean } {
  if (t.status === "resuelta") return { label: "Cumplido", overdue: false };
  const days = Math.ceil((new Date(t.slaDate).getTime() - Date.now()) / 86400000);
  if (days < 0) return { label: `Vencido hace ${Math.abs(days)} d`, overdue: true };
  if (days === 0) return { label: "Vence hoy", overdue: true };
  return { label: `Vence en ${days} d`, overdue: false };
}

const statusOptions: TicketStatus[] = ["abierta", "en curso", "esperando cliente", "resuelta"];

export function TicketsView() {
  const [items, setItems] = useState<Ticket[]>(seedTickets);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [update, setUpdate] = useState("");
  const [resolution, setResolution] = useState("");
  const { showToast, toastNode } = useToast();

  const selected = items.find((t) => t.id === selectedId) ?? null;
  const open = items.filter((t) => t.status !== "resuelta");
  const overdue = open.filter((t) => slaInfo(t).overdue);
  const resolved = items.filter((t) => t.status === "resuelta");

  const tiles = [
    { label: "Abiertos", value: String(open.length), icon: LifebuoyIcon, tone: "text-petrol-900" },
    { label: "SLA vencido", value: String(overdue.length), icon: TimerIcon, tone: overdue.length ? "text-danger-700" : "text-graphite-400" },
    { label: "Resueltos este mes", value: String(resolved.length), icon: CheckCircleIcon, tone: "text-positive-700" },
    { label: "Resolución promedio", value: "2,4 días", icon: ClockIcon, tone: "text-petrol-900" },
  ];

  const columns: Column<Ticket>[] = [
    {
      id: "title",
      header: "Ticket",
      essential: true,
      cell: (t) => (
        <div>
          <p className="font-semibold text-graphite-800">{t.title}</p>
          <p className="text-xs text-graphite-500">
            {t.id} · {t.customer}
            {t.booking ? ` · ${t.booking}` : ""}
          </p>
        </div>
      ),
      sortValue: (t) => t.title,
    },
    { id: "cat", header: "Categoría", cell: (t) => <span className="capitalize text-graphite-600">{t.category}</span>, sortValue: (t) => t.category },
    {
      id: "prio",
      header: "Prioridad",
      cell: (t) => <StatusBadge status={t.priority === "alta" ? "vencida" : t.priority === "media" ? "pendiente" : "borrador"} className="capitalize" />,
      sortValue: (t) => ({ alta: 0, media: 1, baja: 2 })[t.priority],
    },
    {
      id: "sla",
      header: "SLA",
      essential: true,
      cell: (t) => {
        const s = slaInfo(t);
        return <span className={`text-xs font-semibold tabular ${s.overdue ? "text-danger-700" : "text-graphite-600"}`}>{s.label}</span>;
      },
      sortValue: (t) => t.slaDate,
    },
    { id: "assignee", header: "Responsable", cell: (t) => t.assignee, sortValue: (t) => t.assignee },
    { id: "status", header: "Estado", essential: true, cell: (t) => <StatusBadge status={t.status} />, sortValue: (t) => t.status },
  ];

  const filters: FilterDef<Ticket>[] = [
    { id: "cat", label: "Categoría", options: [...new Set(items.map((t) => t.category))], matches: (t, v) => t.category === v },
    { id: "prio", label: "Prioridad", options: ["alta", "media", "baja"], matches: (t, v) => t.priority === v },
    { id: "status", label: "Estado", options: statusOptions, matches: (t, v) => t.status === v },
    { id: "assignee", label: "Responsable", options: [...new Set(items.map((t) => t.assignee))], matches: (t, v) => t.assignee === v },
  ];

  const patchSelected = (patch: Partial<Ticket>) => {
    if (!selected) return;
    setItems((its) => its.map((t) => (t.id === selected.id ? { ...t, ...patch } : t)));
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Tickets"
        description="Cambios, cancelaciones, reclamos y asistencia durante el viaje, con SLA visible."
        breadcrumb={[{ label: "Tickets" }]}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="flex items-center gap-3 rounded-xl border border-graphite-200/70 bg-white px-4 py-3">
            <tile.icon className={`size-5 shrink-0 ${tile.tone}`} aria-hidden />
            <div>
              <p className="font-display text-lg font-bold text-petrol-900 tabular">{tile.value}</p>
              <p className="text-xs text-graphite-500">{tile.label}</p>
            </div>
          </div>
        ))}
      </div>

      <DataTable
        rows={items}
        columns={columns}
        rowKey={(t) => t.id}
        searchKeys={(t) => `${t.id} ${t.title} ${t.customer} ${t.booking ?? ""} ${t.assignee}`}
        searchPlaceholder="Buscar por ticket, cliente o reserva…"
        filters={filters}
        exportName="tickets"
        onRowClick={(t) => {
          setSelectedId(t.id);
          setUpdate("");
          setResolution(t.resolution ?? "");
        }}
        emptyTitle="Sin tickets con esos criterios"
        emptyDetail="Los tickets se crean desde una consulta o desde “Nueva acción”."
      />

      <Drawer open={Boolean(selected)} onClose={() => setSelectedId(null)} title={selected ? `${selected.id} · ${selected.title}` : ""} wide>
        {selected && (
          <div className="space-y-5">
            <KVGrid
              cols={3}
              items={[
                { label: "Cliente", value: selected.customer },
                { label: "Reserva", value: selected.booking ?? "—" },
                { label: "Categoría", value: <span className="capitalize">{selected.category}</span> },
                { label: "Responsable", value: selected.assignee },
                { label: "Creado", value: formatDate(selected.createdAt) },
                {
                  label: "SLA",
                  value: (
                    <span className={slaInfo(selected).overdue ? "text-danger-700" : ""}>
                      {formatDate(selected.slaDate)} ({slaInfo(selected).label.toLowerCase()})
                    </span>
                  ),
                },
              ]}
            />

            <div>
              <label htmlFor="tk-status" className="mb-1 block text-sm font-semibold text-graphite-800">
                Estado
              </label>
              <select
                id="tk-status"
                value={selected.status}
                onChange={(e) => {
                  patchSelected({ status: e.target.value as TicketStatus });
                  showToast(`Estado: ${e.target.value}`);
                }}
                className="rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none"
              >
                {statusOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-graphite-500">Historial</p>
              <ol className="space-y-2.5">
                {selected.messages.map((m, i) => (
                  <li key={i} className="rounded-lg bg-sand-50 px-3.5 py-2.5">
                    <p className="text-sm leading-relaxed text-graphite-700">{m.text}</p>
                    <p className="mt-1 text-[0.6875rem] text-graphite-400">
                      {m.author} · {m.time}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <label htmlFor="tk-update" className="mb-1 block text-sm font-semibold text-graphite-800">
                Agregar actualización
              </label>
              <textarea
                id="tk-update"
                rows={3}
                value={update}
                onChange={(e) => setUpdate(e.target.value)}
                className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
              <AdminButton
                className="mt-2"
                variant="secondary"
                onClick={() => {
                  const text = update.trim();
                  if (!text) return;
                  patchSelected({ messages: [...selected.messages, { author: "Equipo Funes Travel", text, time: "ahora" }] });
                  setUpdate("");
                  showToast("Actualización agregada");
                }}
              >
                Guardar actualización
              </AdminButton>
            </div>

            {selected.status !== "resuelta" ? (
              <div className="rounded-xl border border-positive-100 bg-positive-100/30 p-4">
                <label htmlFor="tk-res" className="mb-1 block text-sm font-semibold text-graphite-800">
                  Resolver ticket
                </label>
                <textarea
                  id="tk-res"
                  rows={3}
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Cómo se resolvió el caso (queda en el historial del cliente)."
                  className="w-full rounded-[var(--radius-control)] border border-graphite-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
                <AdminButton
                  className="mt-2"
                  onClick={() => {
                    if (resolution.trim().length < 10) {
                      showToast("Contá brevemente la solución antes de resolver");
                      return;
                    }
                    patchSelected({ status: "resuelta", resolution: resolution.trim() });
                    showToast("Ticket resuelto");
                  }}
                >
                  <CheckCircleIcon className="size-4" aria-hidden /> Marcar resuelto
                </AdminButton>
              </div>
            ) : (
              <div className="rounded-xl border border-positive-100 bg-positive-100/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-positive-700">Solución</p>
                <p className="mt-1 text-sm leading-relaxed text-graphite-700">{selected.resolution}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
