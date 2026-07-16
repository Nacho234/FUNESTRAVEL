import type { Metadata } from "next";
import Link from "next/link";
import { PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { packages } from "@/data/packages";
import { destinations } from "@/data/destinations";
import { PackageResults } from "@/components/packages/package-results";

export const metadata: Metadata = {
  title: "Paquetes de viaje",
  description:
    "Paquetes a Caribe, Brasil, Europa y Argentina con aéreo, hotel y asistencia incluidos. Filtrá por precio, duración, régimen y forma de pago.",
};

function norm(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const destinoParam = typeof sp.destino === "string" ? sp.destino : "";
  const estiloParam = typeof sp.estilo === "string" ? sp.estilo : "";
  const origenParam = typeof sp.origen === "string" ? sp.origen : "";
  const viajeros =
    (Number(sp.adultos) || 0) + (Number(sp.ninos) || 0) + (Number(sp.bebes) || 0);

  // Resolve the free-text destination against the catalog
  const matchedDestination = destinoParam
    ? destinations.find(
        (d) =>
          norm(d.name).includes(norm(destinoParam)) ||
          norm(destinoParam).includes(norm(d.name)) ||
          norm(d.country) === norm(destinoParam) ||
          norm(d.region) === norm(destinoParam),
      )
    : undefined;

  const list = destinoParam
    ? packages.filter((p) => {
        if (matchedDestination) return p.destinationSlug === matchedDestination.slug;
        const hay = norm(`${p.name} ${p.cities.join(" ")} ${p.destinationSlug}`);
        return hay.includes(norm(destinoParam));
      })
    : packages;

  const hasSearch = Boolean(destinoParam || estiloParam || origenParam);

  return (
    <div>
      {/* Search summary header */}
      <div className="border-b border-graphite-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <nav aria-label="Miga de pan" className="text-xs text-graphite-500">
            <ol className="flex gap-1.5">
              <li>
                <Link href="/" className="hover:text-petrol-800">Inicio</Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-semibold text-graphite-800">Paquetes</li>
            </ol>
          </nav>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-petrol-900">
                {matchedDestination
                  ? `Paquetes a ${matchedDestination.name}`
                  : destinoParam
                    ? `Paquetes: “${destinoParam}”`
                    : estiloParam
                      ? `Viajes de ${estiloParam.toLowerCase()}`
                      : "Todos nuestros paquetes"}
              </h1>
              {hasSearch && (
                <p className="mt-1 text-sm text-graphite-600">
                  {[
                    origenParam && `Salida desde ${origenParam}`,
                    typeof sp.fecha === "string" && sp.fecha && `a partir del ${sp.fecha.split("-").reverse().join("/")}`,
                    viajeros > 0 && `${viajeros} ${viajeros === 1 ? "viajero" : "viajeros"}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-[var(--radius-control)] border border-graphite-200 bg-white px-4 py-2 text-sm font-semibold text-petrol-900 hover:border-petrol-600 transition-colors"
            >
              <PencilSimpleIcon className="size-4" aria-hidden /> Modificar búsqueda
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 pb-24">
        <PackageResults
          packages={list}
          initialStyle={estiloParam || undefined}
          emptyContext={matchedDestination?.name ?? (destinoParam || undefined)}
        />
      </div>
    </div>
  );
}
