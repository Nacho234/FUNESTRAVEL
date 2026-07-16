"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { UploadSimpleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { mediaLibrary, type MediaItem } from "@/data/admin-system";
import { AdminButton, Drawer, EmptyState, KVGrid, PageHeader, useToast } from "@/components/admin/ui";

/** Media manager: folder filters, search, detail drawer with usage map. */

const folders = ["todas", "destinos", "experiencias", "hoteles", "escenas", "planificación"] as const;

export function MediaAdmin() {
  const [items, setItems] = useState<MediaItem[]>(mediaLibrary);
  const [folder, setFolder] = useState<(typeof folders)[number]>("todas");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const { showToast, toastNode } = useToast();

  const filtered = useMemo(() => {
    let out = items;
    if (folder !== "todas") out = out.filter((m) => m.folder === folder);
    const q = query.trim().toLowerCase();
    if (q) out = out.filter((m) => `${m.name} ${m.altText}`.toLowerCase().includes(q));
    return out;
  }, [items, folder, query]);

  const patch = (p: Partial<MediaItem>) => setSelected((s) => (s ? { ...s, ...p } : s));

  const save = () => {
    if (!selected) return;
    setItems((its) => its.map((m) => (m.id === selected.id ? selected : m)));
    showToast("Cambios guardados");
  };

  const archive = () => {
    if (!selected) return;
    setItems((its) => its.filter((m) => m.id !== selected.id));
    showToast("Archivo archivado");
    setSelected(null);
    setConfirmArchive(false);
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Biblioteca de medios"
        description="Imágenes del sitio con su uso actual. Reemplazar un archivo actualiza todas las páginas que lo usan."
        breadcrumb={[{ label: "Medios" }]}
        actions={
          <AdminButton onClick={() => setUploading(true)}>
            <UploadSimpleIcon className="size-4" aria-hidden /> Subir
          </AdminButton>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {folders.map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f)}
            aria-pressed={folder === f}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize cursor-pointer transition-colors ${
              folder === f ? "bg-petrol-900 text-ivory" : "bg-graphite-100 text-graphite-600 hover:bg-petrol-50"
            }`}
          >
            {f}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o alt text…"
          className="ml-auto w-64 rounded-[var(--radius-control)] border border-graphite-200 bg-white px-3 py-2 text-sm placeholder:text-graphite-400 focus:border-teal-500 focus:outline-none"
          aria-label="Buscar medios"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Sin archivos" detail="No hay medios en esta carpeta con esa búsqueda." />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => {
                  setSelected({ ...m });
                  setConfirmArchive(false);
                }}
                className="group block w-full overflow-hidden rounded-xl border border-graphite-200/70 bg-white text-left cursor-pointer hover:border-teal-500/60 transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.altText} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <div className="p-2.5">
                  <p className="truncate text-xs font-semibold text-graphite-800">{m.name}</p>
                  <p className="mt-0.5 text-[0.6875rem] text-graphite-400">
                    {m.format} · {m.sizeKb} KB · usado en {m.usedIn.length}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Detail drawer */}
      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? ""} wide>
        {selected && (
          <div className="space-y-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.url} alt={selected.altText} className="max-h-72 w-full rounded-xl object-cover" />
            <KVGrid
              cols={3}
              items={[
                { label: "Formato", value: selected.format },
                { label: "Tamaño", value: `${selected.sizeKb} KB` },
                { label: "Fecha", value: selected.date.split("-").reverse().join("/") },
                { label: "Carpeta", value: <span className="capitalize">{selected.folder}</span> },
                { label: "Autor", value: "Equipo Funes Travel" },
                { label: "Usos", value: selected.usedIn.length },
              ]}
            />
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-graphite-800">Alt text</span>
              <input value={selected.altText} onChange={(e) => patch({ altText: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
            </label>
            <div>
              <p className="mb-1.5 text-sm font-semibold text-graphite-800">Usado en</p>
              <ul className="space-y-1">
                {selected.usedIn.map((u) => (
                  <li key={u}>
                    <Link href={u} target="_blank" className="text-sm text-teal-600 hover:underline">
                      {u}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-graphite-800">Reemplazar por URL (demo)</span>
              <input
                placeholder="https://…"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const v = (e.target as HTMLInputElement).value.trim();
                    if (v) {
                      patch({ url: v });
                      showToast("Imagen reemplazada en todos sus usos (demo)");
                    }
                  }
                }}
                className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </label>
            <div className="flex flex-wrap gap-2 border-t border-dashed border-sand-200 pt-4">
              <AdminButton onClick={save}>Guardar</AdminButton>
              <AdminButton
                variant="secondary"
                onClick={() => {
                  navigator.clipboard?.writeText(selected.url);
                  showToast("URL copiada");
                }}
              >
                Copiar URL
              </AdminButton>
              {!confirmArchive ? (
                <AdminButton variant="danger" onClick={() => setConfirmArchive(true)}>
                  Archivar
                </AdminButton>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-danger-100/60 px-3 py-2">
                  <WarningCircleIcon className="size-4 shrink-0 text-danger-700" aria-hidden />
                  <p className="text-xs text-danger-700">
                    Este archivo se usa en {selected.usedIn.length} página{selected.usedIn.length === 1 ? "" : "s"} ({selected.usedIn.join(", ")}). ¿Archivar igual?
                  </p>
                  <AdminButton size="sm" variant="danger" onClick={archive}>
                    Sí, archivar
                  </AdminButton>
                  <AdminButton size="sm" variant="ghost" onClick={() => setConfirmArchive(false)}>
                    No
                  </AdminButton>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Upload drawer */}
      <Drawer open={uploading} onClose={() => setUploading(false)} title="Subir archivo">
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-graphite-800">Archivo</span>
            <input type="file" className="w-full rounded-[var(--radius-control)] border border-dashed border-graphite-300 px-3 py-6 text-sm text-graphite-500 cursor-pointer" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-graphite-800">O pegar URL</span>
            <input id="upload-url" placeholder="https://…" className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-graphite-800">Carpeta</span>
            <select id="upload-folder" className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm capitalize cursor-pointer focus:border-teal-500 focus:outline-none">
              {folders.filter((f) => f !== "todas").map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>
          <AdminButton
            onClick={() => {
              const url = (document.getElementById("upload-url") as HTMLInputElement)?.value.trim();
              const fold = ((document.getElementById("upload-folder") as HTMLSelectElement)?.value ?? "escenas") as MediaItem["folder"];
              if (!url) {
                showToast("Pegá una URL para el demo");
                return;
              }
              setItems((its) => [
                { id: `m-${Date.now().toString(36)}`, name: "Nuevo archivo", url, folder: fold, altText: "", usedIn: [], sizeKb: 300, format: "JPG", date: "2026-07-16" },
                ...its,
              ]);
              showToast("Archivo subido (demo)");
              setUploading(false);
            }}
          >
            Subir
          </AdminButton>
        </div>
      </Drawer>
    </div>
  );
}
