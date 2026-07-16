import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";
import { hotels } from "@/data/hotels";
import { destinations } from "@/data/destinations";
import { Rating } from "@/components/ui/rating";
import { ButtonLink } from "@/components/ui/button";
import { formatDate, formatMoney, plural } from "@/lib/format";

export const metadata: Metadata = {
  title: "Hoteles y alojamientos",
  description:
    "Hoteles seleccionados por Funes Travel en Argentina, Brasil, Caribe y Europa. Tarifas por noche claras, políticas de cancelación a la vista y asesoramiento real.",
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const destino = typeof sp.destino === "string" ? sp.destino.trim() : "";
  const entrada = typeof sp.entrada === "string" ? sp.entrada : "";
  const salida = typeof sp.salida === "string" ? sp.salida : "";
  const habitaciones = typeof sp.habitaciones === "string" ? sp.habitaciones : "";
  const adultos = typeof sp.adultos === "string" ? sp.adultos : "";

  const hasSearch = Boolean(destino || entrada || salida);

  let results = hotels;
  if (destino) {
    const q = normalize(destino);
    const matchedSlugs = destinations
      .filter((d) => normalize(`${d.name} ${d.country}`).includes(q))
      .map((d) => d.slug);
    results = hotels.filter(
      (h) => matchedSlugs.includes(h.destinationSlug) || normalize(h.name).includes(q),
    );
  }

  const summaryParts = [
    destino || null,
    entrada && salida ? `${formatDate(entrada)} al ${formatDate(salida)}` : null,
    habitaciones ? plural(Number(habitaciones), "habitación", "habitaciones") : null,
    adultos ? plural(Number(adultos), "adulto", "adultos") : null,
  ].filter(Boolean);

  return (
    <div className="pt-28 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900">
            Hoteles seleccionados, sin sorpresas al llegar
          </h1>
          <p className="mt-2 text-graphite-600">
            Trabajamos solo con alojamientos que conocemos o que auditó nuestro operador. Cada tarifa
            aclara régimen, cancelación y qué incluye.
          </p>
        </header>

        {hasSearch && (
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[var(--radius-card)] bg-white px-5 py-3.5 shadow-[var(--shadow-lift)] text-sm">
            <MagnifyingGlassIcon className="size-4.5 text-teal-600" aria-hidden />
            <span className="font-semibold text-graphite-800">Tu búsqueda:</span>
            <span className="text-graphite-600">{summaryParts.join(" · ")}</span>
            <Link href="/" className="ml-auto font-semibold text-teal-600 hover:text-teal-500">
              Modificar búsqueda
            </Link>
          </div>
        )}

        <p className="mt-6 text-sm text-graphite-500">
          {plural(results.length, "alojamiento encontrado", "alojamientos encontrados")}
        </p>

        {results.length === 0 ? (
          <div className="mt-6 rounded-[var(--radius-card)] bg-white p-10 text-center shadow-[var(--shadow-lift)]">
            <h2 className="font-display text-xl font-bold text-petrol-900">
              No tenemos hoteles cargados para “{destino}”
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-graphite-600">
              Nuestro catálogo online muestra una selección: trabajamos con muchos más alojamientos a
              través de nuestros operadores. Contanos qué buscás y te cotizamos en el día.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/hoteles" variant="tertiary">
                Ver todos los hoteles
              </ButtonLink>
              <ButtonLink href="/viajes-a-medida">Pedir cotización</ButtonLink>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-5">
            {results.map((h) => {
              const dest = destinations.find((d) => d.slug === h.destinationSlug);
              const minNight = Math.min(...h.rooms.map((r) => r.pricePerNight.amount));
              const currency = h.rooms[0].pricePerNight.currency;
              const shownAmenities = h.amenities.slice(0, 4);
              const extraAmenities = h.amenities.length - shownAmenities.length;
              return (
                <article
                  key={h.slug}
                  className="group relative grid overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)] transition-shadow hover:shadow-[var(--shadow-float)] md:grid-cols-[300px_1fr_auto]"
                >
                  <div className="relative h-52 md:h-full md:min-h-56">
                    <Image
                      src={h.image}
                      alt={`${h.name}, ${dest?.name ?? ""}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5" aria-label={`${h.stars} estrellas`}>
                        {Array.from({ length: h.stars }).map((_, i) => (
                          <StarIcon key={i} weight="fill" className="size-3.5 text-warning-700" aria-hidden />
                        ))}
                      </span>
                      <Rating value={h.rating} count={h.reviewsCount} />
                    </div>
                    <h2 className="mt-1.5 font-display text-xl font-bold text-petrol-900">
                      <Link href={`/hoteles/${h.slug}`} className="after:absolute after:inset-0">
                        {h.name}
                      </Link>
                    </h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-graphite-600">
                      <MapPinIcon className="size-4 shrink-0 text-graphite-400" aria-hidden />
                      {h.address}
                    </p>
                    <p className="mt-2 text-sm text-graphite-600 line-clamp-2 max-w-xl">{h.description}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {shownAmenities.map((a) => (
                        <li key={a} className="rounded-full bg-petrol-50 px-2.5 py-1 text-xs font-medium text-petrol-800">
                          {a}
                        </li>
                      ))}
                      {extraAmenities > 0 && (
                        <li className="rounded-full bg-graphite-100 px-2.5 py-1 text-xs font-medium text-graphite-600">
                          +{extraAmenities} más
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="flex flex-row items-end justify-between gap-3 border-t border-graphite-100 p-5 md:flex-col md:items-end md:border-t-0 md:border-l md:p-6 md:text-right">
                    <div>
                      <p className="text-xs text-graphite-500">Habitaciones desde</p>
                      <p className="font-display text-2xl font-bold text-petrol-900 tabular leading-tight">
                        {formatMoney({ amount: minNight, currency })}
                      </p>
                      <p className="text-xs text-graphite-500">por noche · impuestos incluidos</p>
                    </div>
                    <span className="relative z-10 pointer-events-none inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-petrol-900 px-4 py-2 text-sm font-semibold text-ivory transition-colors group-hover:bg-petrol-800">
                      Ver habitaciones
                      <ArrowRightIcon className="size-4" aria-hidden />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
