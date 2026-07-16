"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FadersIcon,
  ListBulletsIcon,
  ScalesIcon,
  SquaresFourIcon,
  XIcon,
} from "@phosphor-icons/react";
import type { TravelPackage } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/format";
import { PackageCard } from "@/components/cards/package-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { PriceBlock } from "@/components/ui/price";
import { FavoriteButton } from "@/components/cards/favorite-button";

/* ────────────────────────── filter model ────────────────────────── */

interface Filters {
  priceMax: number;
  nights: string[]; // "1-4" | "5-8" | "9+"
  origins: string[];
  regimes: string[];
  transports: string[];
  styles: string[];
  confirmedOnly: boolean;
  installmentsOnly: boolean;
  stars: number[];
}

const emptyFilters: Filters = {
  priceMax: 5000,
  nights: [],
  origins: [],
  regimes: [],
  transports: [],
  styles: [],
  confirmedOnly: false,
  installmentsOnly: false,
  stars: [],
};

const nightBuckets = [
  { id: "1-4", label: "Hasta 4 noches" },
  { id: "5-8", label: "5 a 8 noches" },
  { id: "9+", label: "9 noches o más" },
];

type SortKey = "recomendados" | "precio-asc" | "precio-desc" | "rating" | "duracion" | "salida";

const sortOptions: { id: SortKey; label: string }[] = [
  { id: "recomendados", label: "Recomendados" },
  { id: "precio-asc", label: "Menor precio" },
  { id: "precio-desc", label: "Mayor precio" },
  { id: "rating", label: "Mejor puntuación" },
  { id: "duracion", label: "Menor duración" },
  { id: "salida", label: "Próxima salida" },
];

function applyFilters(pkgs: TravelPackage[], f: Filters): TravelPackage[] {
  return pkgs.filter((p) => {
    if (p.priceFrom.amount > f.priceMax) return false;
    if (f.nights.length) {
      const ok = f.nights.some((b) =>
        b === "1-4" ? p.nights <= 4 : b === "5-8" ? p.nights >= 5 && p.nights <= 8 : p.nights >= 9,
      );
      if (!ok) return false;
    }
    if (f.origins.length && !f.origins.some((o) => p.departureCity.includes(o))) return false;
    if (f.regimes.length && !f.regimes.includes(p.regime)) return false;
    if (f.transports.length && !f.transports.includes(p.transport)) return false;
    if (f.styles.length && !f.styles.some((s) => p.travelStyles.includes(s as TravelPackage["travelStyles"][number]))) return false;
    if (f.confirmedOnly && !p.departures.some((d) => d.confirmed)) return false;
    if (f.installmentsOnly && !p.installments) return false;
    if (f.stars.length && !f.stars.includes(p.hotelStars)) return false;
    return true;
  });
}

function sortPackages(pkgs: TravelPackage[], sort: SortKey): TravelPackage[] {
  const arr = [...pkgs];
  switch (sort) {
    case "precio-asc":
      return arr.sort((a, b) => a.priceFrom.amount - b.priceFrom.amount);
    case "precio-desc":
      return arr.sort((a, b) => b.priceFrom.amount - a.priceFrom.amount);
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating);
    case "duracion":
      return arr.sort((a, b) => a.nights - b.nights);
    case "salida":
      return arr.sort((a, b) => (a.departures[0]?.date ?? "9999").localeCompare(b.departures[0]?.date ?? "9999"));
    default:
      return arr.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || b.rating - a.rating);
  }
}

/* ─────────────────────── filter panel (shared) ──────────────────── */

function CheckGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset className="border-b border-graphite-100 py-4">
      <legend className="text-sm font-bold text-graphite-800">{title}</legend>
      <div className="mt-2.5 space-y-2">
        {options.map((o) => (
          <label key={o.id} className="flex cursor-pointer items-center gap-2.5 text-sm text-graphite-600 hover:text-graphite-800">
            <input
              type="checkbox"
              checked={selected.includes(o.id)}
              onChange={() => onToggle(o.id)}
              className="size-4 accent-teal-600 cursor-pointer"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function FilterPanel({ filters, setFilters }: { filters: Filters; setFilters: (f: Filters) => void }) {
  const toggle = (key: keyof Pick<Filters, "nights" | "origins" | "regimes" | "transports" | "styles">) => (id: string) => {
    const arr = filters[key];
    setFilters({ ...filters, [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] });
  };

  return (
    <div>
      <fieldset className="border-b border-graphite-100 py-4">
        <legend className="text-sm font-bold text-graphite-800">Precio máximo por persona</legend>
        <input
          type="range"
          min={300}
          max={5000}
          step={100}
          value={filters.priceMax}
          onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
          className="mt-3 w-full accent-teal-600 cursor-pointer"
          aria-label="Precio máximo por persona en dólares"
        />
        <p className="mt-1 text-sm font-semibold text-petrol-900 tabular">
          {filters.priceMax >= 5000 ? "Sin límite" : `Hasta USD ${filters.priceMax.toLocaleString("es-AR")}`}
        </p>
      </fieldset>

      <CheckGroup title="Duración" options={nightBuckets} selected={filters.nights} onToggle={toggle("nights")} />
      <CheckGroup
        title="Ciudad de salida"
        options={["Rosario", "Buenos Aires"].map((o) => ({ id: o, label: o }))}
        selected={filters.origins}
        onToggle={toggle("origins")}
      />
      <CheckGroup
        title="Régimen"
        options={["Desayuno", "Media pensión", "All inclusive"].map((r) => ({ id: r, label: r }))}
        selected={filters.regimes}
        onToggle={toggle("regimes")}
      />
      <CheckGroup
        title="Transporte"
        options={["Aéreo", "Bus"].map((t) => ({ id: t, label: t }))}
        selected={filters.transports}
        onToggle={toggle("transports")}
      />
      <CheckGroup
        title="Tipo de viaje"
        options={["Playa", "Nieve", "Aventura", "Familia", "Pareja", "Luna de miel", "Cultura", "Gastronomía", "Escapadas"].map((s) => ({ id: s, label: s }))}
        selected={filters.styles}
        onToggle={toggle("styles")}
      />

      <fieldset className="py-4">
        <legend className="text-sm font-bold text-graphite-800">Disponibilidad y pago</legend>
        <div className="mt-2.5 space-y-2">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-graphite-600 hover:text-graphite-800">
            <input
              type="checkbox"
              checked={filters.confirmedOnly}
              onChange={() => setFilters({ ...filters, confirmedOnly: !filters.confirmedOnly })}
              className="size-4 accent-teal-600 cursor-pointer"
            />
            Solo salidas confirmadas
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-graphite-600 hover:text-graphite-800">
            <input
              type="checkbox"
              checked={filters.installmentsOnly}
              onChange={() => setFilters({ ...filters, installmentsOnly: !filters.installmentsOnly })}
              className="size-4 accent-teal-600 cursor-pointer"
            />
            Con financiación en cuotas
          </label>
        </div>
      </fieldset>
    </div>
  );
}

/* ───────────────────────── list-view card ───────────────────────── */

function PackageRow({ pkg }: { pkg: TravelPackage }) {
  const next = pkg.departures[0];
  return (
    <article className="group relative grid overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)] transition-shadow hover:shadow-[var(--shadow-float)] md:grid-cols-[260px_1fr_240px]">
      <div className="relative h-44 md:h-full min-h-44">
        <Image src={pkg.image} alt="" fill sizes="(max-width: 768px) 100vw, 260px" className="object-cover" />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {pkg.promo && <Badge tone="coral">{pkg.promo.label}</Badge>}
        </div>
        <div className="absolute right-3 top-3 z-10">
          <FavoriteButton itemKey={`pkg:${pkg.slug}`} />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">{pkg.cities.join(" · ")}</p>
            <h3 className="mt-0.5 font-display text-lg font-bold text-petrol-900">
              <Link href={`/paquetes/${pkg.slug}`} className="after:absolute after:inset-0">
                {pkg.name}
              </Link>
            </h3>
          </div>
          <Rating value={pkg.rating} count={pkg.reviewsCount} />
        </div>
        <p className="mt-1.5 text-sm text-graphite-600">{pkg.summary}</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] text-graphite-600">
          <li>{pkg.nights} noches</li>
          <li>{pkg.transport} desde {pkg.departureCity}</li>
          <li>{pkg.regime}</li>
          <li>{pkg.hotelStars}★ {pkg.hotelName}</li>
          {next && <li className={next.confirmed ? "font-semibold text-positive-700" : ""}>Sale {formatDate(next.date)}{next.confirmed ? " · confirmada" : ""}</li>}
        </ul>
      </div>
      <div className="flex flex-row items-end justify-between gap-2 border-t border-graphite-100 p-5 md:flex-col md:border-t-0 md:border-l md:text-right">
        <PriceBlock price={pkg.priceFrom} installments={pkg.installments} taxesIncluded={pkg.taxesIncluded} size="sm" align="right" />
        <span className="relative z-10 rounded-[var(--radius-control)] bg-petrol-900 px-4 py-2 text-sm font-semibold text-ivory pointer-events-none group-hover:bg-petrol-800 transition-colors">
          Ver detalle
        </span>
      </div>
    </article>
  );
}

/* ───────────────────────── compare drawer ───────────────────────── */

const compareRows: { label: string; render: (p: TravelPackage) => React.ReactNode }[] = [
  { label: "Precio desde", render: (p) => <span className="font-bold text-petrol-900 tabular">{formatMoney(p.priceFrom)}</span> },
  { label: "Noches", render: (p) => p.nights },
  { label: "Hotel", render: (p) => `${p.hotelName} (${p.hotelStars}★)` },
  { label: "Régimen", render: (p) => p.regime },
  { label: "Transporte", render: (p) => `${p.transport} desde ${p.departureCity}` },
  { label: "Excursiones incluidas", render: (p) => (p.hasExcursions ? "Sí" : "No") },
  { label: "Traslados", render: (p) => (p.hasTransfers ? "Incluidos" : "No incluidos") },
  { label: "Asistencia al viajero", render: (p) => (p.hasInsurance ? "Incluida" : "No incluida") },
  { label: "Financiación", render: (p) => (p.installments ? `${p.installments.count} cuotas` : "Consultar") },
  { label: "Puntuación", render: (p) => `${p.rating.toFixed(1)} (${p.reviewsCount})` },
  { label: "Próxima salida", render: (p) => (p.departures[0] ? formatDate(p.departures[0].date) : "A confirmar") },
];

function CompareModal({ slugs, all, onClose }: { slugs: string[]; all: TravelPackage[]; onClose: () => void }) {
  const items = all.filter((p) => slugs.includes(p.slug));
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Comparar paquetes">
      <button className="absolute inset-0 bg-petrol-950/60 cursor-default" onClick={onClose} aria-label="Cerrar comparador" />
      <div className="absolute left-1/2 top-1/2 max-h-[85vh] w-[94%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-2xl bg-white shadow-[var(--shadow-float)]">
        <div className="sticky top-0 flex items-center justify-between border-b border-graphite-100 bg-white px-6 py-4">
          <h2 className="font-display text-lg font-bold text-petrol-900">Comparación de paquetes</h2>
          <button onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-petrol-50 cursor-pointer" aria-label="Cerrar">
            <XIcon className="size-5" aria-hidden />
          </button>
        </div>
        <div className="overflow-x-auto p-6">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr>
                <th className="w-44 pb-3 text-left align-bottom text-graphite-500 font-medium"> </th>
                {items.map((p) => (
                  <th key={p.slug} className="pb-3 pr-4 text-left align-bottom">
                    <Link href={`/paquetes/${p.slug}`} className="font-display text-base font-bold text-petrol-900 hover:underline">
                      {p.name}
                    </Link>
                    <p className="font-normal text-xs text-graphite-500">{p.cities.join(" · ")}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-sand-50/60" : ""}>
                  <th scope="row" className="py-2.5 pl-2 pr-4 text-left font-medium text-graphite-500">
                    {row.label}
                  </th>
                  {items.map((p) => (
                    <td key={p.slug} className="py-2.5 pr-4 text-graphite-800">
                      {row.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="pt-4" />
                {items.map((p) => (
                  <td key={p.slug} className="pt-4 pr-4">
                    <ButtonLink href={`/paquetes/${p.slug}`} size="sm" variant="secondary">
                      Ver fechas y precios
                    </ButtonLink>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── main results ───────────────────────── */

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)]">
      <div className="aspect-[3/2] animate-pulse bg-graphite-100" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-graphite-100" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-graphite-100" />
        <div className="h-3 w-full animate-pulse rounded bg-graphite-100" />
        <div className="h-8 w-32 animate-pulse rounded bg-graphite-100" />
      </div>
    </div>
  );
}

export function PackageResults({
  packages,
  initialStyle,
  emptyContext,
}: {
  packages: TravelPackage[];
  initialStyle?: string;
  emptyContext?: string;
}) {
  const [filters, setFilters] = useState<Filters>(() => ({
    ...emptyFilters,
    styles: initialStyle ? [initialStyle] : [],
  }));
  const [sort, setSort] = useState<SortKey>("recomendados");
  const [view, setView] = useState<"grid" | "list">("list");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setHydrating(false), 350);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => sortPackages(applyFilters(packages, filters), sort), [packages, filters, sort]);

  const activeCount =
    filters.nights.length +
    filters.origins.length +
    filters.regimes.length +
    filters.transports.length +
    filters.styles.length +
    (filters.confirmedOnly ? 1 : 0) +
    (filters.installmentsOnly ? 1 : 0) +
    (filters.priceMax < 5000 ? 1 : 0);

  const clearAll = () => setFilters(emptyFilters);

  const toggleCompare = (slug: string) => {
    setCompare((c) => (c.includes(slug) ? c.filter((s) => s !== slug) : c.length >= 3 ? c : [...c, slug]));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-lift)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-petrol-900">Filtrar</h2>
            {activeCount > 0 && (
              <button onClick={clearAll} className="text-xs font-semibold text-teal-600 hover:underline cursor-pointer">
                Limpiar ({activeCount})
              </button>
            )}
          </div>
          <FilterPanel filters={filters} setFilters={setFilters} />
        </div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-graphite-600" aria-live="polite">
            <span className="font-bold text-petrol-900 tabular">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "paquete encontrado" : "paquetes encontrados"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 rounded-[var(--radius-control)] border border-graphite-200 bg-white px-3.5 py-2 text-sm font-semibold text-graphite-800 lg:hidden cursor-pointer"
            >
              <FadersIcon className="size-4" aria-hidden /> Filtros
              {activeCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-coral-500 text-[0.6875rem] font-bold text-white tabular">
                  {activeCount}
                </span>
              )}
            </button>
            <label className="flex items-center gap-2 text-sm text-graphite-600">
              <span className="hidden sm:inline">Ordenar por</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-[var(--radius-control)] border border-graphite-200 bg-white px-3 py-2 text-sm font-semibold text-graphite-800 cursor-pointer focus:outline-none focus:border-teal-500"
              >
                {sortOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="hidden sm:flex rounded-[var(--radius-control)] border border-graphite-200 bg-white p-0.5" role="group" aria-label="Tipo de vista">
              <button
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
                className={`grid size-8 place-items-center rounded-lg cursor-pointer transition-colors ${view === "list" ? "bg-petrol-900 text-ivory" : "text-graphite-500 hover:text-graphite-800"}`}
                aria-label="Vista lista"
              >
                <ListBulletsIcon className="size-4.5" aria-hidden />
              </button>
              <button
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
                className={`grid size-8 place-items-center rounded-lg cursor-pointer transition-colors ${view === "grid" ? "bg-petrol-900 text-ivory" : "text-graphite-500 hover:text-graphite-800"}`}
                aria-label="Vista grilla"
              >
                <SquaresFourIcon className="size-4.5" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {activeCount > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {[...filters.nights, ...filters.origins, ...filters.regimes, ...filters.transports, ...filters.styles].map((chip) => (
              <span key={chip} className="flex items-center gap-1 rounded-full bg-petrol-50 px-3 py-1 text-xs font-semibold text-petrol-800">
                {nightBuckets.find((b) => b.id === chip)?.label ?? chip}
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      nights: filters.nights.filter((x) => x !== chip),
                      origins: filters.origins.filter((x) => x !== chip),
                      regimes: filters.regimes.filter((x) => x !== chip),
                      transports: filters.transports.filter((x) => x !== chip),
                      styles: filters.styles.filter((x) => x !== chip),
                    })
                  }
                  className="cursor-pointer hover:text-coral-700"
                  aria-label={`Quitar filtro ${chip}`}
                >
                  <XIcon className="size-3" aria-hidden />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Results */}
        {hydrating ? (
          <div className={`mt-6 grid gap-5 ${view === "grid" ? "sm:grid-cols-2" : ""}`}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 rounded-[var(--radius-card)] bg-white p-10 text-center shadow-[var(--shadow-lift)]">
            <h3 className="font-display text-xl font-bold text-petrol-900">
              No hay paquetes que cumplan todos esos filtros{emptyContext ? ` para ${emptyContext}` : ""}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-graphite-600">
              Probá aflojar alguno de los filtros, mirá salidas desde otra ciudad, o contanos qué buscás y lo cotizamos a medida.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                onClick={clearAll}
                className="rounded-[var(--radius-control)] border border-graphite-200 bg-white px-5 py-2.5 text-sm font-semibold text-petrol-900 hover:border-petrol-600 cursor-pointer"
              >
                Limpiar filtros
              </button>
              <ButtonLink href="/viajes-a-medida">Diseñar mi viaje</ButtonLink>
              <ButtonLink href="https://wa.me/5493415550123?text=Hola,%20busqué%20paquetes%20en%20la%20web%20y%20no%20encontré%20lo%20que%20necesito." variant="tertiary" target="_blank">
                Hablar con un asesor
              </ButtonLink>
            </div>
          </div>
        ) : (
          <div className={`mt-6 grid gap-5 ${view === "grid" ? "sm:grid-cols-2" : "grid-cols-1"}`}>
            {filtered.map((pkg) => (
              <div key={pkg.slug} className="relative">
                {view === "grid" ? <PackageCard pkg={pkg} /> : <PackageRow pkg={pkg} />}
                <label
                  className={`absolute z-10 flex cursor-pointer items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur transition-colors ${
                    view === "grid" ? "left-3 bottom-3" : "left-3 bottom-3"
                  } ${compare.includes(pkg.slug) ? "text-teal-600" : "text-graphite-600 hover:text-graphite-800"}`}
                >
                  <input
                    type="checkbox"
                    checked={compare.includes(pkg.slug)}
                    onChange={() => toggleCompare(pkg.slug)}
                    className="size-3.5 accent-teal-600 cursor-pointer"
                  />
                  Comparar
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
          <button className="absolute inset-0 bg-petrol-950/55 cursor-default" onClick={() => setDrawerOpen(false)} aria-label="Cerrar filtros" />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-petrol-900">Filtros</h2>
              <button onClick={() => setDrawerOpen(false)} className="grid size-9 place-items-center rounded-full hover:bg-petrol-50 cursor-pointer" aria-label="Cerrar">
                <XIcon className="size-5" aria-hidden />
              </button>
            </div>
            <FilterPanel filters={filters} setFilters={setFilters} />
            <div className="sticky bottom-0 mt-4 flex gap-3 bg-white pt-2">
              <button onClick={clearAll} className="flex-1 rounded-[var(--radius-control)] border border-graphite-200 py-2.5 text-sm font-semibold text-graphite-800 cursor-pointer">
                Limpiar
              </button>
              <button onClick={() => setDrawerOpen(false)} className="flex-1 rounded-[var(--radius-control)] bg-coral-500 py-2.5 text-sm font-bold text-white cursor-pointer">
                Ver {filtered.length} resultados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare bar */}
      {compare.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-graphite-100 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-3">
            <p className="text-sm text-graphite-600">
              <span className="font-bold text-petrol-900 tabular">{compare.length}</span> de 3 para comparar
            </p>
            <div className="flex gap-2">
              <button onClick={() => setCompare([])} className="rounded-[var(--radius-control)] px-4 py-2 text-sm font-semibold text-graphite-600 hover:bg-graphite-100 cursor-pointer">
                Quitar todos
              </button>
              <button
                onClick={() => setCompareOpen(true)}
                disabled={compare.length < 2}
                className="flex items-center gap-1.5 rounded-[var(--radius-control)] bg-petrol-900 px-5 py-2 text-sm font-semibold text-ivory hover:bg-petrol-800 disabled:opacity-50 cursor-pointer"
              >
                <ScalesIcon className="size-4" aria-hidden /> Comparar
              </button>
            </div>
          </div>
        </div>
      )}

      {compareOpen && <CompareModal slugs={compare} all={packages} onClose={() => setCompareOpen(false)} />}
    </div>
  );
}
