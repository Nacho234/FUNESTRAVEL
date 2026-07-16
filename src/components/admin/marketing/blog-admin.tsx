"use client";

import Link from "next/link";
import { useState } from "react";
import { articles } from "@/data/content";
import { blogDrafts } from "@/data/admin-system";
import {
  AdminButton,
  DataTable,
  Drawer,
  PageHeader,
  StatusBadge,
  useToast,
  type Column,
  type FilterDef,
} from "@/components/admin/ui";

/** Blog manager over the real articles plus demo drafts. */

interface BlogRow {
  slug: string;
  title: string;
  category: string;
  status: "publicado" | "borrador" | "programado" | "en revisión";
  date: string;
  readMinutes: number;
  excerpt: string;
  image?: string;
  body: string;
  published: boolean;
}

const seed: BlogRow[] = [
  ...articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    category: a.category,
    status: "publicado" as const,
    date: a.date,
    readMinutes: a.readMinutes,
    excerpt: a.excerpt,
    image: a.image,
    body: a.body.join("\n\n"),
    published: true,
  })),
  ...blogDrafts.map((d) => ({
    slug: d.slug,
    title: d.title,
    category: d.category,
    status: d.status,
    date: d.date,
    readMinutes: 4,
    excerpt: d.excerpt,
    image: undefined,
    body: "",
    published: false,
  })),
];

const categories = ["Documentación", "Presupuesto", "Guías", "Equipaje", "Asistencia"];

export function BlogAdmin({ openNew = false }: { openNew?: boolean }) {
  const [rows, setRows] = useState<BlogRow[]>(seed);
  const emptyRow: BlogRow = {
    slug: "",
    title: "",
    category: categories[0],
    status: "borrador",
    date: "2026-07-16",
    readMinutes: 4,
    excerpt: "",
    body: "",
    published: false,
  };
  const [selected, setSelected] = useState<BlogRow | null>(openNew ? emptyRow : null);
  const { showToast, toastNode } = useToast();

  const patch = (p: Partial<BlogRow>) => setSelected((s) => (s ? { ...s, ...p } : s));

  const save = () => {
    if (!selected) return;
    const slug = selected.slug || selected.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const next = { ...selected, slug };
    setRows((rs) => (rs.some((r) => r.slug === slug) ? rs.map((r) => (r.slug === slug ? next : r)) : [next, ...rs]));
    showToast("Publicación guardada");
    setSelected(null);
  };

  const columns: Column<BlogRow>[] = [
    {
      id: "title",
      header: "Artículo",
      essential: true,
      cell: (r) => (
        <div>
          <p className="font-semibold text-graphite-800">{r.title}</p>
          <p className="max-w-md truncate text-xs text-graphite-500">{r.excerpt}</p>
        </div>
      ),
      sortValue: (r) => r.title,
    },
    { id: "cat", header: "Categoría", cell: (r) => r.category, sortValue: (r) => r.category },
    { id: "date", header: "Fecha", cell: (r) => <span className="tabular">{r.date.split("-").reverse().join("/")}</span>, sortValue: (r) => r.date },
    { id: "min", header: "Lectura", align: "right", cell: (r) => <span className="tabular">{r.readMinutes} min</span>, sortValue: (r) => r.readMinutes },
    { id: "status", header: "Estado", essential: true, cell: (r) => <StatusBadge status={r.status} />, sortValue: (r) => r.status },
  ];

  const filters: FilterDef<BlogRow>[] = [
    { id: "estado", label: "Estado", options: ["publicado", "borrador", "programado", "en revisión"], matches: (r, v) => r.status === v },
    { id: "cat", label: "Categoría", options: categories, matches: (r, v) => r.category === v },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Blog"
        description="Guías y artículos de inspiración que alimentan /inspiracion y la sección de la home."
        breadcrumb={[{ label: "Blog" }]}
        actions={<AdminButton onClick={() => setSelected(emptyRow)}>Nueva publicación</AdminButton>}
      />

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(r) => r.slug || r.title}
        searchKeys={(r) => `${r.title} ${r.category} ${r.excerpt}`}
        searchPlaceholder="Buscar artículos…"
        filters={filters}
        exportName="blog"
        onRowClick={(r) => setSelected({ ...r })}
        emptyTitle="Sin artículos"
        emptyDetail="Creá la primera publicación."
      />

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.slug ? "Editar publicación" : "Nueva publicación"} wide>
        {selected && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block font-semibold text-graphite-800">Título</span>
                <input value={selected.title} onChange={(e) => patch({ title: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-graphite-800">Categoría</span>
                <select value={selected.category} onChange={(e) => patch({ category: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none">
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-graphite-800">Estado</span>
                <select value={selected.status} onChange={(e) => patch({ status: e.target.value as BlogRow["status"] })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none">
                  {["borrador", "en revisión", "programado", "publicado"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              {selected.status === "programado" && (
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-graphite-800">Fecha programada</span>
                  <input type="date" value={selected.date} onChange={(e) => patch({ date: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
                </label>
              )}
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block font-semibold text-graphite-800">Imagen de portada (URL)</span>
                <input value={selected.image ?? ""} onChange={(e) => patch({ image: e.target.value })} placeholder="https://…" className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
              </label>
            </div>
            {selected.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selected.image} alt="Portada" className="h-36 w-full rounded-xl object-cover" />
            )}
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-graphite-800">Extracto (también usado como description SEO)</span>
              <textarea rows={2} value={selected.excerpt} onChange={(e) => patch({ excerpt: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
              <span className={`mt-1 block text-xs tabular ${selected.excerpt.length > 160 ? "text-danger-700" : "text-graphite-400"}`}>
                {selected.excerpt.length}/160 caracteres
              </span>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-graphite-800">Cuerpo (un párrafo por bloque, separados por línea en blanco)</span>
              <textarea rows={8} value={selected.body} onChange={(e) => patch({ body: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm leading-relaxed focus:border-teal-500 focus:outline-none" />
            </label>
            <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-sand-200 pt-4">
              <AdminButton onClick={save}>Guardar</AdminButton>
              {selected.published && selected.slug && (
                <Link href={`/inspiracion/${selected.slug}`} target="_blank" className="inline-flex items-center rounded-[var(--radius-control)] border border-graphite-200 px-3.5 py-2 text-sm font-semibold text-petrol-900 hover:border-petrol-600">
                  Ver en el sitio
                </Link>
              )}
              <AdminButton variant="ghost" onClick={() => setSelected(null)}>
                Cancelar
              </AdminButton>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
