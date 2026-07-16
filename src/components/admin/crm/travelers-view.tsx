"use client";

import { useState } from "react";
import { IdentificationCardIcon, PaperPlaneTiltIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { crmDocuments, crmTravelers, type CrmTraveler, type TravelerAlert } from "@/data/admin-crm";
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

/** Travelers registry with document alerts (expired passports, minors, etc.). */

const alertDefs: { id: TravelerAlert; label: string; tone: "danger" | "warning" }[] = [
  { id: "pasaporte vencido", label: "Pasaportes vencidos", tone: "danger" },
  { id: "pasaporte por vencer", label: "Pasaportes por vencer", tone: "warning" },
  { id: "documento incompleto", label: "Documentación incompleta", tone: "warning" },
  { id: "menor sin autorización", label: "Menores sin autorización", tone: "danger" },
];

function passportBadge(t: CrmTraveler) {
  if (!t.passport) return <span className="text-xs text-graphite-400">Sin pasaporte</span>;
  const alert = t.alerts.find((a) => a.startsWith("pasaporte"));
  return (
    <div>
      <p className="tabular text-graphite-800">{t.passport}</p>
      <p className="text-xs text-graphite-500 tabular">
        vence {t.passportExpiry ? formatDate(t.passportExpiry) : "s/d"}
        {alert && <StatusBadge status={alert === "pasaporte vencido" ? "vencido" : "por vencer"} className="ml-1.5" />}
      </p>
    </div>
  );
}

export function TravelersView() {
  const [selected, setSelected] = useState<CrmTraveler | null>(null);
  const { showToast, toastNode } = useToast();

  const columns: Column<CrmTraveler>[] = [
    {
      id: "name",
      header: "Pasajero",
      essential: true,
      cell: (t) => (
        <div>
          <p className="font-semibold text-graphite-800">{t.name}</p>
          <p className="text-xs text-graphite-500">{t.customer !== t.name ? `Cliente: ${t.customer}` : "Titular"}</p>
        </div>
      ),
      sortValue: (t) => t.name,
    },
    { id: "birth", header: "Nacimiento", cell: (t) => <span className="tabular">{formatDate(t.birthDate)}</span>, sortValue: (t) => t.birthDate },
    { id: "dni", header: "DNI", cell: (t) => <span className="tabular">{t.dni}</span> },
    { id: "passport", header: "Pasaporte", essential: true, cell: passportBadge, sortValue: (t) => t.passportExpiry ?? "9999" },
    {
      id: "bookings",
      header: "Reservas",
      cell: (t) => <span className="text-xs tabular text-graphite-600">{t.relatedBookings.join(", ") || "—"}</span>,
    },
    {
      id: "alerts",
      header: "Alertas",
      essential: true,
      cell: (t) =>
        t.alerts.length === 0 ? (
          <span className="text-xs text-graphite-400">Sin alertas</span>
        ) : (
          <span className="flex flex-wrap gap-1">
            {t.alerts.map((a) => (
              <StatusBadge key={a} status={a.includes("vencido") || a.includes("autorización") ? "vencido" : "pendiente"} className="capitalize" />
            ))}
          </span>
        ),
      sortValue: (t) => t.alerts.length,
    },
  ];

  const filters: FilterDef<CrmTraveler>[] = [
    {
      id: "alert",
      label: "Alerta",
      options: ["con alertas", "sin alertas", ...alertDefs.map((a) => a.id)],
      matches: (t, v) =>
        v === "con alertas" ? t.alerts.length > 0 : v === "sin alertas" ? t.alerts.length === 0 : t.alerts.includes(v as TravelerAlert),
    },
    {
      id: "nat",
      label: "Nacionalidad",
      options: [...new Set(crmTravelers.map((t) => t.nationality))],
      matches: (t, v) => t.nationality === v,
    },
  ];

  const docs = selected ? crmDocuments.filter((d) => d.person === selected.name) : [];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Pasajeros"
        description="Datos de viaje y documentación de todas las personas que viajan, separadas del cliente comprador."
        breadcrumb={[{ label: "Pasajeros" }]}
      />

      {/* Alert strip */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {alertDefs.map((a) => {
          const count = crmTravelers.filter((t) => t.alerts.includes(a.id)).length;
          return (
            <div
              key={a.id}
              className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 ${
                count === 0 ? "border-graphite-200/70" : a.tone === "danger" ? "border-danger-100" : "border-warning-100"
              }`}
            >
              <WarningCircleIcon
                className={`size-5 shrink-0 ${count === 0 ? "text-graphite-300" : a.tone === "danger" ? "text-danger-700" : "text-warning-700"}`}
                aria-hidden
              />
              <div>
                <p className={`font-display text-lg font-bold tabular ${count === 0 ? "text-graphite-400" : "text-petrol-900"}`}>{count}</p>
                <p className="text-xs leading-tight text-graphite-500">{a.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <DataTable
        rows={crmTravelers}
        columns={columns}
        rowKey={(t) => t.id}
        searchKeys={(t) => `${t.name} ${t.dni} ${t.passport ?? ""} ${t.customer} ${t.relatedBookings.join(" ")}`}
        searchPlaceholder="Buscar por nombre, DNI o reserva…"
        filters={filters}
        exportName="pasajeros"
        onRowClick={setSelected}
        emptyTitle="Sin pasajeros con esos criterios"
        emptyDetail="Los pasajeros se crean automáticamente al cargar una reserva."
      />

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? ""}>
        {selected && (
          <div className="space-y-5">
            {selected.alerts.length > 0 && (
              <div className="rounded-xl border border-warning-100 bg-warning-100/40 px-4 py-3">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-warning-700">
                  <WarningCircleIcon className="size-4.5" aria-hidden /> Requiere atención
                </p>
                <ul className="mt-1 list-inside list-disc text-xs capitalize text-graphite-700">
                  {selected.alerts.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            <KVGrid
              items={[
                { label: "Nacimiento", value: formatDate(selected.birthDate) },
                { label: "Nacionalidad", value: selected.nationality },
                { label: "DNI", value: <span className="tabular">{selected.dni}</span> },
                { label: "Pasaporte", value: selected.passport ? <span className="tabular">{selected.passport}</span> : "No cargado" },
                { label: "Vencimiento", value: selected.passportExpiry ? formatDate(selected.passportExpiry) : "—" },
                { label: "País emisor", value: selected.passportCountry ?? "—" },
                { label: "Necesidades especiales", value: selected.specialNeeds ?? "Sin datos" },
                { label: "Cliente comprador", value: selected.customer },
              ]}
            />
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-graphite-500">Reservas relacionadas</p>
              {selected.relatedBookings.length === 0 ? (
                <p className="text-sm text-graphite-500">Sin reservas activas.</p>
              ) : (
                <ul className="space-y-1.5">
                  {selected.relatedBookings.map((b) => (
                    <li key={b}>
                      <a href="/admin/reservas" className="text-sm font-semibold text-teal-600 hover:underline tabular">
                        {b}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-graphite-500">Documentos</p>
              {docs.length === 0 ? (
                <p className="text-sm text-graphite-500">Sin documentos cargados.</p>
              ) : (
                <ul className="divide-y divide-graphite-100 rounded-xl border border-graphite-200/70">
                  {docs.map((d) => (
                    <li key={d.id} className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm">
                      <span className="min-w-0 truncate font-medium text-graphite-800">{d.name}</span>
                      <StatusBadge status={d.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <AdminButton onClick={() => showToast(`Solicitud de documentación enviada a ${selected.customer}`)}>
                <PaperPlaneTiltIcon className="size-4" aria-hidden /> Solicitar documentación
              </AdminButton>
              <AdminButton variant="secondary" onClick={() => showToast("Edición disponible al conectar el backend")}>
                <IdentificationCardIcon className="size-4" aria-hidden /> Editar datos
              </AdminButton>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
