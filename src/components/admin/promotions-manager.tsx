"use client";

import { useState } from "react";
import { CheckCircleIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import { promotions } from "@/data/content";
import { formatDate, formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

// Reference date for the demo dataset (mirrors the mock data timeline).
const TODAY = "2026-07-15";

function promoState(validUntil: string): "activa" | "por-vencer" | "vencida" {
  if (validUntil < TODAY) return "vencida";
  const days = Math.round((new Date(validUntil).getTime() - new Date(TODAY).getTime()) / 86400000);
  return days <= 30 ? "por-vencer" : "activa";
}

function NewPromotionPanel({ onClose }: { onClose: () => void }) {
  const [saved, setSaved] = useState(false);
  const field =
    "w-full rounded-[var(--radius-control)] border border-graphite-200 bg-white px-3.5 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/25";

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Nueva promoción">
      <button className="absolute inset-0 bg-petrol-950/55 cursor-default" onClick={onClose} aria-label="Cerrar panel" />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-[var(--shadow-float)]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-petrol-900">Nueva promoción</h2>
          <button onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-petrol-50 cursor-pointer" aria-label="Cerrar">
            <XIcon className="size-5" aria-hidden />
          </button>
        </div>

        {saved ? (
          <div className="mt-10 text-center">
            <CheckCircleIcon weight="fill" className="mx-auto size-12 text-positive-700" aria-hidden />
            <p className="mt-3 font-display text-lg font-bold text-petrol-900">Guardada (demo)</p>
            <p className="mx-auto mt-1 max-w-xs text-sm text-graphite-500">
              En producción la promoción queda en borrador y se publica al aprobarla, con vigencia controlada.
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
            <div className="flex flex-col gap-1.5">
              <label htmlFor="pr-title" className="text-sm font-semibold text-graphite-800">Título</label>
              <input id="pr-title" required placeholder="Ej.: Nieve 2026 en 9 cuotas sin interés" className={field} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="pr-detail" className="text-sm font-semibold text-graphite-800">Detalle</label>
              <input id="pr-detail" required placeholder="A qué productos aplica" className={field} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pr-tag" className="text-sm font-semibold text-graphite-800">Tipo</label>
                <select id="pr-tag" className={`${field} cursor-pointer`}>
                  {["Cuotas", "Descuento", "Cupos limitados", "Salida confirmada", "Compra anticipada", "Grupos"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pr-until" className="text-sm font-semibold text-graphite-800">Vigente hasta</label>
                <input id="pr-until" type="date" required className={field} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="pr-conditions" className="text-sm font-semibold text-graphite-800">Condiciones</label>
              <textarea
                id="pr-conditions"
                rows={3}
                required
                placeholder="Condiciones completas y visibles: base, cupos, exclusiones. Sin letra escondida."
                className={`${field} resize-y`}
              />
            </div>
            <div className="flex items-center justify-between border-t border-graphite-100 pt-4">
              <p className="max-w-[16rem] text-xs text-graphite-500">Demo: no persiste datos.</p>
              <button
                type="submit"
                className="rounded-[var(--radius-control)] bg-coral-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-coral-600 cursor-pointer"
              >
                Guardar promoción
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function PromotionsManager() {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-graphite-500 tabular">{promotions.length} promociones cargadas</p>
        <button
          onClick={() => setPanelOpen(true)}
          className="flex items-center gap-1.5 rounded-[var(--radius-control)] bg-coral-500 px-4 py-2 text-sm font-bold text-white hover:bg-coral-600 cursor-pointer"
        >
          <PlusIcon weight="bold" className="size-4" aria-hidden /> Nueva promoción
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {promotions.map((p) => {
          const state = promoState(p.validUntil);
          return (
            <article key={p.id} className="flex flex-wrap items-start justify-between gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-lift)]">
              <div className="min-w-0 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-base font-bold text-petrol-900">{p.title}</h2>
                  <Badge tone="neutral">{p.tag}</Badge>
                  {state === "activa" && <Badge tone="positive">Activa</Badge>}
                  {state === "por-vencer" && <Badge tone="warning">Por vencer</Badge>}
                  {state === "vencida" && <Badge tone="danger">Vencida</Badge>}
                </div>
                <p className="mt-1 text-sm text-graphite-600">{p.detail} · incluye {p.includes}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-graphite-500">{p.conditions}</p>
              </div>
              <div className="text-right text-sm">
                {p.priceFrom && (
                  <p className="font-semibold text-graphite-800 tabular">desde {formatMoney(p.priceFrom)}</p>
                )}
                <p className="text-graphite-500 tabular">hasta el {formatDate(p.validUntil)}</p>
              </div>
            </article>
          );
        })}
      </div>

      {panelOpen && <NewPromotionPanel onClose={() => setPanelOpen(false)} />}
    </div>
  );
}
