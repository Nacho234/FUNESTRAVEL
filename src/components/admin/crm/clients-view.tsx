"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { NotePencilIcon, PlusIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { adminBookings, adminQuotes } from "@/data/admin";
import { crmCustomers, type CrmCustomer, type CustomerSegment } from "@/data/admin-crm";
import { crmDocuments } from "@/data/admin-crm";
import { getPackage } from "@/data/packages";
import { formatDate } from "@/lib/format";
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
} from "@/components/admin/ui";

/** Customers CRM: 360° profile drawer with tabs, segments and quick actions. */

const segmentTone: Record<CustomerSegment, string> = {
  nuevo: "bg-teal-50 text-teal-600",
  frecuente: "bg-petrol-50 text-petrol-800",
  VIP: "bg-warning-100 text-warning-700",
  familia: "bg-sand-100 text-graphite-600",
  pareja: "bg-sand-100 text-graphite-600",
  grupal: "bg-sand-100 text-graphite-600",
  inactivo: "bg-graphite-100 text-graphite-600",
  "con deuda": "bg-danger-100 text-danger-700",
};

function SegmentBadges({ segments }: { segments: CustomerSegment[] }) {
  return (
    <span className="flex flex-wrap gap-1">
      {segments.map((s) => (
        <span key={s} className={`rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold capitalize ${segmentTone[s]}`}>
          {s}
        </span>
      ))}
    </span>
  );
}

const tabs = ["Resumen", "Preferencias", "Historial", "Documentos", "Notas"] as const;
type Tab = (typeof tabs)[number];

function CustomerProfile({ customer, onNote }: { customer: CrmCustomer; onNote: (text: string) => void }) {
  const [tab, setTab] = useState<Tab>("Resumen");
  const [note, setNote] = useState("");
  const bookings = adminBookings.filter((b) => b.holderName === customer.name);
  const quotes = adminQuotes.filter((q) => q.customer === customer.name);
  const documents = crmDocuments.filter((d) => d.person.includes(customer.name.split(" ")[0]) && d.person.includes(customer.name.split(" ").at(-1) ?? ""));
  const p = customer.detailedPreferences;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <Image src={`https://i.pravatar.cc/64?img=${customer.avatarId}`} alt="" width={52} height={52} className="rounded-full" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold text-petrol-900">{customer.name}</p>
          <div className="mt-1">
            <SegmentBadges segments={customer.segments} />
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/admin/cotizaciones?nueva=1"
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-coral-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-coral-600 transition-colors"
        >
          <PlusIcon weight="bold" className="size-4" aria-hidden /> Nueva cotización
        </Link>
        <a
          href={`https://wa.me/549${customer.phone.replaceAll(" ", "")}?text=${encodeURIComponent(`Hola ${customer.name.split(" ")[0]}! Te escribimos de Funes Travel.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-graphite-200 px-3.5 py-2 text-sm font-semibold text-positive-700 hover:border-positive-700 transition-colors"
        >
          <WhatsappLogoIcon className="size-4" aria-hidden /> WhatsApp
        </a>
        <AdminButton variant="secondary" onClick={() => onNote("__edit__")}>
          <NotePencilIcon className="size-4" aria-hidden /> Editar
        </AdminButton>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex gap-1 border-b border-graphite-100" role="tablist" aria-label="Secciones del cliente">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`border-b-2 px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
              tab === t ? "border-teal-500 text-petrol-900" : "border-transparent text-graphite-500 hover:text-graphite-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="pt-5">
        {tab === "Resumen" && (
          <KVGrid
            items={[
              { label: "Correo", value: customer.email },
              { label: "Teléfono", value: customer.phone },
              { label: "Ciudad", value: customer.city },
              { label: "CUIT/CUIL", value: customer.taxId ?? "No informado" },
              { label: "Viajes realizados", value: <span className="tabular">{customer.trips}</span> },
              { label: "Valor total", value: <span className="tabular">USD {customer.totalValueUsd.toLocaleString("es-AR")}</span> },
              { label: "Última reserva", value: formatDate(customer.lastBooking) },
              { label: "Última actividad", value: customer.lastActivity },
              { label: "Acompañantes", value: customer.companions.join(" · ") },
            ]}
          />
        )}

        {tab === "Preferencias" && (
          <KVGrid
            cols={2}
            items={[
              { label: "Destinos", value: p.destinos },
              { label: "Tipos de viaje", value: p.tiposDeViaje },
              { label: "Aerolíneas", value: p.aerolineas },
              { label: "Presupuesto", value: p.presupuesto },
              { label: "Restricciones alimentarias", value: p.restricciones },
              { label: "Accesibilidad", value: p.accesibilidad },
              { label: "Contacto preferido", value: p.contactoPreferido },
              { label: "Idioma", value: p.idioma },
            ]}
          />
        )}

        {tab === "Historial" && (
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-graphite-500">Reservas</p>
              {bookings.length === 0 ? (
                <p className="text-sm text-graphite-500">Sin reservas registradas a su nombre.</p>
              ) : (
                <ul className="divide-y divide-graphite-100 rounded-xl border border-graphite-200/70">
                  {bookings.map((b) => (
                    <li key={b.code} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                      <div>
                        <p className="font-semibold text-graphite-800">
                          {getPackage(b.packageSlug)?.name ?? b.packageSlug} <span className="text-graphite-400">· {b.code}</span>
                        </p>
                        <p className="text-xs text-graphite-500">
                          Sale {formatDate(b.departureDate)} · {b.adults + b.children} pax · USD {b.totalUsd.toLocaleString("es-AR")}
                        </p>
                      </div>
                      <StatusBadge status={b.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-graphite-500">Cotizaciones</p>
              {quotes.length === 0 ? (
                <p className="text-sm text-graphite-500">Sin cotizaciones abiertas.</p>
              ) : (
                <ul className="divide-y divide-graphite-100 rounded-xl border border-graphite-200/70">
                  {quotes.map((q) => (
                    <li key={q.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                      <div>
                        <p className="font-semibold text-graphite-800">
                          {q.destination} <span className="text-graphite-400">· {q.id}</span>
                        </p>
                        <p className="text-xs text-graphite-500">
                          {q.travelers} · {q.approxDate} · vence {formatDate(q.validUntil)} · {q.advisor}
                        </p>
                      </div>
                      <StatusBadge status={q.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {tab === "Documentos" && (
          <div>
            {documents.length === 0 ? (
              <EmptyState title="Sin documentos" detail="Este cliente todavía no tiene documentación cargada." />
            ) : (
              <ul className="divide-y divide-graphite-100 rounded-xl border border-graphite-200/70">
                {documents.map((d) => (
                  <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-graphite-800">{d.name}</p>
                      <p className="text-xs capitalize text-graphite-500">
                        {d.type}
                        {d.expiry ? ` · vence ${formatDate(d.expiry)}` : ""}
                      </p>
                    </div>
                    <StatusBadge status={d.status} />
                  </li>
                ))}
              </ul>
            )}
            <Link href="/admin/documentacion" className="mt-3 inline-block text-sm font-semibold text-teal-600 hover:underline">
              Ver módulo de documentación
            </Link>
          </div>
        )}

        {tab === "Notas" && (
          <div className="space-y-4">
            <ul className="space-y-2">
              {customer.notes.map((n, i) => (
                <li key={i} className="rounded-lg bg-sand-50 px-3.5 py-2.5 text-sm text-graphite-700">
                  {n}
                </li>
              ))}
            </ul>
            <div>
              <label htmlFor="new-note" className="mb-1 block text-sm font-semibold text-graphite-800">
                Agregar nota interna
              </label>
              <textarea
                id="new-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                placeholder="Visible solo para el equipo."
              />
              <AdminButton
                className="mt-2"
                onClick={() => {
                  if (note.trim()) {
                    onNote(note.trim());
                    setNote("");
                  }
                }}
              >
                Guardar nota
              </AdminButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ClientsView({ startCreating = false }: { startCreating?: boolean }) {
  const [customers, setCustomers] = useState<CrmCustomer[]>(crmCustomers);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(startCreating);
  const [draft, setDraft] = useState({ name: "", email: "", phone: "", city: "Funes", segment: "nuevo" as CustomerSegment });
  const { showToast, toastNode } = useToast();

  const selected = customers.find((c) => c.id === selectedId) ?? null;

  const columns: Column<CrmCustomer>[] = [
    {
      id: "name",
      header: "Cliente",
      essential: true,
      cell: (c) => (
        <div className="flex items-center gap-2.5">
          <Image src={`https://i.pravatar.cc/64?img=${c.avatarId}`} alt="" width={30} height={30} className="rounded-full" />
          <div>
            <p className="font-semibold text-graphite-800">{c.name}</p>
            <p className="text-xs text-graphite-500">{c.email}</p>
          </div>
        </div>
      ),
      sortValue: (c) => c.name,
    },
    { id: "phone", header: "Teléfono", cell: (c) => <span className="tabular">{c.phone}</span> },
    { id: "city", header: "Ciudad", cell: (c) => c.city, sortValue: (c) => c.city },
    { id: "segments", header: "Segmentos", cell: (c) => <SegmentBadges segments={c.segments} /> },
    { id: "trips", header: "Viajes", align: "right", cell: (c) => <span className="tabular">{c.trips}</span>, sortValue: (c) => c.trips },
    {
      id: "value",
      header: "Valor total",
      align: "right",
      essential: true,
      cell: (c) => <span className="font-semibold tabular">USD {c.totalValueUsd.toLocaleString("es-AR")}</span>,
      sortValue: (c) => c.totalValueUsd,
    },
    { id: "activity", header: "Última actividad", cell: (c) => <span className="text-xs text-graphite-500">{c.lastActivity}</span> },
  ];

  const filters: FilterDef<CrmCustomer>[] = [
    {
      id: "segment",
      label: "Segmento",
      options: ["nuevo", "frecuente", "VIP", "familia", "pareja", "grupal", "inactivo", "con deuda"],
      matches: (c, v) => c.segments.includes(v as CustomerSegment),
    },
    { id: "city", label: "Ciudad", options: ["Funes", "Rosario", "Roldán", "Pérez"], matches: (c, v) => c.city === v },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Clientes"
        description="El CRM de la agencia: perfiles, segmentos, preferencias e historial."
        breadcrumb={[{ label: "Clientes" }]}
        actions={
          <AdminButton onClick={() => setCreating(true)}>
            <PlusIcon weight="bold" className="size-4" aria-hidden /> Nuevo cliente
          </AdminButton>
        }
      />

      <DataTable
        rows={customers}
        columns={columns}
        rowKey={(c) => c.id}
        searchKeys={(c) => `${c.name} ${c.email} ${c.phone} ${c.city} ${c.segments.join(" ")}`}
        searchPlaceholder="Buscar por nombre, correo o teléfono…"
        filters={filters}
        exportName="clientes"
        onRowClick={(c) => setSelectedId(c.id)}
        emptyTitle="Sin clientes con esos criterios"
        emptyDetail="Probá otra búsqueda o creá el cliente desde “Nuevo cliente”."
      />

      {/* 360° profile */}
      <Drawer open={Boolean(selected)} onClose={() => setSelectedId(null)} title="Perfil del cliente" wide>
        {selected && (
          <CustomerProfile
            customer={selected}
            onNote={(text) => {
              if (text === "__edit__") {
                showToast("Edición de datos disponible al conectar el backend");
                return;
              }
              setCustomers((cs) => cs.map((c) => (c.id === selected.id ? { ...c, notes: [text, ...c.notes] } : c)));
              showToast("Nota guardada");
            }}
          />
        )}
      </Drawer>

      {/* Create */}
      <Drawer open={creating} onClose={() => setCreating(false)} title="Nuevo cliente">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.name.trim().length < 3 || !draft.email.includes("@")) {
              showToast("Completá nombre y un correo válido");
              return;
            }
            const nuevo: CrmCustomer = {
              id: `C-${1000 + customers.length + 1}`,
              avatarId: 5,
              name: draft.name.trim(),
              email: draft.email.trim(),
              phone: draft.phone.trim() || "Sin teléfono",
              city: draft.city as CrmCustomer["city"],
              trips: 0,
              totalValueUsd: 0,
              lastBooking: new Date().toISOString().slice(0, 10),
              preferences: "",
              segments: [draft.segment],
              detailedPreferences: {
                destinos: "A relevar",
                tiposDeViaje: "A relevar",
                aerolineas: "A relevar",
                presupuesto: "A relevar",
                restricciones: "Sin datos",
                accesibilidad: "Sin datos",
                contactoPreferido: "WhatsApp",
                idioma: "Español",
              },
              companions: [],
              lastActivity: "Cliente creado manualmente",
              notes: [],
            };
            setCustomers((cs) => [nuevo, ...cs]);
            setCreating(false);
            setDraft({ name: "", email: "", phone: "", city: "Funes", segment: "nuevo" });
            showToast("Cliente creado");
          }}
        >
          {(
            [
              { id: "name", label: "Nombre y apellido", type: "text" },
              { id: "email", label: "Correo electrónico", type: "email" },
              { id: "phone", label: "Teléfono", type: "tel" },
            ] as const
          ).map((f) => (
            <div key={f.id}>
              <label htmlFor={`nc-${f.id}`} className="mb-1 block text-sm font-semibold text-graphite-800">
                {f.label}
              </label>
              <input
                id={`nc-${f.id}`}
                type={f.type}
                value={draft[f.id]}
                onChange={(e) => setDraft((d) => ({ ...d, [f.id]: e.target.value }))}
                className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="nc-city" className="mb-1 block text-sm font-semibold text-graphite-800">
                Ciudad
              </label>
              <select
                id="nc-city"
                value={draft.city}
                onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
                className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none"
              >
                {["Funes", "Rosario", "Roldán", "Pérez"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="nc-seg" className="mb-1 block text-sm font-semibold text-graphite-800">
                Segmento
              </label>
              <select
                id="nc-seg"
                value={draft.segment}
                onChange={(e) => setDraft((d) => ({ ...d, segment: e.target.value as CustomerSegment }))}
                className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none"
              >
                {["nuevo", "frecuente", "VIP", "familia", "pareja", "grupal"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <AdminButton type="submit" className="w-full">
            Crear cliente
          </AdminButton>
        </form>
      </Drawer>
    </div>
  );
}
