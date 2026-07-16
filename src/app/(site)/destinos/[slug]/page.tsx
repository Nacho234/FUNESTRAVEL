import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRightIcon,
  CalendarBlankIcon,
  CheckCircleIcon,
  ClockIcon,
  CompassIcon,
  HeartIcon,
  MoonStarsIcon,
} from "@phosphor-icons/react/dist/ssr";
import { destinations, getDestination } from "@/data/destinations";
import { packagesByDestination } from "@/data/packages";
import { excursionsByDestination } from "@/data/excursions";
import { formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { PackageCard } from "@/components/cards/package-card";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) return { title: "Destino no encontrado" };
  return {
    title: `${destination.name} · Viajes y paquetes`,
    description: `${destination.tagline}. ${destination.description.slice(0, 140)}`,
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) notFound();

  const packages = packagesByDestination(destination.slug);
  const excursions = excursionsByDestination(destination.slug);

  return (
    <div className="pb-16 lg:pb-24">
      {/* Hero */}
      <section className="relative min-h-[60dvh] flex items-end">
        <Image
          src={destination.image}
          alt={destination.tagline}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-petrol-950/85 via-petrol-950/30 to-petrol-950/40"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 pb-10 pt-40">
          <nav aria-label="Ubicación" className="text-sm text-white/75">
            <Link href="/destinos" className="hover:text-white underline-offset-4 hover:underline">
              Destinos
            </Link>
            <span aria-hidden> / </span>
            <span className="text-white/90">{destination.region}</span>
          </nav>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            {destination.name}
          </h1>
          <p className="mt-2 max-w-xl text-lg text-white/90">{destination.tagline}</p>
        </div>
      </section>

      {/* Description + practical data */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-petrol-900">
                Por qué viajar a {destination.name}
              </h2>
              <p className="mt-4 max-w-[70ch] text-lg leading-relaxed text-graphite-600">
                {destination.description}
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {destination.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2.5 text-graphite-700">
                    <CheckCircleIcon
                      weight="fill"
                      className="mt-0.5 size-5 shrink-0 text-teal-500"
                      aria-hidden
                    />
                    <span className="font-medium">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)] lg:sticky lg:top-28">
              <h2 className="font-display text-lg font-bold text-petrol-900">Datos prácticos</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <CalendarBlankIcon className="mt-0.5 size-5 shrink-0 text-teal-600" aria-hidden />
                  <div>
                    <dt className="font-semibold text-graphite-800">Mejor época</dt>
                    <dd className="mt-0.5 text-graphite-600">{destination.season}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MoonStarsIcon className="mt-0.5 size-5 shrink-0 text-teal-600" aria-hidden />
                  <div>
                    <dt className="font-semibold text-graphite-800">Estadía recomendada</dt>
                    <dd className="mt-0.5 text-graphite-600">{destination.suggestedNights}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HeartIcon className="mt-0.5 size-5 shrink-0 text-teal-600" aria-hidden />
                  <div>
                    <dt className="font-semibold text-graphite-800">Ideal para</dt>
                    <dd className="mt-1.5 flex flex-wrap gap-1.5">
                      {destination.idealFor.map((style) => (
                        <Badge key={style} tone="teal">
                          {style}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                </div>
              </dl>
              <div className="mt-5 border-t border-graphite-100 pt-4">
                <p className="text-xs text-graphite-500">Viajes desde</p>
                <p className="font-display text-2xl font-bold text-petrol-900 tabular">
                  {formatMoney(destination.priceFrom)}
                  <span className="font-sans text-sm font-normal text-graphite-500"> por persona</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Packages */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
        <Reveal>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-petrol-900">
            Paquetes a {destination.name}
          </h2>
        </Reveal>
        {packages.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.slug} delay={(i % 3) * 0.05}>
                <PackageCard pkg={pkg} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[var(--radius-card)] bg-sand-100 p-8 sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div>
              <h3 className="font-display text-xl font-bold text-petrol-900">
                No hay salidas programadas en este momento
              </h3>
              <p className="mt-1.5 max-w-xl text-sm text-graphite-600">
                Armamos viajes a {destination.name} a pedido, con vuelos, alojamiento y experiencias
                elegidas para tu fecha. Pedinos una propuesta sin compromiso.
              </p>
            </div>
            <ButtonLink href="/viajes-a-medida" className="mt-4 sm:mt-0 shrink-0">
              Diseñar mi viaje
            </ButtonLink>
          </div>
        )}
      </section>

      {/* Excursions */}
      {excursions.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 lg:pt-16">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-petrol-900">
                Excursiones en {destination.name}
              </h2>
              <Link
                href="/excursiones"
                className="group flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-500"
              >
                Ver todas las excursiones
                <ArrowRightIcon
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </Reveal>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {excursions.map((excursion, i) => (
              <Reveal key={excursion.slug} delay={(i % 3) * 0.05}>
                <Link
                  href={`/excursiones/${excursion.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)] transition-shadow hover:shadow-[var(--shadow-float)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={excursion.image}
                      alt={excursion.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <Badge tone="teal" className="absolute left-3 top-3">
                      {excursion.category}
                    </Badge>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-bold leading-snug text-petrol-900 group-hover:text-petrol-700 transition-colors">
                        {excursion.name}
                      </h3>
                      <Rating value={excursion.rating} />
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-graphite-600">
                      <ClockIcon className="size-4 text-graphite-400" aria-hidden />
                      {excursion.duration}
                      <span aria-hidden>·</span>
                      <CompassIcon className="size-4 text-graphite-400" aria-hidden />
                      Dificultad {excursion.difficulty.toLowerCase()}
                    </p>
                    <p className="mt-auto pt-4 text-sm text-graphite-500">
                      Desde{" "}
                      <span className="font-display text-lg font-bold text-petrol-900 tabular">
                        {formatMoney(excursion.price)}
                      </span>{" "}
                      por persona
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
