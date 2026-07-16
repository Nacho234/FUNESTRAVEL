"use client";

import { useState } from "react";
import { adminInsurances, type AdminInsurance } from "@/data/admin-catalog";
import { AdminButton, DataTable, Drawer, KVGrid, PageHeader, StatusBadge, useToast, type Column, type FilterDef } from "../ui";

/** Insurance plans manager with readable coverage details. */

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

export function InsurancesManager() {
  const [rows, setRows] = useState<AdminInsurance[]>(adminInsurances);
  const [editing, setEditing] = useState<AdminInsurance | null>(null);
  const { showToast, toastNode } = useToast();

  const save = () => {
    if (!editing) return;
    setRows((rs) => rs.map((r) => (r.id === editing.id ? editing : r)));
    showToast("Plan actualizado (demo)");
    setEditing(null);
  };

  const columns: Column<AdminInsurance>[] = [
    {
      id: "plan",
      header: "Plan",
      essential: true,
      cell: (s) => (
        <div>
          <p className="font-semibold text-graphite-800">{s.plan}</p>
          <p className="text-xs text-graphite-500">{s.company}</p>
        </div>
      ),
      sortValue: (s) => s.plan,
    },
    { id: "coverage", header: "Cobertura", align: "right", cell: (s) => <span className="tabular font-semibold">USD {s.coverageUsd.toLocaleString("es-AR")}</span>, sortValue: (s) => s.coverageUsd },
    { id: "age", header: "Edad", cell: (s) => <span className="text-xs">{s.ageRange}</span> },
    { id: "days", header: "Días máx.", align: "right", cell: (s) => <span className="tabular">{s.maxDays}</span>, sortValue: (s) => s.maxDays },
    { id: "price", header: "USD/día", align: "right", cell: (s) => <span className="tabular">{s.pricePerDayUsd.toLocaleString("es-AR", { minimumFractionDigits: 1 })}</span>, sortValue: (s) => s.pricePerDayUsd },
    { id: "status", header: "Estado", essential: true, cell: (s) => <StatusBadge status={s.status} />, sortValue: (s) => s.status },
  ];

  const filters: FilterDef<AdminInsurance>[] = [
    { id: "status", label: "Estado", options: ["publicado", "borrador", "pausado"], matches: (s, v) => s.status === v },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Seguros"
        description="Planes de asistencia al viajero: coberturas, exclusiones y tarifas por día."
        breadcrumb={[{ label: "Seguros" }]}
      />
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(s) => s.id}
        searchKeys={(s) => `${s.plan} ${s.company}`}
        searchPlaceholder="Buscar planes…"
        filters={filters}
        exportName="seguros"
        onRowClick={(s) => setEditing({ ...s })}
      />
      <Drawer open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.plan ?? ""}>
        {editing && (
          <div className="space-y-4">
            <KVGrid
              items={[
                { label: "Compañía", value: editing.company },
                { label: "Cobertura", value: <span className="tabular">USD {editing.coverageUsd.toLocaleString("es-AR")}</span> },
                { label: "Rango de edad", value: editing.ageRange },
                { label: "Días máximos", value: <span className="tabular">{editing.maxDays}</span> },
              ]}
            />
            <div>
              <p className="mb-1 text-xs font-semibold text-graphite-600">Exclusiones</p>
              <ul className="space-y-1 text-sm text-graphite-600">
                {editing.exclusions.map((x) => (
                  <li key={x}>· {x}</li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Precio por día (USD)">
                <input
                  type="number"
                  step="0.1"
                  value={editing.pricePerDayUsd}
                  onChange={(e) => setEditing({ ...editing, pricePerDayUsd: Number(e.target.value) })}
                  className={`${inputClass} tabular`}
                />
              </Field>
              <Field label="Estado">
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as AdminInsurance["status"] })} className={`${inputClass} cursor-pointer`}>
                  {["publicado", "borrador", "pausado"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
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
