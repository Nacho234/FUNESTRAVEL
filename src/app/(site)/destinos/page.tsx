import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRightIcon, MoonStarsIcon } from "@phosphor-icons/react/dist/ssr";
import { destinations, regions } from "@/data/destinations";
import { formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import type { Destination } from "@/lib/types";

export const metadata: Metadata = {
  title: "Destinos",
  description:
    "Explorá los destinos que trabajamos: Argentina, Brasil, Caribe, Estados Unidos, Europa y destinos exóticos, con precios orientativos por persona.",
};

const regionBySlug: Record<string, (typeof regions)[number]> = {
  argentina: "Argentina",
  brasil: "Brasil",
  caribe: "Caribe",
  "estados-unidos": "Estados Unidos",
  europa: "Europa",
  exoticos: "Exóticos",
};

const slugByRegion = Object.fromEntries(
  Object.entries(regionBySlug).map(([slug, region]) => [region, slug]),
) as Record<string, string>;

function DestinationCard({
  destination,
  featured = false,
}: {
  destination: Destination;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/destinos/${destination.slug}`}
      className={`group relative block overflow-hidden rounded-[var(--radius-card)] ${
        featured ? "min-h-80 sm:min-h-96" : "min-h-64 sm:min-h-72"
      }`}
    >
      <Image
        src={destination.image}
        alt={destination.tagline}
        fill
        sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-petrol-950/85 via-petrol-950/25 to-transparent"
        aria-hidden
      />
      <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
        {destination.trending && <Badge tone="coral">Tendencia</Badge>}
        {destination.idealFor.slice(0, 2).map((style) => (
          <Badge key={style} tone="sand">
            {style}
          </Badge>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/75">{destination.country}</p>
        <h2 className={`font-display font-bold text-white ${featured ? "text-3xl" : "text-2xl"}`}>
          {destination.name}
        </h2>
        <p className={`mt-1 text-white/85 ${featured ? "text-base max-w-lg" : "text-sm line-clamp-1"}`}>
          {destination.tagline}
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/90">
          <span className="flex items-center gap-1.5">
            <MoonStarsIcon className="size-4" aria-hidden />
            {destination.suggestedNights}
          </span>
          <span>
            Desde <span className="font-bold tabular">{formatMoney(destination.priceFrom)}</span> por persona
          </span>
        </p>
      </div>
    </Link>
  );
}

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const { region: regionParam } = await searchParams;
  const activeRegion = regionParam ? regionBySlug[regionParam] : undefined;
  const filtered = activeRegion ? destinations.filter((d) => d.region === activeRegion) : destinations;
  const [first, ...rest] = filtered;

  return (
    <div className="pt-28 lg:pt-32 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-petrol-900">
            Destinos para tu próximo viaje
          </h1>
          <p className="mt-3 max-w-xl text-graphite-600">
            Trabajamos cada destino con operadores y hoteles que conocemos. Los precios son orientativos
            por persona en base doble y varían según fecha y disponibilidad.
          </p>
        </Reveal>

        {/* Region filter as links: shareable URLs, no client state */}
        <nav aria-label="Filtrar por región" className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/destinos"
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              !activeRegion
                ? "bg-petrol-900 text-ivory"
                : "bg-graphite-100 text-graphite-600 hover:bg-petrol-50 hover:text-petrol-800"
            }`}
            aria-current={!activeRegion ? "page" : undefined}
          >
            Todos
          </Link>
          {regions.map((region) => (
            <Link
              key={region}
              href={`/destinos?region=${slugByRegion[region]}`}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                activeRegion === region
                  ? "bg-petrol-900 text-ivory"
                  : "bg-graphite-100 text-graphite-600 hover:bg-petrol-50 hover:text-petrol-800"
              }`}
              aria-current={activeRegion === region ? "page" : undefined}
            >
              {region}
            </Link>
          ))}
        </nav>

        {filtered.length === 0 ? (
          <div className="mt-12 rounded-[var(--radius-card)] bg-white p-10 text-center shadow-[var(--shadow-lift)]">
            <h2 className="font-display text-xl font-bold text-petrol-900">
              Todavía no publicamos destinos en esta región
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-graphite-600">
              Igual los trabajamos a pedido. Contanos qué tenés en mente y armamos una propuesta.
            </p>
            <Link
              href="/viajes-a-medida"
              className="mt-5 inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-600 transition-colors"
            >
              Diseñar mi viaje
              <ArrowRightIcon className="size-4" aria-hidden />
            </Link>
          </div>
        ) : (
          <>
            {/* First destination featured, the rest in a 3-col grid */}
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {first && (
                <div className="lg:col-span-2">
                  <Reveal>
                    <DestinationCard destination={first} featured />
                  </Reveal>
                </div>
              )}
              {rest.slice(0, 1).map((d) => (
                <Reveal key={d.slug} delay={0.06}>
                  <DestinationCard destination={d} featured />
                </Reveal>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(1).map((d, i) => (
                <Reveal key={d.slug} delay={(i % 3) * 0.05}>
                  <DestinationCard destination={d} />
                </Reveal>
              ))}
            </div>
          </>
        )}

        <div className="mt-14 rounded-[var(--radius-card)] bg-sand-100 p-8 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-petrol-900">
              ¿Tu destino no está en la lista?
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-graphite-600">
              Publicamos los destinos con salidas programadas, pero cotizamos cualquier lugar del mundo.
              Japón, Sudáfrica, Australia: si se puede volar, lo armamos.
            </p>
          </div>
          <Link
            href="/viajes-a-medida"
            className="mt-5 sm:mt-0 inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-control)] bg-petrol-900 px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-petrol-800 transition-colors"
          >
            Diseñar mi viaje
            <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
