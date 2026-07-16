"use client";

import { useMemo, useState } from "react";
import {
  AirplaneLandingIcon,
  AirplaneTakeoffIcon,
  ArrowsClockwiseIcon,
  BagIcon,
  CaretDownIcon,
  CheckCircleIcon,
  SuitcaseIcon,
  WhatsappLogoIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import type { FlightOption } from "@/lib/types";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";

type SortKey = "precio" | "duracion" | "salida";

function durationToMinutes(d: string): number {
  const match = d.match(/(\d+)\s*h(?:\s*(\d+)\s*m)?/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2] ?? 0);
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function FlightResults({ flights }: { flights: FlightOption[] }) {
  const [sort, setSort] = useState<SortKey>("precio");
  const [directOnly, setDirectOnly] = useState(false);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const allAirlines = useMemo(
    () => Array.from(new Set(flights.map((f) => f.airline))),
    [flights],
  );

  const results = useMemo(() => {
    let list = flights;
    if (directOnly) list = list.filter((f) => f.stops === 0);
    if (airlines.length > 0) list = list.filter((f) => airlines.includes(f.airline));
    return [...list].sort((a, b) => {
      if (sort === "precio") return a.price.amount - b.price.amount;
      if (sort === "duracion") return durationToMinutes(a.duration) - durationToMinutes(b.duration);
      return timeToMinutes(a.depTime) - timeToMinutes(b.depTime);
    });
  }, [flights, sort, directOnly, airlines]);

  const toggleAirline = (a: string) =>
    setAirlines((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const clearFilters = () => {
    setDirectOnly(false);
    setAirlines([]);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr] items-start">
      {/* Filters */}
      <aside className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-lift)] lg:sticky lg:top-28">
        <h2 className="font-display text-base font-bold text-petrol-900">Filtrar</h2>
        <label className="mt-4 flex items-center gap-2.5 text-sm font-medium text-graphite-700 cursor-pointer">
          <input
            type="checkbox"
            checked={directOnly}
            onChange={(e) => setDirectOnly(e.target.checked)}
            className="size-4 accent-teal-600"
          />
          Solo vuelos directos
        </label>
        <fieldset className="mt-5">
          <legend className="text-xs font-bold uppercase tracking-wide text-graphite-500">Aerolíneas</legend>
          <div className="mt-2.5 space-y-2">
            {allAirlines.map((a) => (
              <label key={a} className="flex items-center gap-2.5 text-sm font-medium text-graphite-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={airlines.includes(a)}
                  onChange={() => toggleAirline(a)}
                  className="size-4 accent-teal-600"
                />
                {a}
              </label>
            ))}
          </div>
        </fieldset>
        {(directOnly || airlines.length > 0) && (
          <button
            onClick={clearFilters}
            className="mt-5 text-sm font-semibold text-teal-600 hover:text-teal-500 cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </aside>

      {/* Results */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-graphite-600">
            <span className="font-bold text-graphite-800 tabular">{results.length}</span>{" "}
            {results.length === 1 ? "opción" : "opciones"} de vuelo
          </p>
          <label className="flex items-center gap-2 text-sm text-graphite-600">
            Ordenar por
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-[var(--radius-control)] border border-graphite-200 bg-white px-3 py-1.5 text-sm font-semibold text-graphite-800 focus:border-teal-500 focus:outline-none cursor-pointer"
            >
              <option value="precio">Menor precio</option>
              <option value="duracion">Menor duración</option>
              <option value="salida">Salida más temprana</option>
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <div className="mt-5 rounded-[var(--radius-card)] bg-white p-10 text-center shadow-[var(--shadow-lift)]">
            <h3 className="font-display text-xl font-bold text-petrol-900">
              Ningún vuelo coincide con los filtros
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-graphite-600">
              Quitá alguno de los filtros para volver a ver las opciones disponibles.
            </p>
            <Button onClick={clearFilters} variant="tertiary" className="mt-5">
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <ul className="mt-5 space-y-4">
            {results.map((f) => {
              const expanded = expandedId === f.id;
              const waText = encodeURIComponent(
                `Hola, quiero emitir el vuelo de ${f.airline} ${f.fromCode} ${f.depTime} a ${f.toCode} ${f.arrTime} (tarifa ${f.fareClass}, ${formatMoney(f.price)} por persona) que vi en la web.`,
              );
              return (
                <li key={f.id}>
                  <article className="overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)]">
                    <div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6">
                      {/* Airline */}
                      <div className="flex items-center gap-3 sm:w-36">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-petrol-50 font-display text-sm font-bold text-petrol-800">
                          {f.airlineCode}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-graphite-800 leading-tight">{f.airline}</p>
                          <p className="text-xs text-graphite-500">{f.fareClass}</p>
                        </div>
                      </div>

                      {/* Times */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-display text-xl font-bold text-petrol-900 tabular">{f.depTime}</p>
                          <p className="text-xs font-semibold text-graphite-500">{f.fromCode}</p>
                        </div>
                        <div className="flex-1 min-w-16 text-center">
                          <p className="text-xs text-graphite-500 tabular">{f.duration}</p>
                          <div className="relative my-1 h-px bg-graphite-200">
                            <span
                              className={`absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                                f.stops === 0 ? "bg-positive-700" : "bg-warning-700"
                              }`}
                              aria-hidden
                            />
                          </div>
                          <p className={`text-xs font-semibold ${f.stops === 0 ? "text-positive-700" : "text-warning-700"}`}>
                            {f.stops === 0 ? "Directo" : `${f.stops} escala`}
                          </p>
                        </div>
                        <div>
                          <p className="font-display text-xl font-bold text-petrol-900 tabular">{f.arrTime}</p>
                          <p className="text-xs font-semibold text-graphite-500">{f.toCode}</p>
                        </div>
                      </div>

                      {/* Price + select */}
                      <div className="flex items-center justify-between gap-4 border-t border-graphite-100 pt-4 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                        <div className="text-right">
                          <p className="font-display text-2xl font-bold text-petrol-900 tabular leading-tight">
                            {formatMoney(f.price)}
                          </p>
                          <p className="text-xs text-graphite-500">por persona, final</p>
                        </div>
                        <button
                          onClick={() => setExpandedId(expanded ? null : f.id)}
                          aria-expanded={expanded}
                          className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-petrol-900 px-4 py-2 text-sm font-semibold text-ivory transition-colors hover:bg-petrol-800 cursor-pointer"
                        >
                          {expanded ? "Ocultar detalle" : "Seleccionar"}
                          <CaretDownIcon
                            className={`size-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
                            aria-hidden
                          />
                        </button>
                      </div>
                    </div>

                    {/* Baggage strip */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-graphite-100 bg-ivory px-5 py-2.5 text-xs text-graphite-600">
                      <span className="flex items-center gap-1.5">
                        <BagIcon className="size-4 text-positive-700" aria-hidden />
                        Equipaje de mano incluido
                      </span>
                      <span className="flex items-center gap-1.5">
                        <SuitcaseIcon
                          className={`size-4 ${f.baggage.checked > 0 ? "text-positive-700" : "text-graphite-400"}`}
                          aria-hidden
                        />
                        {f.baggage.checked > 0 ? `Valija 23 kg x${f.baggage.checked}` : "Sin valija despachada"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {f.refundable ? (
                          <CheckCircleIcon className="size-4 text-positive-700" aria-hidden />
                        ) : (
                          <XCircleIcon className="size-4 text-graphite-400" aria-hidden />
                        )}
                        {f.refundable ? "Reembolsable" : "No reembolsable"}
                      </span>
                    </div>

                    {/* Expanded detail */}
                    {expanded && (
                      <div className="border-t border-graphite-100 bg-white px-5 py-5">
                        <h4 className="font-display text-sm font-bold text-petrol-900">Condiciones de la tarifa</h4>
                        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                          <div className="flex items-start gap-2">
                            <AirplaneTakeoffIcon className="mt-0.5 size-4 shrink-0 text-teal-600" aria-hidden />
                            <div>
                              <dt className="font-semibold text-graphite-800">Salida</dt>
                              <dd className="text-graphite-600">
                                {f.from} ({f.fromCode}) a las {f.depTime}
                              </dd>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <AirplaneLandingIcon className="mt-0.5 size-4 shrink-0 text-teal-600" aria-hidden />
                            <div>
                              <dt className="font-semibold text-graphite-800">Llegada</dt>
                              <dd className="text-graphite-600">
                                {f.to} ({f.toCode}) a las {f.arrTime}
                              </dd>
                            </div>
                          </div>
                          {f.stopDetail && (
                            <div className="flex items-start gap-2 sm:col-span-2">
                              <ArrowsClockwiseIcon className="mt-0.5 size-4 shrink-0 text-warning-700" aria-hidden />
                              <div>
                                <dt className="font-semibold text-graphite-800">Escala</dt>
                                <dd className="text-graphite-600">{f.stopDetail}</dd>
                              </div>
                            </div>
                          )}
                          <div className="flex items-start gap-2 sm:col-span-2">
                            <ArrowsClockwiseIcon className="mt-0.5 size-4 shrink-0 text-teal-600" aria-hidden />
                            <div>
                              <dt className="font-semibold text-graphite-800">Cambios</dt>
                              <dd className="text-graphite-600">{f.changes}</dd>
                            </div>
                          </div>
                        </dl>
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-control)] bg-teal-50 px-4 py-3">
                          <p className="text-sm text-graphite-700 max-w-md">
                            La emisión la hace un asesor: te confirma el precio final al tipo de cambio
                            del día y te envía el ticket por correo.
                          </p>
                          <a
                            href={`https://wa.me/5493415550123?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coral-600"
                          >
                            <WhatsappLogoIcon className="size-4.5" aria-hidden />
                            Quiero emitir este vuelo
                          </a>
                        </div>
                      </div>
                    )}
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
