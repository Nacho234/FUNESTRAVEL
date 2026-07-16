"use client";

import { useState } from "react";
import { CalendarPlusIcon, DownloadSimpleIcon } from "@phosphor-icons/react";
import { reportDatasets, savedReports } from "@/data/admin-system";
import { AdminButton, Drawer, PageHeader, SectionCard, useToast } from "@/components/admin/ui";

/** Report builder over demo datasets with saved views and scheduling. */

const reportOptions = [
  { id: "ventas-vendedor", label: "Ventas por vendedor" },
  { id: "ventas-destino", label: "Ventas por destino" },
  { id: "ventas-canal", label: "Ventas por canal" },
  { id: "cotizaciones-conversion", label: "Cotizaciones y conversión" },
  { id: "cancelaciones", label: "Cancelaciones" },
  { id: "promociones", label: "Promociones" },
  { id: "pagos-metodo", label: "Pagos por método" },
  { id: "estacionalidad", label: "Estacionalidad" },
];

export function ReportsAdmin() {
  const [dataset, setDataset] = useState("ventas-vendedor");
  const [from, setFrom] = useState("2026-07-01");
  const [to, setTo] = useState("2026-07-16");
  const [grouping, setGrouping] = useState("mensual");
  const [scheduling, setScheduling] = useState(false);
  const { showToast, toastNode } = useToast();

  const report = reportDatasets[dataset];
  const reportLabel = reportOptions.find((r) => r.id === dataset)?.label ?? dataset;

  const exportCsv = () => {
    const header = report.columns.join(";");
    const lines = report.rows.map((r) => [r.label, r.col1, r.col2, r.col3].join(";"));
    const blob = new Blob([`${header}\n${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `reporte-${dataset}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("Reporte exportado");
  };

  return (
    <div className="mx-auto max-w-[1100px]">
      {toastNode}
      <PageHeader
        title="Reportes"
        description="Armá el reporte, compará períodos y exportalo o programá su envío."
        breadcrumb={[{ label: "Reportes" }]}
      />

      {/* Saved reports */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-graphite-500">Guardados:</span>
        {savedReports.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setDataset(s.dataset);
              showToast(`Reporte cargado: ${s.name}`);
            }}
            className="rounded-full bg-graphite-100 px-3 py-1.5 text-xs font-semibold text-graphite-600 hover:bg-petrol-50 hover:text-petrol-800 cursor-pointer"
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Builder */}
      <SectionCard title="Configuración">
        <div className="grid gap-4 sm:grid-cols-4">
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-semibold text-graphite-800">Reporte</span>
            <select value={dataset} onChange={(e) => setDataset(e.target.value)} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none">
              {reportOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-graphite-800">Desde</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-graphite-800">Hasta</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-graphite-800">Agrupación</span>
            <select value={grouping} onChange={(e) => setGrouping(e.target.value)} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none">
              {["diaria", "semanal", "mensual"].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
        </div>
      </SectionCard>

      {/* Result */}
      <SectionCard
        className="mt-4"
        title={reportLabel}
        description={`Período ${from.split("-").reverse().join("/")} al ${to.split("-").reverse().join("/")} · agrupación ${grouping} · datos demo`}
        actions={
          <div className="flex gap-2">
            <AdminButton size="sm" variant="secondary" onClick={exportCsv}>
              <DownloadSimpleIcon className="size-4" aria-hidden /> CSV
            </AdminButton>
            <AdminButton size="sm" variant="secondary" onClick={() => setScheduling(true)}>
              <CalendarPlusIcon className="size-4" aria-hidden /> Programar envío
            </AdminButton>
            <AdminButton size="sm" variant="secondary" onClick={() => showToast("Vista guardada en tus reportes")}>
              Guardar vista
            </AdminButton>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-graphite-100 text-left text-xs font-bold uppercase tracking-wide text-graphite-500">
                {report.columns.map((c, i) => (
                  <th key={c} className={`px-2 py-2 ${i > 0 ? "text-right" : ""}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-100">
              {report.rows.map((r) => (
                <tr key={r.label}>
                  <td className="px-2 py-2.5 font-semibold text-graphite-800">{r.label}</td>
                  <td className="px-2 py-2.5 text-right tabular">{r.col1}</td>
                  <td className="px-2 py-2.5 text-right tabular">{r.col2}</td>
                  <td className="px-2 py-2.5 text-right tabular">{r.col3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Schedule drawer */}
      <Drawer open={scheduling} onClose={() => setScheduling(false)} title="Programar envío">
        <div className="space-y-4">
          <p className="text-sm text-graphite-600">
            El reporte <span className="font-semibold">{reportLabel}</span> se enviará por correo con la
            configuración actual.
          </p>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-graphite-800">Frecuencia</span>
            <select className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none">
              {["Diaria (8:00)", "Semanal (lunes 8:00)", "Mensual (día 1, 8:00)"].map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-graphite-800">Destinatarios</span>
            <input defaultValue="gerencia@funestravel.com.ar" className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
          </label>
          <AdminButton
            onClick={() => {
              setScheduling(false);
              showToast("Envío programado (demo)");
            }}
          >
            Programar
          </AdminButton>
        </div>
      </Drawer>
    </div>
  );
}
