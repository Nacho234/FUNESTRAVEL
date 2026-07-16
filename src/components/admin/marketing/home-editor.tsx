"use client";

import { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, InfoIcon } from "@phosphor-icons/react";
import { contentSections, type ContentSection } from "@/data/admin-system";
import { AdminButton, PageHeader, useToast } from "@/components/admin/ui";

/** Visual home editor: ordered section list + live iframe preview per device. */

const devices = [
  { id: "desktop", label: "Desktop", width: "100%" },
  { id: "tablet", label: "Tablet", width: "768px" },
  { id: "mobile", label: "Mobile", width: "390px" },
] as const;

export function HomeEditor() {
  const [sections, setSections] = useState<ContentSection[]>([...contentSections].sort((a, b) => a.order - b.order));
  const [device, setDevice] = useState<(typeof devices)[number]["id"]>("desktop");
  const { showToast, toastNode } = useToast();

  const move = (id: string, dir: -1 | 1) => {
    setSections((list) => {
      const i = list.findIndex((s) => s.id === id);
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const width = devices.find((d) => d.id === device)!.width;

  return (
    <div className="mx-auto max-w-[1500px]">
      {toastNode}
      <PageHeader
        title="Editor de home"
        description="Activá, desactivá y reordená las secciones de la página de inicio con vista previa real."
        breadcrumb={[{ label: "Editor de home" }]}
        actions={
          <>
            <AdminButton variant="secondary" onClick={() => showToast("Borrador guardado")}>
              Guardar borrador
            </AdminButton>
            <AdminButton onClick={() => showToast("Cambios publicados (demo)")}>Publicar</AdminButton>
          </>
        }
      />

      <div className="mb-4 flex items-start gap-2 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3 text-sm text-graphite-700">
        <InfoIcon className="mt-0.5 size-4.5 shrink-0 text-teal-600" aria-hidden />
        <p>
          El reordenamiento y los toggles son una configuración controlada: no permiten romper el diseño.
          En este demo la vista previa muestra la home publicada; los cambios se aplican al publicar.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        {/* Sections list */}
        <div className="rounded-xl border border-graphite-200/70 bg-white">
          <div className="border-b border-graphite-100 px-4 py-3">
            <h2 className="text-sm font-bold text-petrol-900">Secciones</h2>
          </div>
          <ul className="divide-y divide-graphite-100 p-2">
            {sections.map((s, i) => (
              <li key={s.id} className={`flex items-center gap-2.5 rounded-lg px-2 py-2.5 ${s.active ? "" : "opacity-50"}`}>
                <span className="w-5 text-center text-xs font-bold text-graphite-400 tabular">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-graphite-800">{s.name}</p>
                  <p className="truncate text-[0.6875rem] text-graphite-400">{s.title}</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => move(s.id, -1)}
                    disabled={i === 0}
                    className="grid size-5 place-items-center rounded border border-graphite-200 text-graphite-500 hover:text-petrol-800 disabled:opacity-30 cursor-pointer"
                    aria-label={`Subir ${s.name}`}
                  >
                    <ArrowUpIcon className="size-2.5" aria-hidden />
                  </button>
                  <button
                    onClick={() => move(s.id, 1)}
                    disabled={i === sections.length - 1}
                    className="grid size-5 place-items-center rounded border border-graphite-200 text-graphite-500 hover:text-petrol-800 disabled:opacity-30 cursor-pointer"
                    aria-label={`Bajar ${s.name}`}
                  >
                    <ArrowDownIcon className="size-2.5" aria-hidden />
                  </button>
                </div>
                <label className="relative inline-flex cursor-pointer items-center" title={s.active ? "Desactivar" : "Activar"}>
                  <input
                    type="checkbox"
                    checked={s.active}
                    onChange={() => setSections((list) => list.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)))}
                    className="peer sr-only"
                  />
                  <span className="h-4.5 w-8 rounded-full bg-graphite-200 transition-colors peer-checked:bg-teal-500" />
                  <span className="absolute left-0.5 top-0.5 size-3.5 rounded-full bg-white transition-transform peer-checked:translate-x-3.5" />
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Live preview */}
        <div className="rounded-xl border border-graphite-200/70 bg-white">
          <div className="flex items-center justify-between border-b border-graphite-100 px-4 py-2.5">
            <h2 className="text-sm font-bold text-petrol-900">Vista previa</h2>
            <div className="flex gap-1 rounded-lg border border-graphite-200 p-0.5" role="group" aria-label="Dispositivo">
              {devices.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id)}
                  aria-pressed={device === d.id}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                    device === d.id ? "bg-petrol-900 text-ivory" : "text-graphite-500 hover:text-petrol-800"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-center bg-sand-50/60 p-4">
            <div style={{ width, maxWidth: "100%" }} className="pointer-events-none overflow-hidden rounded-lg border border-graphite-200 shadow-[var(--shadow-lift)] transition-[width] duration-300">
              <iframe
                src="/"
                title="Vista previa de la home"
                sandbox="allow-same-origin allow-scripts"
                className="h-[70vh] w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
