import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  AirplaneTiltIcon,
  BedIcon,
  BusIcon,
  CheckIcon,
  FirstAidIcon,
  ForkKnifeIcon,
  IdentificationCardIcon,
  MapPinIcon,
  MoonStarsIcon,
  ShieldCheckIcon,
  UsersIcon,
  VanIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { getPackage, packages } from "@/data/packages";
import { getDestination } from "@/data/destinations";
import { testimonials } from "@/data/content";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { AccordionItem } from "@/components/ui/accordion";
import { PackageCard } from "@/components/cards/package-card";
import { FavoriteButton } from "@/components/cards/favorite-button";
import { PackageGallery } from "@/components/packages/package-gallery";
import { BookingPanel } from "@/components/packages/booking-panel";

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return {};
  return {
    title: `${pkg.name} · ${pkg.nights} noches`,
    description: pkg.summary,
    openGraph: { images: [pkg.image] },
  };
}

const summaryIcons = [
  { key: "flight", icon: AirplaneTiltIcon, label: (p: NonNullable<ReturnType<typeof getPackage>>) => (p.transport === "Bus" ? null : `Vuelos desde ${p.departureCity}`) },
  { key: "bus", icon: BusIcon, label: (p: NonNullable<ReturnType<typeof getPackage>>) => (p.transport === "Bus" ? `Bus desde ${p.departureCity}` : null) },
  { key: "hotel", icon: BedIcon, label: (p: NonNullable<ReturnType<typeof getPackage>>) => `${p.hotelName} (${p.hotelStars}★)` },
  { key: "regime", icon: ForkKnifeIcon, label: (p: NonNullable<ReturnType<typeof getPackage>>) => p.regime },
  { key: "transfer", icon: VanIcon, label: (p: NonNullable<ReturnType<typeof getPackage>>) => (p.hasTransfers ? "Traslados incluidos" : null) },
  { key: "insurance", icon: FirstAidIcon, label: (p: NonNullable<ReturnType<typeof getPackage>>) => (p.hasInsurance ? "Asistencia al viajero" : null) },
  { key: "nights", icon: MoonStarsIcon, label: (p: NonNullable<ReturnType<typeof getPackage>>) => `${p.nights} noches` },
];

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  const destination = getDestination(pkg.destinationSlug);
  const similar = packages.filter((p) => p.slug !== pkg.slug && (p.destinationSlug === pkg.destinationSlug || p.travelStyles.some((s) => pkg.travelStyles.includes(s)))).slice(0, 3);
  const reviews = testimonials.filter((t) => destination && t.destination.toLowerCase().includes(destination.name.split(" ")[0].toLowerCase()));

  return (
    <div className="pb-24 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        {/* Breadcrumb */}
        <nav aria-label="Miga de pan" className="text-xs text-graphite-500">
          <ol className="flex flex-wrap gap-1.5">
            <li><Link href="/" className="hover:text-petrol-800">Inicio</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/paquetes" className="hover:text-petrol-800">Paquetes</Link></li>
            {destination && (
              <>
                <li aria-hidden>/</li>
                <li><Link href={`/destinos/${destination.slug}`} className="hover:text-petrol-800">{destination.name}</Link></li>
              </>
            )}
            <li aria-hidden>/</li>
            <li className="font-semibold text-graphite-800">{pkg.name}</li>
          </ol>
        </nav>

        {/* Title row */}
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900">{pkg.name}</h1>
              {pkg.promo && <Badge tone="coral">{pkg.promo.label}</Badge>}
              {pkg.departures.some((d) => d.confirmed) && <Badge tone="positive">Salidas confirmadas</Badge>}
            </div>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-graphite-600">
              <span className="flex items-center gap-1">
                <MapPinIcon className="size-4 text-teal-600" aria-hidden />
                {pkg.cities.join(" · ")}
              </span>
              <Rating value={pkg.rating} count={pkg.reviewsCount} />
              <span>{pkg.nights} noches · salida desde {pkg.departureCity}</span>
            </p>
          </div>
          <FavoriteButton itemKey={`pkg:${pkg.slug}`} className="!bg-white shadow-[var(--shadow-lift)]" />
        </div>

        {/* Gallery */}
        <div className="mt-5">
          <PackageGallery images={pkg.gallery} alt={`${pkg.name}: ${pkg.cities.join(", ")}`} />
        </div>

        {/* Body: content + booking panel */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="min-w-0">
            {/* Quick summary */}
            <section aria-label="Resumen del paquete" className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-lift)]">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 text-sm text-graphite-700">
                {summaryIcons.map(({ key, icon: Icon, label }) => {
                  const text = label(pkg);
                  if (!text) return null;
                  return (
                    <li key={key} className="flex items-center gap-2">
                      <Icon className="size-5 shrink-0 text-teal-600" aria-hidden />
                      {text}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Description */}
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold text-petrol-900">El viaje</h2>
              <p className="mt-3 max-w-[70ch] leading-relaxed text-graphite-700">{pkg.description}</p>
            </section>

            {/* Itinerary */}
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold text-petrol-900">Itinerario día por día</h2>
              <ol className="mt-5 relative border-l-2 border-teal-100 pl-6 space-y-7">
                {pkg.itinerary.map((day) => (
                  <li key={day.day} className="relative">
                    <span className="absolute -left-[2.05rem] top-0.5 grid size-6 place-items-center rounded-full bg-teal-500 text-[0.6875rem] font-bold text-white tabular">
                      {day.day}
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">{day.city}</p>
                    <h3 className="mt-0.5 font-display text-lg font-bold text-petrol-900">{day.title}</h3>
                    <p className="mt-1 max-w-[65ch] text-[0.9375rem] leading-relaxed text-graphite-600">{day.description}</p>
                    <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-graphite-500">
                      {day.meals.length > 0 && (
                        <span className="flex items-center gap-1">
                          <ForkKnifeIcon className="size-3.5" aria-hidden /> {day.meals.join(", ")}
                        </span>
                      )}
                      {day.hotelName && (
                        <span className="flex items-center gap-1">
                          <BedIcon className="size-3.5" aria-hidden /> {day.hotelName}
                        </span>
                      )}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Includes / not includes */}
            <section className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
                <h2 className="font-display text-lg font-bold text-petrol-900">Qué incluye</h2>
                <ul className="mt-3 space-y-2.5">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-graphite-700">
                      <CheckIcon weight="bold" className="mt-0.5 size-4 shrink-0 text-positive-700" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
                <h2 className="font-display text-lg font-bold text-petrol-900">Qué no incluye</h2>
                <ul className="mt-3 space-y-2.5">
                  {pkg.notIncludes.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-graphite-600">
                      <XIcon weight="bold" className="mt-0.5 size-4 shrink-0 text-graphite-400" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Requirements & policies */}
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold text-petrol-900">Documentación y condiciones</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-[var(--radius-card)] border border-teal-100 bg-teal-50/60 p-5">
                  <h3 className="flex items-center gap-2 font-semibold text-petrol-900">
                    <IdentificationCardIcon className="size-5 text-teal-600" aria-hidden /> Requisitos para viajar
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-graphite-700">
                    {pkg.requirements.map((r) => (
                      <li key={r}>· {r}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[var(--radius-card)] border border-graphite-100 bg-white p-5">
                  <h3 className="flex items-center gap-2 font-semibold text-petrol-900">
                    <ShieldCheckIcon className="size-5 text-teal-600" aria-hidden /> Política de cancelación
                  </h3>
                  <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-graphite-600">{pkg.cancellationPolicy}</p>
                  <Link href="/politica-de-cancelaciones" className="mt-2 inline-block text-sm font-semibold text-teal-600 hover:underline">
                    Ver política completa de cancelaciones
                  </Link>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold text-petrol-900">Preguntas sobre este paquete</h2>
              <div className="mt-2">
                <AccordionItem title="¿Puedo congelar el precio mientras lo decido?">
                  Sí. Pedí la cotización formal y queda congelada por 72 horas: reservando dentro de ese plazo se respeta el
                  precio aunque la tarifa suba.
                </AccordionItem>
                <AccordionItem title="¿Cómo funcionan la seña y el saldo?">
                  Bloqueás tu lugar con una seña (20% del total o USD 500 para larga distancia). El saldo se abona hasta 35
                  días antes de la salida, en uno o más pagos, en pesos o dólares.
                </AccordionItem>
                <AccordionItem title={`¿Qué pasa si la salida del ${pkg.departures[0] ? formatDate(pkg.departures[0].date) : "grupo"} no se confirma?`}>
                  Las salidas marcadas como confirmadas ya tienen el mínimo de pasajeros alcanzado. Si una salida pendiente
                  no llega al mínimo, te ofrecemos la fecha siguiente o la devolución total de lo pagado, lo que prefieras.
                </AccordionItem>
                <AccordionItem title="¿Puedo modificar pasajeros o extender noches?">
                  Sí, mientras haya disponibilidad. Los cambios de nombre en aéreos tienen cargos según la aerolínea; las
                  noches extra se cotizan a la tarifa vigente del hotel.
                </AccordionItem>
              </div>
            </section>

            {/* Reviews */}
            {reviews.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-2xl font-bold text-petrol-900">Opiniones de pasajeros</h2>
                <div className="mt-4 space-y-4">
                  {reviews.map((r) => (
                    <figure key={r.name} className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-lift)]">
                      <blockquote className="text-[0.9375rem] leading-relaxed text-graphite-700">“{r.text}”</blockquote>
                      <figcaption className="mt-3 text-xs text-graphite-500">
                        <span className="font-bold text-graphite-800">{r.name}</span> · {r.location} · viajó en {formatDate(r.date)}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Booking panel (sticky on desktop) */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <BookingPanel pkg={pkg} />
          </aside>
        </div>

        {/* Similar packages */}
        {similar.length > 0 && (
          <section className="mt-16 border-t border-graphite-100 pt-10 pb-16">
            <div className="flex items-center gap-2">
              <UsersIcon className="size-5 text-teal-600" aria-hidden />
              <h2 className="font-display text-2xl font-bold text-petrol-900">A otros viajeros también les interesó</h2>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {similar.map((p) => (
                <PackageCard key={p.slug} pkg={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
