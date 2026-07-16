"use client";

import Link from "next/link";
import { useState } from "react";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { seoAudit, seoPages, seoRedirects, type SeoRedirect } from "@/data/admin-system";
import {
  AdminButton,
  DataTable,
  PageHeader,
  SectionCard,
  StatusBadge,
  useToast,
  type Column,
  type FilterDef,
} from "@/components/admin/ui";

/** SEO panel: audit, redirects, sitemap/robots and per-page metadata. */

type Finding = (typeof seoAudit)[number];

export function SeoAdmin() {
  const [redirects, setRedirects] = useState<SeoRedirect[]>(seoRedirects);
  const [newFrom, setNewFrom] = useState("");
  const [newTo, setNewTo] = useState("");
  const [pagePath, setPagePath] = useState(seoPages[0].path);
  const [meta, setMeta] = useState(seoPages[0]);
  const { showToast, toastNode } = useToast();

  const counts = {
    error: seoAudit.filter((f) => f.level === "error").length,
    warning: seoAudit.filter((f) => f.level === "warning").length,
    ok: seoAudit.filter((f) => f.level === "ok").length,
  };

  const levelStatus: Record<Finding["level"], string> = { ok: "aprobado", warning: "pendiente", error: "rechazado" };

  const columns: Column<Finding>[] = [
    { id: "page", header: "Página", essential: true, cell: (f) => <span className="font-mono text-xs text-petrol-900">{f.page}</span>, sortValue: (f) => f.page },
    { id: "finding", header: "Hallazgo", essential: true, cell: (f) => f.finding, sortValue: (f) => f.finding },
    { id: "level", header: "Nivel", essential: true, cell: (f) => <StatusBadge status={levelStatus[f.level]} />, sortValue: (f) => f.level },
    { id: "rec", header: "Recomendación", cell: (f) => <span className="text-xs text-graphite-600">{f.recommendation}</span> },
  ];

  const filters: FilterDef<Finding>[] = [
    { id: "level", label: "Nivel", options: ["error", "warning", "ok"], matches: (f, v) => f.level === v },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="SEO"
        description="Auditoría técnica, metadata por página, redirecciones y archivos de indexación."
        breadcrumb={[{ label: "SEO" }]}
      />

      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: "Errores", value: counts.error, tone: "text-danger-700" },
          { label: "Advertencias", value: counts.warning, tone: "text-warning-700" },
          { label: "Correctos", value: counts.ok, tone: "text-positive-700" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-graphite-200/70 bg-white px-4 py-3">
            <p className="text-xs text-graphite-500">{m.label}</p>
            <p className={`mt-0.5 font-display text-xl font-bold tabular ${m.tone}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <DataTable
        rows={seoAudit}
        columns={columns}
        rowKey={(f) => f.id}
        searchKeys={(f) => `${f.page} ${f.finding} ${f.recommendation}`}
        searchPlaceholder="Buscar hallazgos…"
        filters={filters}
        exportName="seo-auditoria"
        emptyTitle="Sin hallazgos"
        emptyDetail="La auditoría no encontró resultados con esos filtros."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Metadata editor */}
        <SectionCard title="Metadata por página" description="Título, description e imagen social de las páginas principales.">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-graphite-800">Página</span>
            <select
              value={pagePath}
              onChange={(e) => {
                setPagePath(e.target.value);
                setMeta({ ...seoPages.find((p) => p.path === e.target.value)! });
              }}
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 font-mono text-sm cursor-pointer focus:border-teal-500 focus:outline-none"
            >
              {seoPages.map((p) => (
                <option key={p.path} value={p.path}>
                  {p.path}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-sm">
            <span className="mb-1 block font-semibold text-graphite-800">Título</span>
            <input value={meta.title} onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
            <span className={`mt-1 block text-xs tabular ${meta.title.length > 60 ? "text-warning-700" : "text-graphite-400"}`}>{meta.title.length}/60</span>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-graphite-800">Description</span>
            <textarea rows={3} value={meta.description} onChange={(e) => setMeta((m) => ({ ...m, description: e.target.value }))} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
            <span className={`mt-1 block text-xs tabular ${meta.description.length > 160 ? "text-danger-700 font-semibold" : "text-graphite-400"}`}>
              {meta.description.length}/160 {meta.description.length > 160 && "· demasiado larga, se recorta en resultados"}
            </span>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-graphite-800">Imagen Open Graph</span>
            <input value={meta.ogImage} onChange={(e) => setMeta((m) => ({ ...m, ogImage: e.target.value }))} placeholder="URL 1200x630" className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
          </label>
          <AdminButton className="mt-3" onClick={() => showToast("Metadata guardada (demo)")}>
            Guardar metadata
          </AdminButton>
        </SectionCard>

        <div className="space-y-4">
          {/* Redirects */}
          <SectionCard title="Redirecciones" description="301 permanentes para URLs viejas o contenido vencido.">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-graphite-100 text-left text-xs font-bold uppercase tracking-wide text-graphite-500">
                  <th className="px-2 py-1.5">Origen</th>
                  <th className="px-2 py-1.5">Destino</th>
                  <th className="px-2 py-1.5">Tipo</th>
                  <th className="px-2 py-1.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite-100">
                {redirects.map((r) => (
                  <tr key={r.id}>
                    <td className="px-2 py-2 font-mono text-xs">{r.from}</td>
                    <td className="px-2 py-2 font-mono text-xs">{r.to}</td>
                    <td className="px-2 py-2 text-xs tabular">{r.type}</td>
                    <td className="px-2 py-2 text-right">
                      <button
                        onClick={() => {
                          setRedirects((rs) => rs.filter((x) => x.id !== r.id));
                          showToast("Redirección eliminada");
                        }}
                        className="grid size-7 place-items-center rounded text-graphite-400 hover:bg-danger-100/60 hover:text-danger-700 cursor-pointer"
                        aria-label={`Eliminar redirección ${r.from}`}
                      >
                        <TrashIcon className="size-3.5" aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 flex flex-wrap items-end gap-2">
              <label className="block text-xs">
                <span className="mb-1 block font-semibold text-graphite-700">Origen</span>
                <input value={newFrom} onChange={(e) => setNewFrom(e.target.value)} placeholder="/ruta-vieja" className="w-36 rounded-[var(--radius-control)] border border-graphite-200 px-2.5 py-1.5 font-mono text-xs focus:border-teal-500 focus:outline-none" />
              </label>
              <label className="block text-xs">
                <span className="mb-1 block font-semibold text-graphite-700">Destino</span>
                <input value={newTo} onChange={(e) => setNewTo(e.target.value)} placeholder="/ruta-nueva" className="w-36 rounded-[var(--radius-control)] border border-graphite-200 px-2.5 py-1.5 font-mono text-xs focus:border-teal-500 focus:outline-none" />
              </label>
              <AdminButton
                size="sm"
                variant="secondary"
                onClick={() => {
                  if (!newFrom.startsWith("/") || !newTo.startsWith("/")) {
                    showToast("Las rutas deben empezar con /");
                    return;
                  }
                  setRedirects((rs) => [...rs, { id: `r-${Date.now().toString(36)}`, from: newFrom, to: newTo, type: "301" }]);
                  setNewFrom("");
                  setNewTo("");
                  showToast("Redirección agregada");
                }}
              >
                <PlusIcon className="size-3.5" aria-hidden /> Agregar
              </AdminButton>
            </div>
          </SectionCard>

          {/* Sitemap / robots */}
          <SectionCard title="Indexación">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-graphite-700">Sitemap generado automáticamente</span>
                <Link href="/sitemap.xml" target="_blank" className="font-mono text-xs text-teal-600 hover:underline">
                  /sitemap.xml
                </Link>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-graphite-700">Robots (admin, checkout y cuenta excluidos)</span>
                <Link href="/robots.txt" target="_blank" className="font-mono text-xs text-teal-600 hover:underline">
                  /robots.txt
                </Link>
              </li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
