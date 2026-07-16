"use client";

import { useState } from "react";
import { excursions } from "@/data/excursions";
import { getDestination } from "@/data/destinations";
import type { Excursion } from "@/lib/types";
import { AdminButton, DataTable, Drawer, KVGrid, PageHeader, StatusBadge, useToast, type Column, type FilterDef } from "../ui";

/** Excursions manager with a compact editor drawer. */

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

const demoCapacity: Record<string, number> = {
  "navegacion-canal-beagle": 60,
  "gran-aventura-iguazu": 24,
  "isla-saona-catamaran": 40,
  "circuito-chico-colonia-suiza": 30,
  "vuelo-globo-capadocia": 16,
  "quebrada-humahuaca-dia-completo": 45,
  "bodegas-valle-de-uco": 12,
  "chichen-itza-cenote": 44,
};

function ExcursionEditor({ exc, onSaved }: { exc: Excursion; onSaved: () => void }) {
  const [name, setName] = useState(exc.name);
  const [duration, setDuration] = useState(exc.duration);
  const [schedule, setSchedule] = useState(exc.schedule);
  const [meetingPoint, setMeetingPoint] = useState(exc.meetingPoint);
  const [price, setPrice] = useState(exc.price.amount);
  const [difficulty, setDifficulty] = useState<string>(exc.difficulty);
  const [includes, setIncludes] = useState(exc.includes.join("\n"));
  const [bring, setBring] = useState(exc.bring.join("\n"));
  const [weather, setWeather] = useState(exc.weatherPolicy);

  return (
    <div className="space-y-4">
      <KVGrid
        items={[
          { label: "Destino", value: getDestination(exc.destinationSlug)?.name ?? exc.destinationSlug },
          { label: "Categoría", value: exc.category },
          { label: "Idioma", value: exc.language },
          { label: "Capacidad", value: <span className="tabular">{demoCapacity[exc.slug] ?? 30} pax</span> },
          { label: "Edad mínima", value: exc.minAge === 0 ? "Sin mínimo" : `${exc.minAge} años` },
          { label: "Rating", value: <span className="tabular">{exc.rating.toFixed(1)} ({exc.reviewsCount})</span> },
        ]}
        cols={2}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre">
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Precio (USD)">
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className={`${inputClass} tabular`} />
        </Field>
        <Field label="Duración">
          <input value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Dificultad">
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={`${inputClass} cursor-pointer`}>
            {["Baja", "Moderada", "Alta"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="Horarios">
          <input value={schedule} onChange={(e) => setSchedule(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Punto de encuentro">
          <input value={meetingPoint} onChange={(e) => setMeetingPoint(e.target.value)} className={inputClass} />
        </Field>
      </div>
      <Field label="Qué incluye (una por línea)">
        <textarea rows={4} value={includes} onChange={(e) => setIncludes(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Qué llevar (una por línea)">
        <textarea rows={3} value={bring} onChange={(e) => setBring(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Política climática">
        <textarea rows={2} value={weather} onChange={(e) => setWeather(e.target.value)} className={inputClass} />
      </Field>
      <div className="border-t border-graphite-100 pt-4">
        <AdminButton onClick={onSaved}>Guardar cambios (demo)</AdminButton>
      </div>
    </div>
  );
}

export function ExcursionsManager() {
  const [selected, setSelected] = useState<Excursion | null>(null);
  const { showToast, toastNode } = useToast();

  const columns: Column<Excursion>[] = [
    {
      id: "name",
      header: "Excursión",
      essential: true,
      cell: (e) => (
        <div>
          <p className="font-semibold text-graphite-800">{e.name}</p>
          <p className="text-xs text-graphite-500">{e.category} · {e.language}</p>
        </div>
      ),
      sortValue: (e) => e.name,
    },
    { id: "dest", header: "Destino", cell: (e) => getDestination(e.destinationSlug)?.name ?? e.destinationSlug, sortValue: (e) => e.destinationSlug },
    { id: "duration", header: "Duración", cell: (e) => e.duration, sortValue: (e) => e.duration },
    {
      id: "difficulty",
      header: "Dificultad",
      cell: (e) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            e.difficulty === "Alta" ? "bg-danger-100 text-danger-700" : e.difficulty === "Moderada" ? "bg-warning-100 text-warning-700" : "bg-positive-100 text-positive-700"
          }`}
        >
          {e.difficulty}
        </span>
      ),
      sortValue: (e) => e.difficulty,
    },
    { id: "capacity", header: "Capacidad", align: "right", cell: (e) => <span className="tabular">{demoCapacity[e.slug] ?? 30}</span>, sortValue: (e) => demoCapacity[e.slug] ?? 30 },
    { id: "price", header: "Precio", align: "right", cell: (e) => <span className="tabular font-semibold">USD {e.price.amount.toLocaleString("es-AR")}</span>, sortValue: (e) => e.price.amount },
    { id: "rating", header: "Rating", align: "right", cell: (e) => <span className="tabular">{e.rating.toFixed(1)}</span>, sortValue: (e) => e.rating },
    { id: "status", header: "Estado", essential: true, cell: () => <StatusBadge status="publicado" /> },
  ];

  const filters: FilterDef<Excursion>[] = [
    { id: "cat", label: "Categoría", options: ["Naturaleza", "Cultura", "Aventura", "Gastronomía", "Náutica"], matches: (e, v) => e.category === v },
    { id: "diff", label: "Dificultad", options: ["Baja", "Moderada", "Alta"], matches: (e, v) => e.difficulty === v },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Excursiones"
        description="Actividades en destino: horarios, dificultad, capacidad, políticas y precios."
        breadcrumb={[{ label: "Excursiones" }]}
      />
      <DataTable
        rows={excursions}
        columns={columns}
        rowKey={(e) => e.slug}
        searchKeys={(e) => `${e.name} ${e.category} ${e.destinationSlug}`}
        searchPlaceholder="Buscar excursiones…"
        filters={filters}
        exportName="excursiones"
        onRowClick={setSelected}
      />
      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? ""} wide>
        {selected && <ExcursionEditor exc={selected} onSaved={() => showToast("Excursión actualizada (demo)")} />}
      </Drawer>
    </div>
  );
}
