"use client";

import { useState } from "react";
import { CheckCircleIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import { packages } from "@/data/packages";
import { destinations } from "@/data/destinations";
import { formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

function NewPackagePanel({ onClose }: { onClose: () => void }) {
  const [saved, setSaved] = useState(false);

  const field =
    "w-full rounded-[var(--radius-control)] border border-graphite-200 bg-white px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/25";

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Nuevo paquete">
      <button className="absolute inset-0 bg-petrol-950/55 cursor-default" onClick={onClose} aria-label="Cerrar panel" />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-[var(--shadow-float)]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-petrol-900">Nuevo paquete</h2>
          <button onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-petrol-50 cursor-pointer" aria-label="Cerrar">
            <XIcon className="size-5" aria-hidden />
          </button>
        </div>

        {saved ? (
          <div className="mt-10 text-center">
            <CheckCircleIcon weight="fill" className="mx-auto size-12 text-positive-700" aria-hidden />
            <p className="mt-3 font-display text-lg font-bold text-petrol-900">Guardado (demo)</p>
            <p className="mx-auto mt-1 max-w-xs text-sm text-graphite-500">
              En producción este formulario crea el paquete en la base de datos y queda como borrador hasta publicarlo.
            </p>
            <button
              onClick={onClose}
              className="mt-5 rounded-[var(--radius-control)] bg-petrol-900 px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-petrol-800 cursor-pointer"
            >
              Volver al listado
            </button>
          </div>
        ) : (
          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(true);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label htmlFor="np-name" className="text-sm font-semibold text-graphite-800">Nombre comercial</label>
                <input id="np-name" required placeholder="Ej.: Cusco y Machu Picchu esencial" className={field} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="np-slug" className="text-sm font-semibold text-graphite-800">Slug</label>
                <input id="np-slug" required placeholder="cusco-machu-picchu-5-noches" className={field} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="np-dest" className="text-sm font-semibold text-graphite-800">Destino</label>
                <select id="np-dest" className={`${field} cursor-pointer`}>
                  {destinations.map((d) => (
                    <option key={d.slug}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="np-nights" className="text-sm font-semibold text-graphite-800">Noches</label>
                <input id="np-nights" type="number" min={1} defaultValue={7} className={field} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="np-regime" className="text-sm font-semibold text-graphite-800">Régimen</label>
                <select id="np-regime" className={`${field} cursor-pointer`}>
                  {["Solo alojamiento", "Desayuno", "Media pensión", "Pensión completa", "All inclusive"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="np-price" className="text-sm font-semibold text-graphite-800">Precio desde (por persona)</label>
                <input id="np-price" type="number" min={0} placeholder="1249" className={field} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="np-currency" className="text-sm font-semibold text-graphite-800">Moneda</label>
                <select id="np-currency" className={`${field} cursor-pointer`}>
                  <option>USD</option>
                  <option>ARS</option>
                </select>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label htmlFor="np-desc" className="text-sm font-semibold text-graphite-800">Descripción</label>
                <textarea id="np-desc" rows={4} placeholder="Qué hace especial a este paquete, qué incluye y para quién es." className={`${field} resize-y`} />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-graphite-100 pt-4">
              <p className="max-w-[16rem] text-xs text-graphite-500">
                Demo: no persiste datos. La versión productiva guarda en PostgreSQL con validación de esquema.
              </p>
              <button
                type="submit"
                className="rounded-[var(--radius-control)] bg-coral-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-coral-600 cursor-pointer"
              >
                Guardar paquete
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function ProductsManager() {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-graphite-500 tabular">{packages.length} paquetes publicados</p>
        <button
          onClick={() => setPanelOpen(true)}
          className="flex items-center gap-1.5 rounded-[var(--radius-control)] bg-coral-500 px-4 py-2 text-sm font-bold text-white hover:bg-coral-600 cursor-pointer"
        >
          <PlusIcon weight="bold" className="size-4" aria-hidden /> Nuevo paquete
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)]">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-graphite-500 border-b border-graphite-100">
              <th className="px-4 py-3 font-semibold">Paquete</th>
              <th className="px-4 py-3 font-semibold">Destino</th>
              <th className="px-4 py-3 font-semibold text-right">Noches</th>
              <th className="px-4 py-3 font-semibold text-right">Desde</th>
              <th className="px-4 py-3 font-semibold text-right">Salidas</th>
              <th className="px-4 py-3 font-semibold text-right">Cupos rest.</th>
              <th className="px-4 py-3 font-semibold text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-graphite-100">
            {packages.map((p) => {
              const dest = destinations.find((d) => d.slug === p.destinationSlug);
              const seats = p.departures.reduce((s, d) => s + d.seatsLeft, 0);
              return (
                <tr key={p.slug} className="hover:bg-sand-50/60">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-graphite-800">{p.name}</span>
                    <span className="block text-xs text-graphite-500">{p.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-graphite-700">{dest?.name ?? p.destinationSlug}</td>
                  <td className="px-4 py-3 text-right text-graphite-700 tabular">{p.nights}</td>
                  <td className="px-4 py-3 text-right font-semibold text-graphite-800 tabular">{formatMoney(p.priceFrom)}</td>
                  <td className="px-4 py-3 text-right text-graphite-700 tabular">{p.departures.length}</td>
                  <td className={`px-4 py-3 text-right tabular ${seats <= 15 ? "font-semibold text-coral-700" : "text-graphite-700"}`}>
                    {seats}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex gap-1.5">
                      <Badge tone="positive">Publicado</Badge>
                      {p.featured && <Badge tone="coral">Destacado</Badge>}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {panelOpen && <NewPackagePanel onClose={() => setPanelOpen(false)} />}
    </div>
  );
}
