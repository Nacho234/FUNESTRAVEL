"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AirplaneTakeoffIcon,
  ArrowsLeftRightIcon,
  BedIcon,
  CompassIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PackageIcon,
  PlusIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { destinations } from "@/data/destinations";

type Tab = "paquetes" | "vuelos" | "hoteles" | "excursiones";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "paquetes", label: "Paquetes", icon: <PackageIcon className="size-4.5" aria-hidden /> },
  { id: "vuelos", label: "Vuelos", icon: <AirplaneTakeoffIcon className="size-4.5" aria-hidden /> },
  { id: "hoteles", label: "Hoteles", icon: <BedIcon className="size-4.5" aria-hidden /> },
  { id: "excursiones", label: "Excursiones", icon: <CompassIcon className="size-4.5" aria-hidden /> },
];

const origins = ["Rosario", "Buenos Aires", "Córdoba"];

function labelClass() {
  return "text-[0.6875rem] font-bold uppercase tracking-wide text-graphite-500";
}
function inputClass() {
  return "w-full bg-transparent text-[0.9375rem] font-semibold text-graphite-800 placeholder:font-normal placeholder:text-graphite-400 focus:outline-none";
}

/** Destination text input with suggestions from the catalog. */
function DestinationInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    const pool = q.length === 0 ? destinations.filter((d) => d.trending) : destinations.filter((d) => `${d.name} ${d.country}`.toLowerCase().includes(q));
    return pool.slice(0, 5);
  }, [value]);

  return (
    <div ref={wrapRef} className="relative">
      <label htmlFor={id} className={labelClass()}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        placeholder={placeholder}
        autoComplete="off"
        className={inputClass()}
        aria-invalid={error || undefined}
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-xl border border-graphite-100 bg-white py-1 shadow-[var(--shadow-float)]">
          {value.trim() === "" && (
            <li className="px-3 pb-1 pt-2 text-[0.6875rem] font-bold uppercase tracking-wide text-graphite-400">
              Destinos recomendados
            </li>
          )}
          {suggestions.map((d) => (
            <li key={d.slug}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(d.name);
                  setOpen(false);
                }}
                className="flex w-full items-baseline justify-between gap-2 px-3 py-2 text-left hover:bg-petrol-50 cursor-pointer"
              >
                <span className="text-sm font-semibold text-graphite-800">{d.name}</span>
                <span className="text-xs text-graphite-500">{d.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Adults / children / infants stepper inside a popover. */
function TravelersPopover({
  adults,
  childrenCount,
  infants,
  setAdults,
  setChildren,
  setInfants,
}: {
  adults: number;
  childrenCount: number;
  infants: number;
  setAdults: (n: number) => void;
  setChildren: (n: number) => void;
  setInfants: (n: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const total = adults + childrenCount + infants;

  const rows = [
    { label: "Adultos", hint: "Desde 12 años", value: adults, set: setAdults, min: 1, max: 8 },
    { label: "Niños", hint: "De 2 a 11 años", value: childrenCount, set: setChildren, min: 0, max: 6 },
    { label: "Bebés", hint: "Menores de 2 años", value: infants, set: setInfants, min: 0, max: 3 },
  ];

  return (
    <div className="relative">
      <span className={labelClass()}>Viajeros</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-1.5 text-[0.9375rem] font-semibold text-graphite-800 cursor-pointer"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <UsersIcon className="size-4 text-graphite-500" aria-hidden />
        {total} {total === 1 ? "viajero" : "viajeros"}
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-20 cursor-default"
            aria-label="Cerrar selector de viajeros"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-xl border border-graphite-100 bg-white p-4 shadow-[var(--shadow-float)]" role="dialog" aria-label="Cantidad de viajeros">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-graphite-800">{row.label}</p>
                  <p className="text-xs text-graphite-500">{row.hint}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => row.set(Math.max(row.min, row.value - 1))}
                    disabled={row.value <= row.min}
                    className="grid size-8 place-items-center rounded-full border border-graphite-200 text-graphite-600 hover:border-teal-500 hover:text-teal-600 disabled:opacity-35 cursor-pointer transition-colors"
                    aria-label={`Quitar ${row.label.toLowerCase()}`}
                  >
                    <MinusIcon className="size-3.5" aria-hidden />
                  </button>
                  <span className="w-5 text-center text-sm font-bold tabular">{row.value}</span>
                  <button
                    type="button"
                    onClick={() => row.set(Math.min(row.max, row.value + 1))}
                    disabled={row.value >= row.max}
                    className="grid size-8 place-items-center rounded-full border border-graphite-200 text-graphite-600 hover:border-teal-500 hover:text-teal-600 disabled:opacity-35 cursor-pointer transition-colors"
                    aria-label={`Agregar ${row.label.toLowerCase()}`}
                  >
                    <PlusIcon className="size-3.5" aria-hidden />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 w-full rounded-[var(--radius-control)] bg-petrol-900 py-2 text-sm font-semibold text-ivory hover:bg-petrol-800 cursor-pointer"
            >
              Listo
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Cell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-col justify-center gap-0.5 px-4 py-3 ${className}`}>{children}</div>;
}

export function SearchWidget({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("paquetes");
  const [loading, setLoading] = useState(false);
  // Set after mount: computing it during SSR would freeze the build date and
  // mismatch the client's day.
  const [today, setToday] = useState<string>();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- date is client-environment data
    setToday(new Date().toISOString().slice(0, 10));
  }, []);
  const [error, setError] = useState("");

  // Shared fields
  const [origin, setOrigin] = useState("Rosario");
  const [destination, setDestination] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [nights, setNights] = useState("7");
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [tripKind, setTripKind] = useState("");
  const [flightMode, setFlightMode] = useState<"ida-vuelta" | "solo-ida" | "multidestino">("ida-vuelta");
  const [cabin, setCabin] = useState("Economy");
  const [rooms, setRooms] = useState("1");
  const [excursionCategory, setExcursionCategory] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (tab !== "vuelos" && destination.trim() === "") {
      setError("Contanos a dónde querés viajar para poder buscar.");
      return;
    }
    if (tab === "vuelos" && (destination.trim() === "" || origin.trim() === "")) {
      setError("Elegí origen y destino para buscar vuelos.");
      return;
    }

    setLoading(true);
    const pax = `adultos=${adults}&ninos=${childrenCount}&bebes=${infants}`;
    const dest = encodeURIComponent(destination.trim());

    // Persist to the recent-search history used by the global search
    try {
      const raw = JSON.parse(window.localStorage.getItem("ft-recent-searches") ?? "[]") as string[];
      window.localStorage.setItem(
        "ft-recent-searches",
        JSON.stringify([destination.trim(), ...raw.filter((r) => r !== destination.trim())].slice(0, 5)),
      );
    } catch {
      // best-effort
    }

    switch (tab) {
      case "paquetes":
        router.push(
          `/paquetes?destino=${dest}&origen=${encodeURIComponent(origin)}&fecha=${dateFrom}&noches=${nights}&${pax}${tripKind ? `&estilo=${encodeURIComponent(tripKind)}` : ""}`,
        );
        break;
      case "vuelos":
        router.push(
          `/vuelos/resultados?origen=${encodeURIComponent(origin)}&destino=${dest}&salida=${dateFrom}&regreso=${flightMode === "ida-vuelta" ? dateTo : ""}&modo=${flightMode}&clase=${encodeURIComponent(cabin)}&${pax}`,
        );
        break;
      case "hoteles":
        router.push(`/hoteles?destino=${dest}&entrada=${dateFrom}&salida=${dateTo}&habitaciones=${rooms}&${pax}`);
        break;
      case "excursiones":
        router.push(`/excursiones?destino=${dest}&fecha=${dateFrom}${excursionCategory ? `&categoria=${encodeURIComponent(excursionCategory)}` : ""}&personas=${adults + childrenCount}`);
        break;
    }
  };

  const gridCols =
    tab === "paquetes"
      ? "lg:grid-cols-[1fr_1.2fr_1fr_0.8fr_1fr_auto]"
      : tab === "vuelos"
        ? "lg:grid-cols-[1.1fr_1.1fr_1fr_1fr_1fr_auto]"
        : tab === "hoteles"
          ? "lg:grid-cols-[1.4fr_1fr_1fr_0.8fr_1fr_auto]"
          : "lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]";

  return (
    <div className={compact ? "" : "w-full"}>
      {/* Tabs */}
      <div role="tablist" aria-label="Tipo de búsqueda" className="flex gap-1 rounded-t-2xl bg-petrol-950/40 p-1.5 backdrop-blur-sm w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => {
              setTab(t.id);
              setError("");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors cursor-pointer ${
              tab === t.id ? "bg-white text-petrol-900" : "text-white/85 hover:bg-white/10"
            }`}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.label.slice(0, 4)}.</span>
          </button>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="rounded-b-2xl rounded-tr-2xl bg-white shadow-[var(--shadow-float)]"
        aria-label={`Buscador de ${tab}`}
      >
        {tab === "vuelos" && (
          <div className="flex gap-4 border-b border-graphite-100 px-4 pt-3 pb-2 text-sm">
            {(["ida-vuelta", "solo-ida", "multidestino"] as const).map((m) => (
              <label key={m} className="flex items-center gap-1.5 cursor-pointer font-medium text-graphite-600 has-checked:text-petrol-900 has-checked:font-semibold">
                <input
                  type="radio"
                  name="flight-mode"
                  checked={flightMode === m}
                  onChange={() => setFlightMode(m)}
                  className="accent-teal-600"
                />
                {m === "ida-vuelta" ? "Ida y vuelta" : m === "solo-ida" ? "Solo ida" : "Multidestino"}
              </label>
            ))}
          </div>
        )}

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} lg:divide-x divide-y lg:divide-y-0 divide-graphite-100`}>
          {/* Column 1 */}
          {tab === "paquetes" || tab === "vuelos" ? (
            <Cell className="relative">
              <label htmlFor="sw-origin" className={labelClass()}>
                Origen
              </label>
              <div className="flex items-center gap-2">
                <select
                  id="sw-origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-transparent text-[0.9375rem] font-semibold text-graphite-800 focus:outline-none cursor-pointer"
                >
                  {origins.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                {tab === "vuelos" && (
                  <button
                    type="button"
                    onClick={() => {
                      const d = destination;
                      setDestination(origin);
                      setOrigin(origins.includes(d) ? d : origin);
                    }}
                    className="grid size-7 shrink-0 place-items-center rounded-full border border-graphite-200 text-graphite-500 hover:text-teal-600 hover:border-teal-500 cursor-pointer transition-colors"
                    aria-label="Intercambiar origen y destino"
                  >
                    <ArrowsLeftRightIcon className="size-3.5" aria-hidden />
                  </button>
                )}
              </div>
            </Cell>
          ) : null}

          {/* Destination */}
          <Cell>
            <DestinationInput
              id="sw-destination"
              label="Destino"
              value={destination}
              onChange={setDestination}
              placeholder="¿A dónde querés ir?"
              error={!!error}
            />
          </Cell>

          {/* Dates */}
          <Cell>
            <label htmlFor="sw-date-from" className={labelClass()}>
              {tab === "hoteles" ? "Entrada" : tab === "vuelos" ? "Ida" : "Fecha estimada"}
            </label>
            <input
              id="sw-date-from"
              type="date"
              min={today}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={`${inputClass()} cursor-pointer`}
            />
          </Cell>

          {(tab === "vuelos" && flightMode === "ida-vuelta") || tab === "hoteles" ? (
            <Cell>
              <label htmlFor="sw-date-to" className={labelClass()}>
                {tab === "hoteles" ? "Salida" : "Regreso"}
              </label>
              <input
                id="sw-date-to"
                type="date"
                min={dateFrom || today}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={`${inputClass()} cursor-pointer`}
              />
            </Cell>
          ) : tab === "paquetes" ? (
            <Cell>
              <label htmlFor="sw-nights" className={labelClass()}>
                Noches
              </label>
              <select
                id="sw-nights"
                value={nights}
                onChange={(e) => setNights(e.target.value)}
                className="w-full bg-transparent text-[0.9375rem] font-semibold text-graphite-800 focus:outline-none cursor-pointer"
              >
                {["3", "4", "5", "7", "10", "14"].map((n) => (
                  <option key={n} value={n}>
                    {n}+ noches
                  </option>
                ))}
              </select>
            </Cell>
          ) : tab === "excursiones" ? (
            <Cell>
              <label htmlFor="sw-exc-cat" className={labelClass()}>
                Categoría
              </label>
              <select
                id="sw-exc-cat"
                value={excursionCategory}
                onChange={(e) => setExcursionCategory(e.target.value)}
                className="w-full bg-transparent text-[0.9375rem] font-semibold text-graphite-800 focus:outline-none cursor-pointer"
              >
                <option value="">Todas</option>
                {["Naturaleza", "Cultura", "Aventura", "Gastronomía", "Náutica"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Cell>
          ) : tab === "vuelos" && flightMode !== "ida-vuelta" ? (
            <Cell>
              <label htmlFor="sw-cabin" className={labelClass()}>
                Clase
              </label>
              <select id="sw-cabin" value={cabin} onChange={(e) => setCabin(e.target.value)} className="w-full bg-transparent text-[0.9375rem] font-semibold text-graphite-800 focus:outline-none cursor-pointer">
                {["Economy", "Premium Economy", "Business"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Cell>
          ) : null}

          {/* Travelers / rooms */}
          {tab === "hoteles" ? (
            <Cell>
              <label htmlFor="sw-rooms" className={labelClass()}>
                Habitaciones
              </label>
              <select
                id="sw-rooms"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full bg-transparent text-[0.9375rem] font-semibold text-graphite-800 focus:outline-none cursor-pointer"
              >
                {["1", "2", "3"].map((r) => (
                  <option key={r} value={r}>
                    {r} {r === "1" ? "habitación" : "habitaciones"}
                  </option>
                ))}
              </select>
            </Cell>
          ) : null}

          <Cell>
            <TravelersPopover
              adults={adults}
              childrenCount={childrenCount}
              infants={infants}
              setAdults={setAdults}
              setChildren={setChildren}
              setInfants={setInfants}
            />
          </Cell>

          {/* Trip kind (packages) / cabin (round-trip flights) */}
          {tab === "paquetes" && (
            <Cell>
              <label htmlFor="sw-kind" className={labelClass()}>
                Tipo de viaje
              </label>
              <select
                id="sw-kind"
                value={tripKind}
                onChange={(e) => setTripKind(e.target.value)}
                className="w-full bg-transparent text-[0.9375rem] font-semibold text-graphite-800 focus:outline-none cursor-pointer"
              >
                <option value="">Cualquiera</option>
                {["Playa", "Nieve", "Aventura", "Familia", "Pareja", "Luna de miel", "Cultura", "Gastronomía", "Escapadas"].map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </Cell>
          )}
          {tab === "vuelos" && flightMode === "ida-vuelta" && (
            <Cell>
              <label htmlFor="sw-cabin2" className={labelClass()}>
                Clase
              </label>
              <select id="sw-cabin2" value={cabin} onChange={(e) => setCabin(e.target.value)} className="w-full bg-transparent text-[0.9375rem] font-semibold text-graphite-800 focus:outline-none cursor-pointer">
                {["Economy", "Premium Economy", "Business"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Cell>
          )}

          {/* Submit */}
          <div className="flex items-stretch p-2.5 sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-coral-500 px-6 text-[0.9375rem] font-bold text-white transition-colors hover:bg-coral-600 cursor-pointer disabled:opacity-70 min-h-12"
            >
              {loading ? (
                <svg className="animate-spin size-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                <MagnifyingGlassIcon weight="bold" className="size-5" aria-hidden />
              )}
              Buscar
            </button>
          </div>
        </div>

        {error && (
          <p className="px-4 pb-3 text-sm font-medium text-danger-700" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
