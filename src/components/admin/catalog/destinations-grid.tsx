"use client";

import Link from "next/link";
import { useState } from "react";
import { destinations } from "@/data/destinations";
import type { Destination } from "@/lib/types";
import { AdminButton, Drawer, PageHeader, StatusBadge, useToast } from "../ui";

/** Destinations CMS: editorial cards + full drawer editor. */

const regions = ["Argentina", "Brasil", "Caribe", "Estados Unidos", "Europa", "Sudamérica", "Exóticos"];
const idealForOptions = ["Playa", "Nieve", "Aventura", "Familia", "Pareja", "Luna de miel", "Gastronomía", "Cultura", "Escapadas", "Relax", "Lujo", "Amigos", "Bajo presupuesto"];

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

function DestinationEditor({ dest, onClose, onSaved }: { dest: Destination; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(dest.name);
  const [country, setCountry] = useState(dest.country);
  const [region, setRegion] = useState<string>(dest.region);
  const [tagline, setTagline] = useState(dest.tagline);
  const [description, setDescription] = useState(dest.description);
  const [season, setSeason] = useState(dest.season);
  const [nightsHint, setNightsHint] = useState(dest.suggestedNights);
  const [price, setPrice] = useState(dest.priceFrom.amount);
  const [highlights, setHighlights] = useState<string[]>(dest.highlights);
  const [idealFor, setIdealFor] = useState<string[]>(dest.idealFor);
  const [image, setImage] = useState(dest.image);
  const [seoTitle, setSeoTitle] = useState(`${dest.name} · viajes y paquetes`);

  return (
    <div className="space-y-4">
      {/* eslint-disable-next-line @next/next/no-img-element -- preview de URL arbitraria en el editor */}
      <img src={image} alt={`Portada de ${name}`} className="h-40 w-full rounded-lg object-cover" />
      <Field label="Imagen principal (URL)">
        <input value={image} onChange={(e) => setImage(e.target.value)} className={inputClass} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre">
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Field>
        <Field label="País">
          <input value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Región">
          <select value={region} onChange={(e) => setRegion(e.target.value)} className={`${inputClass} cursor-pointer`}>
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="Precio orientativo (USD)">
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className={`${inputClass} tabular`} />
        </Field>
        <Field label="Mejor época">
          <input value={season} onChange={(e) => setSeason(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Noches sugeridas">
          <input value={nightsHint} onChange={(e) => setNightsHint(e.target.value)} className={inputClass} />
        </Field>
      </div>
      <Field label="Tagline">
        <input value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Descripción">
        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
      </Field>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-graphite-600">Highlights</p>
        <ul className="space-y-1.5">
          {highlights.map((h, i) => (
            <li key={i} className="flex gap-1.5">
              <input
                value={h}
                onChange={(e) => setHighlights((hs) => hs.map((x, j) => (j === i ? e.target.value : x)))}
                className={inputClass}
                aria-label={`Highlight ${i + 1}`}
              />
              <AdminButton size="sm" variant="danger" onClick={() => setHighlights((hs) => hs.filter((_, j) => j !== i))}>
                Quitar
              </AdminButton>
            </li>
          ))}
        </ul>
        <AdminButton size="sm" variant="secondary" className="mt-2" onClick={() => setHighlights((hs) => [...hs, ""])}>
          Agregar highlight
        </AdminButton>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-xs font-semibold text-graphite-600">Ideal para</legend>
        <div className="flex flex-wrap gap-1.5">
          {idealForOptions.map((s) => {
            const on = idealFor.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => setIdealFor(on ? idealFor.filter((x) => x !== s) : [...idealFor, s])}
                aria-pressed={on}
                className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                  on ? "bg-petrol-900 text-ivory" : "bg-graphite-100 text-graphite-600 hover:bg-petrol-50"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Field label="Título SEO">
        <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputClass} />
      </Field>

      <div className="flex flex-wrap gap-2 border-t border-graphite-100 pt-4">
        <AdminButton
          onClick={() => {
            onSaved();
            onClose();
          }}
        >
          Guardar cambios (demo)
        </AdminButton>
        <Link
          href={`/destinos/${dest.slug}`}
          target="_blank"
          className="inline-flex items-center rounded-[var(--radius-control)] border border-graphite-200 px-3.5 py-2 text-sm font-semibold text-petrol-900 hover:border-petrol-600"
        >
          Ver en el sitio
        </Link>
      </div>
    </div>
  );
}

export function DestinationsGrid() {
  const [selected, setSelected] = useState<Destination | null>(null);
  const [query, setQuery] = useState("");
  const { showToast, toastNode } = useToast();

  const filtered = destinations.filter((d) => `${d.name} ${d.country} ${d.region}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Destinos"
        description="CMS de destinos: fotografías, textos, highlights y prioridad en el sitio."
        breadcrumb={[{ label: "Destinos" }]}
        actions={
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar destinos…"
            className="w-52 rounded-[var(--radius-control)] border border-graphite-200 bg-white px-3 py-2 text-sm placeholder:text-graphite-400 focus:border-teal-500 focus:outline-none"
            aria-label="Buscar destinos"
          />
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {filtered.map((d) => (
          <button
            key={d.slug}
            onClick={() => setSelected(d)}
            className="group overflow-hidden rounded-xl border border-graphite-200/70 bg-white text-left transition-colors hover:border-teal-500/60 cursor-pointer"
          >
            <div className="relative h-28 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element -- miniatura administrable */}
              <img src={d.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
              {d.trending && (
                <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[0.625rem] font-bold text-petrol-900">Tendencia</span>
              )}
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-graphite-800">{d.name}</p>
                <StatusBadge status="publicado" />
              </div>
              <p className="mt-0.5 truncate text-xs text-graphite-500">{d.country} · {d.region}</p>
              <p className="mt-1 text-xs text-graphite-500 tabular">Desde USD {d.priceFrom.amount.toLocaleString("es-AR")}</p>
            </div>
          </button>
        ))}
      </div>

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `Editar: ${selected.name}` : ""} wide>
        {selected && <DestinationEditor dest={selected} onClose={() => setSelected(null)} onSaved={() => showToast("Destino actualizado (demo)")} />}
      </Drawer>
    </div>
  );
}
