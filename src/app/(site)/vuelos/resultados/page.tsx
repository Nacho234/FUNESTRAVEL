import Link from "next/link";
import type { Metadata } from "next";
import { AirplaneTakeoffIcon } from "@phosphor-icons/react/dist/ssr";
import { flightResults } from "@/data/flights";
import { FlightResults } from "@/components/flights/flight-results";
import { Badge } from "@/components/ui/badge";
import { formatDate, plural } from "@/lib/format";

export const metadata: Metadata = {
  title: "Resultados de vuelos",
  description: "Compará opciones de vuelo por precio, duración, escalas y equipaje incluido.",
};

export default async function FlightResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const origen = typeof sp.origen === "string" && sp.origen ? sp.origen : "Buenos Aires";
  const destino = typeof sp.destino === "string" && sp.destino ? sp.destino : "Río de Janeiro";
  const salida = typeof sp.salida === "string" ? sp.salida : "";
  const regreso = typeof sp.regreso === "string" ? sp.regreso : "";
  const clase = typeof sp.clase === "string" ? sp.clase : "";
  const adultos = Number(typeof sp.adultos === "string" ? sp.adultos : "") || 0;
  const ninos = Number(typeof sp.ninos === "string" ? sp.ninos : "") || 0;
  const totalPax = adultos + ninos;

  const summaryParts = [
    salida ? `Ida ${formatDate(salida)}` : null,
    regreso ? `vuelta ${formatDate(regreso)}` : null,
    totalPax > 0 ? plural(totalPax, "pasajero", "pasajeros") : null,
    clase || null,
  ].filter(Boolean);

  return (
    <div className="pt-28 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Search summary */}
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] bg-white px-5 py-4 shadow-[var(--shadow-lift)]">
          <div>
            <h1 className="flex items-center gap-2.5 font-display text-xl sm:text-2xl font-bold text-petrol-900">
              {origen}
              <AirplaneTakeoffIcon className="size-5 text-teal-600" aria-hidden />
              {destino}
            </h1>
            {summaryParts.length > 0 && (
              <p className="mt-0.5 text-sm text-graphite-600">{summaryParts.join(" · ")}</p>
            )}
          </div>
          <Link
            href="/vuelos"
            className="rounded-[var(--radius-control)] border border-graphite-200 bg-white px-4 py-2 text-sm font-semibold text-petrol-900 transition-colors hover:border-petrol-600 hover:text-petrol-700"
          >
            Modificar búsqueda
          </Link>
        </header>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <Badge tone="neutral">Tarifas de referencia</Badge>
          <p className="text-xs text-graphite-500">
            Inventario de demostración sobre la ruta Buenos Aires · Río de Janeiro. La cotización final
            la confirma un asesor antes de emitir.
          </p>
        </div>

        <div className="mt-6">
          <FlightResults flights={flightResults} />
        </div>
      </div>
    </div>
  );
}
