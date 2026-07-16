"use client";

import { useState } from "react";
import { adminTransfers, type AdminTransfer } from "@/data/admin-catalog";
import { AdminButton, DataTable, Drawer, PageHeader, StatusBadge, useToast, type Column, type FilterDef } from "../ui";

/** Transfers manager with a simple editor drawer. */

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

export function TransfersManager() {
  const [rows, setRows] = useState<AdminTransfer[]>(adminTransfers);
  const [editing, setEditing] = useState<AdminTransfer | null>(null);
  const { showToast, toastNode } = useToast();

  const save = () => {
    if (!editing) return;
    setRows((rs) => rs.map((r) => (r.id === editing.id ? editing : r)));
    showToast("Traslado actualizado (demo)");
    setEditing(null);
  };

  const columns: Column<AdminTransfer>[] = [
    {
      id: "route",
      header: "Traslado",
      essential: true,
      cell: (t) => (
        <div>
          <p className="font-semibold text-graphite-800">
            {t.origin} → {t.destination}
          </p>
          <p className="text-xs text-graphite-500">{t.vehicle}</p>
        </div>
      ),
      sortValue: (t) => t.origin,
    },
    { id: "kind", header: "Tipo", cell: (t) => t.kind, sortValue: (t) => t.kind },
    { id: "capacity", header: "Capacidad", align: "right", cell: (t) => <span className="tabular">{t.capacity} pax</span>, sortValue: (t) => t.capacity },
    { id: "provider", header: "Proveedor", cell: (t) => <span className="text-xs text-graphite-600">{t.provider}</span>, sortValue: (t) => t.provider },
    { id: "availability", header: "Disponibilidad", cell: (t) => <span className="text-xs text-graphite-600">{t.availability}</span> },
    { id: "price", header: "Precio", align: "right", cell: (t) => <span className="tabular font-semibold">USD {t.priceUsd.toLocaleString("es-AR")}</span>, sortValue: (t) => t.priceUsd },
    { id: "status", header: "Estado", essential: true, cell: (t) => <StatusBadge status={t.status} />, sortValue: (t) => t.status },
  ];

  const filters: FilterDef<AdminTransfer>[] = [
    { id: "kind", label: "Tipo", options: ["Privado", "Compartido"], matches: (t, v) => t.kind === v },
    { id: "status", label: "Estado", options: ["publicado", "borrador", "pausado"], matches: (t, v) => t.status === v },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Traslados"
        description="Transfers de aeropuerto, hotel y cerro por proveedor, con capacidad y tarifas."
        breadcrumb={[{ label: "Traslados" }]}
      />
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(t) => t.id}
        searchKeys={(t) => `${t.origin} ${t.destination} ${t.vehicle} ${t.provider}`}
        searchPlaceholder="Buscar traslados…"
        filters={filters}
        exportName="traslados"
        onRowClick={(t) => setEditing({ ...t })}
      />
      <Drawer open={Boolean(editing)} onClose={() => setEditing(null)} title={editing ? `${editing.origin} → ${editing.destination}` : ""}>
        {editing && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Origen">
                <input value={editing.origin} onChange={(e) => setEditing({ ...editing, origin: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Destino">
                <input value={editing.destination} onChange={(e) => setEditing({ ...editing, destination: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Tipo">
                <select value={editing.kind} onChange={(e) => setEditing({ ...editing, kind: e.target.value as AdminTransfer["kind"] })} className={`${inputClass} cursor-pointer`}>
                  <option>Privado</option>
                  <option>Compartido</option>
                </select>
              </Field>
              <Field label="Capacidad">
                <input type="number" min={1} value={editing.capacity} onChange={(e) => setEditing({ ...editing, capacity: Number(e.target.value) })} className={`${inputClass} tabular`} />
              </Field>
              <Field label="Vehículo">
                <input value={editing.vehicle} onChange={(e) => setEditing({ ...editing, vehicle: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Precio (USD)">
                <input type="number" value={editing.priceUsd} onChange={(e) => setEditing({ ...editing, priceUsd: Number(e.target.value) })} className={`${inputClass} tabular`} />
              </Field>
            </div>
            <Field label="Disponibilidad / horarios">
              <input value={editing.availability} onChange={(e) => setEditing({ ...editing, availability: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Estado">
              <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as AdminTransfer["status"] })} className={`${inputClass} cursor-pointer`}>
                {["publicado", "borrador", "pausado"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <div className="flex gap-2 border-t border-graphite-100 pt-4">
              <AdminButton onClick={save}>Guardar cambios (demo)</AdminButton>
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
