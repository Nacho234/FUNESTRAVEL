import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  BedIcon,
  CheckIcon,
  ClockIcon,
  InfoIcon,
  MapPinIcon,
  RulerIcon,
  StarIcon,
  SunHorizonIcon,
  UsersIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { getHotel, hotels } from "@/data/hotels";
import { destinations } from "@/data/destinations";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatMoney, plural } from "@/lib/format";

export function generateStaticParams() {
  return hotels.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const h = getHotel(slug);
  if (!h) return { title: "Hotel no encontrado" };
  return {
    title: h.name,
    description: `${h.name}: ${h.description.slice(0, 150)}`,
  };
}

function nightsBetween(a?: string, b?: string): number | null {
  if (!a || !b) return null;
  const from = new Date(a).getTime();
  const to = new Date(b).getTime();
  if (Number.isNaN(from) || Number.isNaN(to)) return null;
  const nights = Math.round((to - from) / 86_400_000);
  return nights > 0 ? nights : null;
}

export default async function HotelDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const h = getHotel(slug);
  if (!h) notFound();

  const dest = destinations.find((d) => d.slug === h.destinationSlug);
  const entrada = typeof sp.entrada === "string" ? sp.entrada : "";
  const salida = typeof sp.salida === "string" ? sp.salida : "";
  const nights = nightsBetween(entrada, salida);

  const gallery = h.gallery.slice(0, 4);

  return (
    <div className="pt-28 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav aria-label="Migas de pan" className="text-sm text-graphite-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/hoteles" className="hover:text-petrol-800">Hoteles</Link>
            </li>
            <li aria-hidden>/</li>
            {dest && (
              <>
                <li>
                  <Link href={`/destinos/${dest.slug}`} className="hover:text-petrol-800">{dest.name}</Link>
                </li>
                <li aria-hidden>/</li>
              </>
            )}
            <li className="font-medium text-graphite-800">{h.name}</li>
          </ol>
        </nav>

        {/* Gallery */}
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:h-[420px]">
          <div className="relative col-span-2 row-span-2 h-64 overflow-hidden rounded-[var(--radius-card)] md:h-auto">
            <Image
              src={gallery[0]}
              alt={`Vista principal de ${h.name}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          {gallery.slice(1).map((img, i) => (
            <div key={img + i} className={`relative h-32 overflow-hidden rounded-[var(--radius-card)] md:h-auto ${i === 2 ? "hidden md:block" : ""}`}>
              <Image
                src={img}
                alt={`${h.name}, imagen ${i + 2}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-0.5" aria-label={`${h.stars} estrellas`}>
                {Array.from({ length: h.stars }).map((_, i) => (
                  <StarIcon key={i} weight="fill" className="size-4 text-warning-700" aria-hidden />
                ))}
              </span>
              <Rating value={h.rating} count={h.reviewsCount} />
            </div>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900">
              {h.name}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-graphite-600">
              <MapPinIcon className="size-4.5 shrink-0 text-graphite-400" aria-hidden />
              {h.address}
            </p>

            <p className="mt-5 leading-relaxed text-graphite-700 max-w-[70ch]">{h.description}</p>

            <section className="mt-8">
              <h2 className="font-display text-xl font-bold text-petrol-900">Servicios del hotel</h2>
              <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {h.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-graphite-700">
                    <CheckIcon weight="bold" className="size-4 shrink-0 text-positive-700" aria-hidden />
                    {a}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="font-display text-xl font-bold text-petrol-900">Ubicación y distancias</h2>
              <dl className="mt-4 divide-y divide-graphite-100 rounded-[var(--radius-card)] border border-graphite-100 bg-white">
                {h.distances.map((d) => (
                  <div key={d.place} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <dt className="text-graphite-600">{d.place}</dt>
                    <dd className="font-semibold text-graphite-800">{d.distance}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <aside>
            <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)] lg:sticky lg:top-28">
              <h2 className="font-display text-lg font-bold text-petrol-900">Horarios y políticas</h2>
              <div className="mt-4 flex gap-6">
                <p className="flex items-center gap-2 text-sm text-graphite-700">
                  <ClockIcon className="size-4.5 text-teal-600" aria-hidden />
                  Check-in {h.checkIn}
                </p>
                <p className="flex items-center gap-2 text-sm text-graphite-700">
                  <SunHorizonIcon className="size-4.5 text-teal-600" aria-hidden />
                  Check-out {h.checkOut}
                </p>
              </div>
              <ul className="mt-4 space-y-2.5">
                {h.policies.map((p) => (
                  <li key={p} className="flex gap-2 text-sm leading-relaxed text-graphite-600">
                    <InfoIcon className="mt-0.5 size-4 shrink-0 text-graphite-400" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
              {nights && (
                <p className="mt-4 rounded-[var(--radius-control)] bg-teal-50 px-3.5 py-2.5 text-sm text-teal-600 font-medium">
                  Tu búsqueda: {plural(nights, "noche", "noches")}, del {formatDate(entrada)} al {formatDate(salida)}
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* Rooms */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold tracking-tight text-petrol-900">
            Habitaciones disponibles
          </h2>
          <p className="mt-1 text-sm text-graphite-600">
            Todas las tarifas son por habitación por noche e incluyen impuestos.
          </p>
          <div className="mt-6 space-y-4">
            {h.rooms.map((room) => {
              const waText = encodeURIComponent(
                `Hola, estoy viendo la habitación ${room.name} del hotel ${h.name}${
                  nights ? ` para ${plural(nights, "noche", "noches")} (${formatDate(entrada)} al ${formatDate(salida)})` : ""
                }. ¿Me confirman disponibilidad y tarifa?`,
              );
              return (
                <article
                  key={room.id}
                  className="grid gap-5 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-lift)] md:grid-cols-[1.5fr_1fr_auto] md:items-center md:p-6"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-petrol-900">{room.name}</h3>
                      {room.available <= 3 && (
                        <Badge tone="warning">
                          {room.available === 1 ? "Queda 1" : `Quedan ${room.available}`}
                        </Badge>
                      )}
                    </div>
                    <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-graphite-600">
                      <li className="flex items-center gap-1.5">
                        <UsersIcon className="size-4 text-graphite-400" aria-hidden />
                        Hasta {plural(room.capacity, "persona", "personas")}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <BedIcon className="size-4 text-graphite-400" aria-hidden />
                        {room.beds}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <RulerIcon className="size-4 text-graphite-400" aria-hidden />
                        {room.sizeM2} m²
                      </li>
                      <li className="flex items-center gap-1.5">
                        <SunHorizonIcon className="size-4 text-graphite-400" aria-hidden />
                        Vista: {room.view}
                      </li>
                    </ul>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {room.amenities.map((a) => (
                        <li key={a} className="rounded-full bg-petrol-50 px-2.5 py-1 text-xs font-medium text-petrol-800">
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-sm space-y-1.5">
                    <p className="text-graphite-700">
                      <span className="font-semibold">Régimen:</span> {room.regime}
                    </p>
                    <p className="text-positive-700 font-medium">{room.cancellation}</p>
                  </div>
                  <div className="flex flex-row items-end justify-between gap-4 border-t border-graphite-100 pt-4 md:flex-col md:items-end md:border-t-0 md:pt-0 md:text-right">
                    <div>
                      <p className="font-display text-2xl font-bold text-petrol-900 tabular leading-tight">
                        {formatMoney(room.pricePerNight)}
                      </p>
                      <p className="text-xs text-graphite-500">por noche</p>
                      {nights && (
                        <p className="mt-1 text-sm font-semibold text-graphite-700 tabular">
                          Total {plural(nights, "noche", "noches")}:{" "}
                          {formatMoney({ amount: room.pricePerNight.amount * nights, currency: room.pricePerNight.currency })}
                        </p>
                      )}
                    </div>
                    <a
                      href={`https://wa.me/5493415550123?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coral-600 whitespace-nowrap"
                    >
                      <WhatsappLogoIcon className="size-4.5" aria-hidden />
                      Consultar por esta habitación
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
