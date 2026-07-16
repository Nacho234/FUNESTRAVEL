"use client";

import { useState } from "react";
import { StarIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { adminProviders, type AdminProvider } from "@/data/admin-catalog";
import { formatDate } from "@/lib/format";
import { AdminButton, DataTable, Drawer, KVGrid, PageHeader, StatusBadge, useToast, type Column, type FilterDef } from "../ui";

/** Providers manager: contracts, balances, performance and incidents. */

const TODAY = "2026-07-16";

function contractDaysLeft(until: string): number {
  return Math.ceil((new Date(until).getTime() - new Date(TODAY).getTime()) / 86400000);
}

function Performance({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Desempeño ${value} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} weight={i < value ? "fill" : "regular"} className={`size-3.5 ${i < value ? "text-warning-700" : "text-graphite-300"}`} aria-hidden />
      ))}
    </span>
  );
}

export function ProvidersManager() {
  const [selected, setSelected] = useState<AdminProvider | null>(null);
  const { showToast, toastNode } = useToast();

  const expiring = adminProviders.filter((p) => contractDaysLeft(p.contractUntil) < 90);
  const withDebt = adminProviders.filter((p) => p.balanceUsd < 0);
  const unconfirmed = adminProviders.filter((p) => p.incidents.some((i) => !i.resolved));

  const columns: Column<AdminProvider>[] = [
    {
      id: "name",
      header: "Proveedor",
      essential: true,
      cell: (p) => (
        <div>
          <p className="font-semibold text-graphite-800">{p.name}</p>
          <p className="text-xs text-graphite-500">{p.kind}</p>
        </div>
      ),
      sortValue: (p) => p.name,
    },
    {
      id: "contact",
      header: "Contacto",
      cell: (p) => (
        <div className="text-xs text-graphite-600">
          <p>{p.contactName}</p>
          <p>{p.phone}</p>
        </div>
      ),
    },
    {
      id: "contract",
      header: "Contrato",
      cell: (p) => {
        const days = contractDaysLeft(p.contractUntil);
        return (
          <div>
            <span className="tabular text-graphite-700">{formatDate(p.contractUntil)}</span>
            {days < 90 && <StatusBadge status="por vencer" className="ml-2" />}
          </div>
        );
      },
      sortValue: (p) => p.contractUntil,
    },
    {
      id: "balance",
      header: "Saldo",
      align: "right",
      cell: (p) => (
        <span className={`tabular font-semibold ${p.balanceUsd < 0 ? "text-danger-700" : "text-graphite-700"}`}>
          {p.currency} {Math.abs(p.balanceUsd).toLocaleString("es-AR")}
          {p.balanceUsd < 0 ? " (a pagar)" : ""}
        </span>
      ),
      sortValue: (p) => p.balanceUsd,
    },
    { id: "performance", header: "Desempeño", cell: (p) => <Performance value={p.performance} />, sortValue: (p) => p.performance },
    {
      id: "incidents",
      header: "Incidencias",
      align: "right",
      cell: (p) =>
        p.openIncidents > 0 ? (
          <span className="inline-flex items-center gap-1 font-semibold text-coral-700 tabular">
            <WarningCircleIcon className="size-4" aria-hidden /> {p.openIncidents}
          </span>
        ) : (
          <span className="text-graphite-400">—</span>
        ),
      sortValue: (p) => p.openIncidents,
    },
  ];

  const filters: FilterDef<AdminProvider>[] = [
    { id: "kind", label: "Tipo", options: [...new Set(adminProviders.map((p) => p.kind))], matches: (p, v) => p.kind === v },
    {
      id: "alert",
      label: "Alerta",
      options: ["Contrato por vencer", "Con deuda", "Con incidencias"],
      matches: (p, v) =>
        v === "Contrato por vencer"
          ? contractDaysLeft(p.contractUntil) < 90
          : v === "Con deuda"
            ? p.balanceUsd < 0
            : p.openIncidents > 0,
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Proveedores"
        description="Operadores, receptivos, aéreas y asistencias: contratos, saldos y desempeño."
        breadcrumb={[{ label: "Proveedores" }]}
      />

      {/* Alertas */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Contratos por vencer (90 días)", value: expiring.length, names: expiring.map((p) => p.name) },
          { label: "Saldos a pagar", value: withDebt.length, names: withDebt.map((p) => p.name) },
          { label: "Incidencias sin resolver", value: unconfirmed.length, names: unconfirmed.map((p) => p.name) },
        ].map((a) => (
          <div key={a.label} className="rounded-xl border border-graphite-200/70 bg-white px-4 py-3">
            <p className="text-xs text-graphite-500">{a.label}</p>
            <p className={`mt-0.5 font-display text-xl font-bold tabular ${a.value > 0 ? "text-coral-700" : "text-graphite-800"}`}>{a.value}</p>
            {a.value > 0 && <p className="mt-0.5 truncate text-xs text-graphite-500">{a.names.join(" · ")}</p>}
          </div>
        ))}
      </div>

      <DataTable
        rows={adminProviders}
        columns={columns}
        rowKey={(p) => p.id}
        searchKeys={(p) => `${p.name} ${p.kind} ${p.contactName} ${p.services.join(" ")}`}
        searchPlaceholder="Buscar proveedores…"
        filters={filters}
        exportName="proveedores"
        onRowClick={setSelected}
      />

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? ""} wide>
        {selected && (
          <div className="space-y-5">
            <KVGrid
              items={[
                { label: "Tipo", value: selected.kind },
                { label: "Contacto", value: `${selected.contactName} · ${selected.phone}` },
                { label: "Correo", value: selected.contactEmail },
                { label: "Condiciones de pago", value: selected.paymentTerms },
                { label: "Contrato hasta", value: formatDate(selected.contractUntil) },
                {
                  label: "Saldo",
                  value: (
                    <span className={`tabular ${selected.balanceUsd < 0 ? "text-danger-700" : ""}`}>
                      {selected.currency} {Math.abs(selected.balanceUsd).toLocaleString("es-AR")}
                      {selected.balanceUsd < 0 ? " a pagar" : ""}
                    </span>
                  ),
                },
                { label: "Desempeño", value: <Performance value={selected.performance} /> },
                { label: "Incidencias abiertas", value: <span className="tabular">{selected.openIncidents}</span> },
              ]}
            />

            <div>
              <p className="mb-1.5 text-xs font-semibold text-graphite-600">Servicios y productos</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.services.map((s) => (
                  <span key={s} className="rounded-full bg-petrol-50 px-2.5 py-0.5 text-xs font-semibold text-petrol-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-graphite-600">Documentos</p>
              <ul className="space-y-1.5">
                {selected.documents.map((d) => (
                  <li key={d.name} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-graphite-700">{d.name}</span>
                    <StatusBadge status={d.status === "vigente" ? "activo" : d.status} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-graphite-600">Historial de incidencias</p>
              {selected.incidents.length === 0 ? (
                <p className="text-sm text-graphite-500">Sin incidencias registradas.</p>
              ) : (
                <ul className="space-y-2">
                  {selected.incidents.map((i) => (
                    <li key={i.date} className="rounded-lg border border-graphite-100 px-3 py-2 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-graphite-500 tabular">{formatDate(i.date)}</span>
                        <StatusBadge status={i.resolved ? "resuelta" : "abierta"} />
                      </div>
                      <p className="mt-1 text-graphite-700">{i.detail}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-lg bg-sand-50 px-3.5 py-2.5 text-sm text-graphite-600">
              <span className="font-semibold text-graphite-800">Notas: </span>
              {selected.notes}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-graphite-100 pt-4">
              <AdminButton onClick={() => showToast("Pago a proveedor registrado (demo)")}>Registrar pago</AdminButton>
              <AdminButton variant="secondary" onClick={() => showToast("Incidencia creada (demo)")}>
                Nueva incidencia
              </AdminButton>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
