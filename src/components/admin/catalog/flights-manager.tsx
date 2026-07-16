"use client";

import Link from "next/link";
import { useState } from "react";
import { PlusIcon } from "@phosphor-icons/react";
import { adminFlightsManual, type AdminFlight } from "@/data/admin-catalog";
import { AdminButton, DataTable, Drawer, PageHeader, StatusBadge, useToast, type Column, type FilterDef } from "../ui";
import { usePerms } from "./use-perms";

/** Manual flight inventory with cost gating and future GDS note. */

const inputClass =
  "w-full rounded-[var(--radius-control)] border border-graphite-200 bg-white px-3 py-2 text-sm text-graphite-800 focus:border-teal-500 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-graphite-600">{label}</span>
      {children}
    </label>
  );
}

const emptyFlight: AdminFlight = {
  id: "",
  airline: "Aerolíneas Argentinas",
  flightNumber: "",
  route: "",
  depTime: "",
  arrTime: "",
  fareClass: "Economy",
  baggage: "Carry-on + 1 valija 23 kg",
  costUsd: 0,
  priceUsd: 0,
  provider: "Aerolíneas Argentinas (agencia IATA)",
  status: "borrador",
};

export function FlightsManager() {
  const [rows, setRows] = useState<AdminFlight[]>(adminFlightsManual);
  const [editing, setEditing] = useState<AdminFlight | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { showToast, toastNode } = useToast();
  const { has } = usePerms();
  const canCosts = has("ver-costos");

  const save = () => {
    if (!editing) return;
    if (isNew) {
      setRows((rs) => [{ ...editing, id: `fl-manual-${rs.length + 1}` }, ...rs]);
      showToast("Vuelo cargado (demo)");
    } else {
      setRows((rs) => rs.map((r) => (r.id === editing.id ? editing : r)));
      showToast("Vuelo actualizado (demo)");
    }
    setEditing(null);
  };

  const columns: Column<AdminFlight>[] = [
    {
      id: "airline",
      header: "Vuelo",
      essential: true,
      cell: (f) => (
        <div>
          <p className="font-semibold text-graphite-800">{f.airline}</p>
          <p className="text-xs text-graphite-500 tabular">{f.flightNumber} · {f.route}</p>
        </div>
      ),
      sortValue: (f) => f.airline,
    },
    { id: "times", header: "Horarios", cell: (f) => <span className="tabular">{f.depTime} → {f.arrTime}</span>, sortValue: (f) => f.depTime },
    { id: "class", header: "Clase", cell: (f) => f.fareClass, sortValue: (f) => f.fareClass },
    { id: "baggage", header: "Equipaje", cell: (f) => <span className="text-xs text-graphite-600">{f.baggage}</span> },
    ...(canCosts
      ? [
          {
            id: "cost",
            header: "Costo",
            align: "right" as const,
            cell: (f: AdminFlight) => <span className="tabular text-graphite-600">USD {f.costUsd.toLocaleString("es-AR")}</span>,
            sortValue: (f: AdminFlight) => f.costUsd,
          },
        ]
      : []),
    { id: "price", header: "Precio", align: "right", cell: (f) => <span className="tabular font-semibold">USD {f.priceUsd.toLocaleString("es-AR")}</span>, sortValue: (f) => f.priceUsd },
    ...(canCosts
      ? [
          {
            id: "margin",
            header: "Margen",
            align: "right" as const,
            cell: (f: AdminFlight) => <span className="tabular">{Math.round(((f.priceUsd - f.costUsd) / f.priceUsd) * 100)}%</span>,
            sortValue: (f: AdminFlight) => f.priceUsd - f.costUsd,
          },
        ]
      : []),
    { id: "provider", header: "Proveedor", cell: (f) => <span className="text-xs text-graphite-600">{f.provider}</span> },
    { id: "status", header: "Estado", essential: true, cell: (f) => <StatusBadge status={f.status} />, sortValue: (f) => f.status },
  ];

  const filters: FilterDef<AdminFlight>[] = [
    { id: "airline", label: "Aerolínea", options: [...new Set(rows.map((r) => r.airline))], matches: (f, v) => f.airline === v },
    { id: "status", label: "Estado", options: ["publicado", "borrador", "pausado"], matches: (f, v) => f.status === v },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Vuelos"
        description="Inventario manual de tramos. Las tarifas en vivo llegarán con la integración GDS."
        breadcrumb={[{ label: "Vuelos" }]}
        actions={
          <AdminButton
            onClick={() => {
              setEditing({ ...emptyFlight });
              setIsNew(true);
            }}
          >
            <PlusIcon weight="bold" className="size-4" aria-hidden /> Cargar vuelo
          </AdminButton>
        }
      />

      <div className="mb-4 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3 text-sm text-graphite-700">
        Los vuelos cargados acá se usan en cotizaciones y paquetes. Para tarifas en tiempo real, conectá un GDS desde{" "}
        <Link href="/admin/integraciones" className="font-semibold text-teal-600 hover:underline">
          Integraciones
        </Link>
        .
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(f) => f.id}
        searchKeys={(f) => `${f.airline} ${f.flightNumber} ${f.route} ${f.provider}`}
        searchPlaceholder="Buscar vuelos…"
        filters={filters}
        exportName="vuelos"
        onRowClick={(f) => {
          setEditing({ ...f });
          setIsNew(false);
        }}
      />

      <Drawer open={Boolean(editing)} onClose={() => setEditing(null)} title={isNew ? "Cargar vuelo manual" : `Editar ${editing?.flightNumber}`}>
        {editing && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Aerolínea">
                <input value={editing.airline} onChange={(e) => setEditing({ ...editing, airline: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Número de vuelo">
                <input value={editing.flightNumber} onChange={(e) => setEditing({ ...editing, flightNumber: e.target.value })} className={inputClass} placeholder="AR 1234" />
              </Field>
              <Field label="Ruta">
                <input value={editing.route} onChange={(e) => setEditing({ ...editing, route: e.target.value })} className={inputClass} placeholder="EZE → GIG" />
              </Field>
              <Field label="Clase">
                <select value={editing.fareClass} onChange={(e) => setEditing({ ...editing, fareClass: e.target.value })} className={`${inputClass} cursor-pointer`}>
                  {["Economy", "Economy Flex", "Premium Economy", "Business"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Salida">
                <input value={editing.depTime} onChange={(e) => setEditing({ ...editing, depTime: e.target.value })} className={inputClass} placeholder="08:45" />
              </Field>
              <Field label="Llegada">
                <input value={editing.arrTime} onChange={(e) => setEditing({ ...editing, arrTime: e.target.value })} className={inputClass} placeholder="11:40" />
              </Field>
              {canCosts && (
                <Field label="Costo (USD)">
                  <input type="number" value={editing.costUsd} onChange={(e) => setEditing({ ...editing, costUsd: Number(e.target.value) })} className={`${inputClass} tabular`} />
                </Field>
              )}
              <Field label="Precio (USD)">
                <input type="number" value={editing.priceUsd} onChange={(e) => setEditing({ ...editing, priceUsd: Number(e.target.value) })} className={`${inputClass} tabular`} />
              </Field>
            </div>
            <Field label="Equipaje">
              <input value={editing.baggage} onChange={(e) => setEditing({ ...editing, baggage: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Proveedor">
              <input value={editing.provider} onChange={(e) => setEditing({ ...editing, provider: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Estado">
              <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as AdminFlight["status"] })} className={`${inputClass} cursor-pointer`}>
                {["publicado", "borrador", "pausado"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <div className="flex gap-2 border-t border-graphite-100 pt-4">
              <AdminButton onClick={save}>{isNew ? "Cargar vuelo" : "Guardar cambios"}</AdminButton>
              <AdminButton variant="ghost" onClick={() => setEditing(null)}>
                Cancelar
              </AdminButton>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
