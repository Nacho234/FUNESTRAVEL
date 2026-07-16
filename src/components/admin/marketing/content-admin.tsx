"use client";

import { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@phosphor-icons/react";
import { contentSections, type ContentSection } from "@/data/admin-system";
import { AdminButton, Drawer, PageHeader, SectionCard, StatusBadge, useToast } from "@/components/admin/ui";

/** Site content CMS: toggle, reorder and edit the home sections' copy. */

export function ContentAdmin() {
  const [sections, setSections] = useState<ContentSection[]>([...contentSections].sort((a, b) => a.order - b.order));
  const [selected, setSelected] = useState<ContentSection | null>(null);
  const { showToast, toastNode } = useToast();

  const move = (id: string, dir: -1 | 1) => {
    setSections((list) => {
      const i = list.findIndex((s) => s.id === id);
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next.map((s, idx) => ({ ...s, order: idx + 1 }));
    });
  };

  const toggle = (id: string) => {
    setSections((list) => list.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
    showToast("Cambio guardado como borrador");
  };

  const patch = (p: Partial<ContentSection>) => setSelected((s) => (s ? { ...s, ...p } : s));

  const save = () => {
    if (!selected) return;
    setSections((list) => list.map((s) => (s.id === selected.id ? selected : s)));
    showToast("Textos guardados: se aplican al publicar (demo)");
    setSelected(null);
  };

  return (
    <div className="mx-auto max-w-[1100px]">
      {toastNode}
      <PageHeader
        title="Contenido del sitio"
        description="Editá textos, activá o desactivá secciones y reordená la home sin tocar código."
        breadcrumb={[{ label: "Contenido" }]}
      />

      <SectionCard
        title="Secciones de la home"
        description="El orden de esta lista es el orden real de la página de inicio."
      >
        <ul className="divide-y divide-graphite-100">
          {sections.map((s, i) => (
            <li key={s.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className="w-6 text-center text-xs font-bold text-graphite-400 tabular">{i + 1}</span>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => move(s.id, -1)}
                  disabled={i === 0}
                  className="grid size-6 place-items-center rounded border border-graphite-200 text-graphite-500 hover:text-petrol-800 disabled:opacity-30 cursor-pointer"
                  aria-label={`Subir ${s.name}`}
                >
                  <ArrowUpIcon className="size-3" aria-hidden />
                </button>
                <button
                  onClick={() => move(s.id, 1)}
                  disabled={i === sections.length - 1}
                  className="grid size-6 place-items-center rounded border border-graphite-200 text-graphite-500 hover:text-petrol-800 disabled:opacity-30 cursor-pointer"
                  aria-label={`Bajar ${s.name}`}
                >
                  <ArrowDownIcon className="size-3" aria-hidden />
                </button>
              </div>
              <button onClick={() => setSelected({ ...s })} className="min-w-0 flex-1 text-left cursor-pointer group">
                <p className="text-sm font-semibold text-graphite-800 group-hover:text-petrol-800">{s.name}</p>
                <p className="max-w-xl truncate text-xs text-graphite-500">{s.title}</p>
                <p className="mt-0.5 text-[0.6875rem] text-graphite-400">Fuente: {s.sourceFile}</p>
              </button>
              <StatusBadge status={s.active ? "activa" : "pausada"} />
              <label className="relative inline-flex cursor-pointer items-center" title={s.active ? "Desactivar" : "Activar"}>
                <input type="checkbox" checked={s.active} onChange={() => toggle(s.id)} className="peer sr-only" />
                <span className="h-5 w-9 rounded-full bg-graphite-200 transition-colors peer-checked:bg-teal-500" />
                <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
              </label>
            </li>
          ))}
        </ul>
      </SectionCard>

      <p className="mt-4 text-xs leading-relaxed text-graphite-500">
        Entorno demo: los cambios se guardan localmente. En producción, cada sección lee sus textos desde
        el archivo de datos indicado y publicar los cambios actualiza ese contenido con registro en la
        auditoría.
      </p>

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `Editar: ${selected.name}` : ""}>
        {selected && (
          <div className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-graphite-800">Título</span>
              <input value={selected.title} onChange={(e) => patch({ title: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-graphite-800">Descripción / subtítulo</span>
              <textarea rows={3} value={selected.description} onChange={(e) => patch({ description: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
            </label>
            {selected.ctaLabel !== undefined && (
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-graphite-800">CTA</span>
                <input value={selected.ctaLabel} onChange={(e) => patch({ ctaLabel: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
              </label>
            )}
            <p className="rounded-lg bg-sand-50 px-3 py-2 text-xs text-graphite-500">
              Fuente real: <span className="font-mono">{selected.sourceFile}</span>. Los cambios se aplican
              al publicar (demo).
            </p>
            <div className="flex gap-2">
              <AdminButton onClick={save}>Guardar</AdminButton>
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
