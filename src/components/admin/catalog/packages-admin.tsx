"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, CopyIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { getPackage, packages } from "@/data/packages";
import { destinations } from "@/data/destinations";
import { inclusionsLibrary } from "@/data/admin-catalog";
import type { ItineraryDay, TravelStyle } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { AdminButton, DataTable, PageHeader, SectionCard, StatusBadge, useToast, type Column } from "../ui";

/** Packages module: list + full editor (general, itinerary, departures, inclusions, SEO). */

const travelStyleOptions: TravelStyle[] = ["Playa", "Nieve", "Aventura", "Familia", "Pareja", "Luna de miel", "Gastronomía", "Cultura", "Escapadas", "Relax", "Lujo", "Amigos"];

const editorSections = [
  { id: "general", label: "Información general" },
  { id: "itinerario", label: "Itinerario" },
  { id: "salidas", label: "Salidas" },
  { id: "inclusiones", label: "Inclusiones y exclusiones" },
  { id: "seo", label: "SEO" },
];

interface EditableDeparture {
  id: string;
  date: string;
  price: number;
  seats: number;
  confirmed: boolean;
}

const inputClass =
  "w-full rounded-[var(--radius-control)] border border-graphite-200 bg-white px-3 py-2 text-sm text-graphite-800 focus:border-teal-500 focus:outline-none";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-semibold text-graphite-600">{label}</span>
      {children}
    </label>
  );
}

/* ── listado ─────────────────────────────────────────────────────── */

function PackagesList() {
  const rows = packages;
  const columns: Column<(typeof packages)[number]>[] = [
    {
      id: "name",
      header: "Paquete",
      essential: true,
      cell: (p) => (
        <div>
          <p className="font-semibold text-graphite-800">{p.name}</p>
          <p className="text-xs text-graphite-500">{p.cities.join(" · ")}</p>
        </div>
      ),
      sortValue: (p) => p.name,
    },
    { id: "nights", header: "Noches", align: "right", cell: (p) => <span className="tabular">{p.nights}</span>, sortValue: (p) => p.nights },
    { id: "departures", header: "Salidas", align: "right", cell: (p) => <span className="tabular">{p.departures.length}</span>, sortValue: (p) => p.departures.length },
    {
      id: "seats",
      header: "Cupos rest.",
      align: "right",
      cell: (p) => {
        const seats = p.departures.reduce((s, d) => s + d.seatsLeft, 0);
        return <span className={`tabular font-semibold ${seats <= 10 ? "text-coral-700" : "text-graphite-700"}`}>{seats}</span>;
      },
      sortValue: (p) => p.departures.reduce((s, d) => s + d.seatsLeft, 0),
    },
    { id: "price", header: "Desde", align: "right", cell: (p) => <span className="tabular">USD {p.priceFrom.amount.toLocaleString("es-AR")}</span>, sortValue: (p) => p.priceFrom.amount },
    { id: "rating", header: "Rating", align: "right", cell: (p) => <span className="tabular">{p.rating.toFixed(1)}</span>, sortValue: (p) => p.rating },
    {
      id: "status",
      header: "Estado",
      essential: true,
      cell: (p) => <StatusBadge status={p.departures.reduce((s, d) => s + d.seatsLeft, 0) === 0 ? "agotado" : "publicado"} />,
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Paquetes"
        description="Editor completo: información, itinerario día por día, salidas, inclusiones y SEO."
        breadcrumb={[{ label: "Paquetes" }]}
        actions={
          <Link
            href="/admin/paquetes?nuevo=1"
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-coral-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-coral-600"
          >
            <PlusIcon weight="bold" className="size-4" aria-hidden /> Nuevo paquete
          </Link>
        }
      />
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(p) => p.slug}
        searchKeys={(p) => `${p.name} ${p.cities.join(" ")} ${p.destinationSlug}`}
        searchPlaceholder="Buscar paquetes…"
        exportName="paquetes"
        onRowClick={(p) => {
          window.location.href = `/admin/paquetes?slug=${p.slug}`;
        }}
        pageSize={12}
      />
    </div>
  );
}

/* ── editor ──────────────────────────────────────────────────────── */

function PackageEditor({ slug, isNew }: { slug?: string; isNew: boolean }) {
  const pkg = useMemo(() => (slug ? getPackage(slug) : undefined), [slug]);
  const { showToast, toastNode } = useToast();

  const [name, setName] = useState(pkg?.name ?? "");
  const [summary, setSummary] = useState(pkg?.summary ?? "");
  const [destination, setDestination] = useState(pkg?.destinationSlug ?? destinations[0].slug);
  const [cities, setCities] = useState((pkg?.cities ?? []).join(", "));
  const [styles, setStyles] = useState<TravelStyle[]>(pkg?.travelStyles ?? []);
  const [nights, setNights] = useState(pkg?.nights ?? 7);
  const [hotelStars, setHotelStars] = useState(pkg?.hotelStars ?? 4);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(pkg?.itinerary ?? []);
  const [departures, setDepartures] = useState<EditableDeparture[]>(
    (pkg?.departures ?? []).map((d) => ({ id: d.id, date: d.date, price: d.pricePerPerson.amount, seats: d.seatsLeft, confirmed: d.confirmed })),
  );
  const [inclusions, setInclusions] = useState<string[]>(() =>
    inclusionsLibrary.filter((i) => (pkg?.includes ?? []).some((inc) => inc.toLowerCase().includes(i.label.split(" ")[0].toLowerCase()))).map((i) => i.id),
  );
  const [freeInclusions, setFreeInclusions] = useState((pkg?.includes ?? []).join("\n"));
  const [exclusions, setExclusions] = useState((pkg?.notIncludes ?? []).join("\n"));
  const [seoTitle, setSeoTitle] = useState(pkg ? `${pkg.name} · ${pkg.nights} noches` : "");
  const [seoDescription, setSeoDescription] = useState(pkg?.summary ?? "");
  const [seoSlug, setSeoSlug] = useState(pkg?.slug ?? "");

  const moveDay = (index: number, dir: -1 | 1) => {
    setItinerary((days) => {
      const next = [...days];
      const target = index + dir;
      if (target < 0 || target >= next.length) return days;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((d, i) => ({ ...d, day: i + 1 }));
    });
  };

  const duplicateDay = (index: number) => {
    setItinerary((days) => {
      const next = [...days];
      next.splice(index + 1, 0, { ...days[index] });
      return next.map((d, i) => ({ ...d, day: i + 1 }));
    });
  };

  const removeDay = (index: number) => {
    setItinerary((days) => days.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 })));
  };

  const updateDay = (index: number, patch: Partial<ItineraryDay>) => {
    setItinerary((days) => days.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  };

  const toggleMeal = (index: number, meal: string) => {
    setItinerary((days) =>
      days.map((d, i) =>
        i === index ? { ...d, meals: d.meals.includes(meal) ? d.meals.filter((m) => m !== meal) : [...d.meals, meal] } : d,
      ),
    );
  };

  if (!isNew && !pkg) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Paquete no encontrado" breadcrumb={[{ label: "Paquetes", href: "/admin/paquetes" }, { label: "Editor" }]} />
        <p className="text-sm text-graphite-600">
          El paquete solicitado no existe.{" "}
          <Link href="/admin/paquetes" className="font-semibold text-teal-600">
            Volver al listado
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] pb-24">
      {toastNode}
      <PageHeader
        title={isNew ? "Nuevo paquete" : `Editar: ${pkg!.name}`}
        description={isNew ? "Completá las secciones y guardá como borrador o publicá." : "Los cambios se aplican al catálogo del sitio."}
        breadcrumb={[{ label: "Paquetes", href: "/admin/paquetes" }, { label: isNew ? "Nuevo" : pkg!.name }]}
        actions={
          !isNew && (
            <Link
              href={`/paquetes/${pkg!.slug}`}
              target="_blank"
              className="inline-flex items-center rounded-[var(--radius-control)] border border-graphite-200 px-3.5 py-2 text-sm font-semibold text-petrol-900 hover:border-petrol-600"
            >
              Ver en el sitio
            </Link>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        {/* Navegación lateral por secciones */}
        <nav aria-label="Secciones del editor" className="lg:sticky lg:top-20 lg:self-start">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col">
            {editorSections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#sec-${s.id}`}
                  className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-graphite-600 hover:bg-white hover:text-petrol-900"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-5">
          {/* Información general */}
          <div id="sec-general" className="scroll-mt-20">
            <SectionCard title="Información general">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre" className="sm:col-span-2">
                  <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Ej.: Punta Cana esencial" />
                </Field>
                <Field label="Subtítulo comercial" className="sm:col-span-2">
                  <input value={summary} onChange={(e) => setSummary(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Destino">
                  <select value={destination} onChange={(e) => setDestination(e.target.value)} className={`${inputClass} cursor-pointer`}>
                    {destinations.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Ciudades (separadas por coma)">
                  <input value={cities} onChange={(e) => setCities(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Duración (noches)">
                  <input type="number" min={1} value={nights} onChange={(e) => setNights(Number(e.target.value))} className={inputClass} />
                </Field>
                <Field label="Categoría de hotel (estrellas)">
                  <input type="number" min={1} max={5} value={hotelStars} onChange={(e) => setHotelStars(Number(e.target.value))} className={inputClass} />
                </Field>
              </div>
              <fieldset className="mt-4">
                <legend className="mb-1.5 text-xs font-semibold text-graphite-600">Tipo de viaje</legend>
                <div className="flex flex-wrap gap-1.5">
                  {travelStyleOptions.map((s) => {
                    const on = styles.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStyles(on ? styles.filter((x) => x !== s) : [...styles, s])}
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
            </SectionCard>
          </div>

          {/* Itinerario */}
          <div id="sec-itinerario" className="scroll-mt-20">
            <SectionCard
              title="Itinerario día por día"
              actions={
                <AdminButton
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    setItinerary((days) => [
                      ...days,
                      { day: days.length + 1, city: "", title: "", description: "", meals: [] },
                    ])
                  }
                >
                  <PlusIcon className="size-3.5" aria-hidden /> Agregar día
                </AdminButton>
              }
            >
              {itinerary.length === 0 ? (
                <p className="py-4 text-center text-sm text-graphite-500">Sin días cargados. Agregá el primero para empezar.</p>
              ) : (
                <ol className="space-y-4">
                  {itinerary.map((day, i) => (
                    <li key={`${i}-${day.title}`} className="rounded-lg border border-graphite-100 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold uppercase tracking-wide text-teal-600 tabular">Día {day.day}</p>
                        <div className="flex gap-1">
                          <button onClick={() => moveDay(i, -1)} disabled={i === 0} className="grid size-7 place-items-center rounded-md border border-graphite-200 text-graphite-500 hover:text-petrol-800 disabled:opacity-30 cursor-pointer" aria-label={`Subir día ${day.day}`}>
                            <ArrowUpIcon className="size-3.5" aria-hidden />
                          </button>
                          <button onClick={() => moveDay(i, 1)} disabled={i === itinerary.length - 1} className="grid size-7 place-items-center rounded-md border border-graphite-200 text-graphite-500 hover:text-petrol-800 disabled:opacity-30 cursor-pointer" aria-label={`Bajar día ${day.day}`}>
                            <ArrowDownIcon className="size-3.5" aria-hidden />
                          </button>
                          <button onClick={() => duplicateDay(i)} className="grid size-7 place-items-center rounded-md border border-graphite-200 text-graphite-500 hover:text-petrol-800 cursor-pointer" aria-label={`Duplicar día ${day.day}`}>
                            <CopyIcon className="size-3.5" aria-hidden />
                          </button>
                          <button onClick={() => removeDay(i)} className="grid size-7 place-items-center rounded-md border border-danger-100 text-danger-700 hover:bg-danger-100/50 cursor-pointer" aria-label={`Eliminar día ${day.day}`}>
                            <TrashIcon className="size-3.5" aria-hidden />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <Field label="Ciudad">
                          <input value={day.city} onChange={(e) => updateDay(i, { city: e.target.value })} className={inputClass} />
                        </Field>
                        <Field label="Título">
                          <input value={day.title} onChange={(e) => updateDay(i, { title: e.target.value })} className={inputClass} />
                        </Field>
                        <Field label="Descripción" className="sm:col-span-2">
                          <textarea rows={2} value={day.description} onChange={(e) => updateDay(i, { description: e.target.value })} className={inputClass} />
                        </Field>
                        <Field label="Hotel (opcional)">
                          <input value={day.hotelName ?? ""} onChange={(e) => updateDay(i, { hotelName: e.target.value || undefined })} className={inputClass} />
                        </Field>
                        <fieldset>
                          <legend className="mb-1 block text-xs font-semibold text-graphite-600">Comidas</legend>
                          <div className="flex gap-3 pt-1.5">
                            {["Desayuno", "Almuerzo", "Cena"].map((m) => (
                              <label key={m} className="flex items-center gap-1.5 text-sm text-graphite-700 cursor-pointer">
                                <input type="checkbox" checked={day.meals.includes(m)} onChange={() => toggleMeal(i, m)} className="size-3.5 accent-teal-600 cursor-pointer" />
                                {m}
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </SectionCard>
          </div>

          {/* Salidas */}
          <div id="sec-salidas" className="scroll-mt-20">
            <SectionCard
              title="Salidas"
              description="Fecha, precio por persona, cupos y estado de confirmación."
              actions={
                <AdminButton
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    setDepartures((ds) => [...ds, { id: `nueva-${ds.length + 1}`, date: "2026-12-01", price: 0, seats: 20, confirmed: false }])
                  }
                >
                  <PlusIcon className="size-3.5" aria-hidden /> Agregar salida
                </AdminButton>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-graphite-100 text-left text-xs font-bold uppercase tracking-wide text-graphite-500">
                      <th className="px-2 py-2">Fecha</th>
                      <th className="px-2 py-2 text-right">Precio USD</th>
                      <th className="px-2 py-2 text-right">Cupos</th>
                      <th className="px-2 py-2">Confirmada</th>
                      <th className="px-2 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-graphite-100">
                    {departures.map((d, i) => (
                      <tr key={d.id}>
                        <td className="px-2 py-2">
                          <input
                            type="date"
                            value={d.date}
                            onChange={(e) => setDepartures((ds) => ds.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)))}
                            className={inputClass}
                            aria-label={`Fecha de la salida ${i + 1}`}
                          />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <input
                            type="number"
                            value={d.price}
                            onChange={(e) => setDepartures((ds) => ds.map((x, j) => (j === i ? { ...x, price: Number(e.target.value) } : x)))}
                            className={`${inputClass} max-w-28 text-right tabular`}
                            aria-label={`Precio de la salida ${formatDate(d.date)}`}
                          />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <input
                            type="number"
                            value={d.seats}
                            onChange={(e) => setDepartures((ds) => ds.map((x, j) => (j === i ? { ...x, seats: Number(e.target.value) } : x)))}
                            className={`${inputClass} max-w-20 text-right tabular`}
                            aria-label={`Cupos de la salida ${formatDate(d.date)}`}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <label className="flex items-center gap-2 text-sm text-graphite-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={d.confirmed}
                              onChange={(e) => setDepartures((ds) => ds.map((x, j) => (j === i ? { ...x, confirmed: e.target.checked } : x)))}
                              className="size-3.5 accent-teal-600 cursor-pointer"
                            />
                            {d.confirmed ? "Confirmada" : "Pendiente"}
                          </label>
                        </td>
                        <td className="px-2 py-2 text-right">
                          <button
                            onClick={() => setDepartures((ds) => ds.filter((_, j) => j !== i))}
                            className="grid size-7 place-items-center rounded-md border border-danger-100 text-danger-700 hover:bg-danger-100/50 cursor-pointer"
                            aria-label={`Eliminar salida ${formatDate(d.date)}`}
                          >
                            <TrashIcon className="size-3.5" aria-hidden />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>

          {/* Inclusiones */}
          <div id="sec-inclusiones" className="scroll-mt-20">
            <SectionCard title="Inclusiones y exclusiones" description="Marcá desde la biblioteca reutilizable o escribí libremente.">
              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold text-graphite-600">Biblioteca de inclusiones</p>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {inclusionsLibrary.map((item) => (
                      <label key={item.id} className="flex items-center gap-2 text-sm text-graphite-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inclusions.includes(item.id)}
                          onChange={() =>
                            setInclusions((ids) => (ids.includes(item.id) ? ids.filter((x) => x !== item.id) : [...ids, item.id]))
                          }
                          className="size-3.5 accent-teal-600 cursor-pointer"
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Field label="Inclusiones (una por línea)">
                    <textarea rows={5} value={freeInclusions} onChange={(e) => setFreeInclusions(e.target.value)} className={inputClass} />
                  </Field>
                  <Field label="Exclusiones (una por línea)">
                    <textarea rows={4} value={exclusions} onChange={(e) => setExclusions(e.target.value)} className={inputClass} />
                  </Field>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* SEO */}
          <div id="sec-seo" className="scroll-mt-20">
            <SectionCard title="SEO">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Título SEO">
                  <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Slug">
                  <input value={seoSlug} onChange={(e) => setSeoSlug(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Meta description" className="sm:col-span-2">
                  <textarea rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className={inputClass} />
                  <span className={`mt-1 block text-xs ${seoDescription.length > 160 ? "text-danger-700" : "text-graphite-400"}`}>
                    {seoDescription.length}/160 caracteres
                  </span>
                </Field>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* Guardar sticky */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-graphite-200/70 bg-white/95 px-4 py-3 backdrop-blur lg:left-60">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-graphite-500">
            Entorno demo: los cambios reales requieren la base de datos. Todo cambio queda auditado.
          </p>
          <div className="flex gap-2">
            <AdminButton variant="secondary" onClick={() => showToast("Borrador guardado (demo)")}>
              Guardar borrador
            </AdminButton>
            <AdminButton onClick={() => showToast("Cambios guardados (demo)")}>Guardar cambios</AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PackagesAdmin({ slug, isNew }: { slug?: string; isNew?: boolean }) {
  if (slug || isNew) return <PackageEditor slug={slug} isNew={Boolean(isNew)} />;
  return <PackagesList />;
}
