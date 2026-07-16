import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRightIcon,
  CreditCardIcon,
  HandshakeIcon,
  HeadsetIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";
import { SearchWidget } from "@/components/search/search-widget";
import { PackageCard } from "@/components/cards/package-card";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { AccordionItem } from "@/components/ui/accordion";
import { TakeoffScroll } from "@/components/home/takeoff-scroll";
import { PromotionsShowcase } from "@/components/home/promotions-showcase";
import { ExperienceFinder } from "@/components/home/experience-finder";
import { CuratedDestinations } from "@/components/home/curated-destinations";
import { TravelStories } from "@/components/home/travel-stories";
import { HumanTouch } from "@/components/home/human-touch";
import { CustomTripSection } from "@/components/home/custom-trip-section";
import { featuredPackages } from "@/data/packages";
import { articles, faqs, groupTrips } from "@/data/content";
import { formatDate, formatMoney } from "@/lib/format";
import { IMG } from "@/data/img";

export const metadata: Metadata = {
  title: "Funes Travel · Paquetes, vuelos y viajes a medida",
  description:
    "Buscá paquetes, vuelos, hoteles y excursiones con asesoramiento humano. Salidas desde Rosario y Buenos Aires, financiación en cuotas y acompañamiento durante todo el viaje.",
};

/* ────────────────────────── 1 · Hero + search ────────────────────────── */

function Hero() {
  return (
    <section className="relative min-h-[92dvh] flex items-end lg:items-center">
      <Image
        src={IMG.santorini}
        alt="Casas blancas de Santorini sobre el mar Egeo al atardecer"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-petrol-950/60 via-petrol-950/30 to-petrol-950/75" aria-hidden />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 pt-28 pb-10 lg:pb-0">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
            Tu próximo viaje empieza mucho antes de despegar.
          </h1>
          <p className="mt-4 max-w-xl text-base sm:text-lg text-white/85 leading-relaxed">
            Paquetes, vuelos y experiencias para viajar con tranquilidad, acompañamiento real y beneficios exclusivos.
          </p>
        </div>
        <div className="mt-8 lg:mt-10">
          <SearchWidget />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── 2 · Trust line (no cards) ───────────────────── */

const trustItems = [
  { icon: HeadsetIcon, text: "Atención personalizada de asesores reales" },
  { icon: ShieldCheckIcon, text: "Pago seguro y precios transparentes" },
  { icon: CreditCardIcon, text: "Hasta 12 cuotas en salidas seleccionadas" },
  { icon: HandshakeIcon, text: "Acompañamiento antes y durante el viaje" },
  { icon: SealCheckIcon, text: "Operadores y hoteles seleccionados" },
];

function TrustLine() {
  return (
    <section aria-label="Por qué viajar con Funes Travel" className="border-b border-graphite-100 bg-white">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 sm:px-6 py-5 text-sm text-graphite-600">
        {trustItems.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2">
            <Icon className="size-4.5 text-teal-600" aria-hidden />
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ──────────────────────── 5 · Featured packages ──────────────────────── */

function FeaturedPackages() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900">
            Paquetes que están saliendo ahora
          </h2>
          <Link href="/paquetes" className="group flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-500">
            Ver todos los paquetes
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </Reveal>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featuredPackages.slice(0, 6).map((pkg, i) => (
          <Reveal key={pkg.slug} delay={(i % 3) * 0.06}>
            <PackageCard pkg={pkg} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── 7 · Group trips ─────────────────────────── */

function GroupTrips() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
      <Reveal>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900">
            Salidas grupales con coordinador
          </h2>
          <p className="mt-2 text-graphite-600">
            Viajás acompañado desde el aeropuerto de salida hasta la vuelta. Fechas confirmadas, grupos reducidos y reunión informativa antes de viajar.
          </p>
        </div>
      </Reveal>
      <div className="mt-8 space-y-5">
        {groupTrips.map((trip, i) => (
          <Reveal key={trip.slug} delay={i * 0.05}>
            <article className="grid overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)] md:grid-cols-[280px_1fr_auto]">
              <div className="relative h-44 md:h-full min-h-44">
                <Image src={trip.image} alt={trip.name} fill sizes="(max-width: 768px) 100vw, 280px" className="object-cover" />
                <Badge tone="positive" className="absolute left-3 top-3">Salida confirmada</Badge>
              </div>
              <div className="p-5 md:p-6">
                <h3 className="font-display text-xl font-bold text-petrol-900">{trip.name}</h3>
                <p className="mt-1.5 text-sm text-graphite-600">{trip.itinerarySummary.join(" · ")}</p>
                <dl className="mt-3 grid gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
                  <div className="flex gap-1.5">
                    <dt className="text-graphite-500">Salida:</dt>
                    <dd className="font-semibold text-graphite-800">{formatDate(trip.confirmedDate)} · {trip.days} días</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-graphite-500">Coordina:</dt>
                    <dd className="font-semibold text-graphite-800">{trip.coordinator}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-graphite-500">Desde:</dt>
                    <dd className="font-semibold text-graphite-800">{trip.departureCity}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-graphite-500">Ideal para:</dt>
                    <dd className="font-semibold text-graphite-800">{trip.profile}</dd>
                  </div>
                </dl>
                <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-coral-700">
                  <UsersThreeIcon className="size-4.5" aria-hidden />
                  Quedan {trip.seatsLeft} lugares de {trip.totalSeats}
                </p>
              </div>
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-graphite-100 p-5 md:p-6 md:text-right">
                <div>
                  <p className="text-xs text-graphite-500">Desde</p>
                  <p className="font-display text-2xl font-bold text-petrol-900 tabular">{formatMoney(trip.price)}</p>
                  <p className="text-xs text-graphite-500">por persona, base doble</p>
                </div>
                <ButtonLink href={`/viajes-grupales/${trip.slug}`} variant="secondary" size="sm">
                  Ver itinerario
                </ButtonLink>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────── 11 · Editorial articles ─────────────────────── */

function Inspiration() {
  const [featured, ...rest] = articles;
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900">
            Guías útiles antes de reservar
          </h2>
          <Link href="/inspiracion" className="group flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-500">
            Ver todas las guías
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </Reveal>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <Link href={`/inspiracion/${featured.slug}`} className="group block">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)]">
              <Image
                src={featured.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-teal-600">
              {featured.category} · {featured.readMinutes} min de lectura
            </p>
            <h3 className="mt-1.5 font-display text-2xl font-bold text-petrol-900 group-hover:text-petrol-700 transition-colors">
              {featured.title}
            </h3>
            <p className="mt-2 max-w-xl text-graphite-600">{featured.excerpt}</p>
          </Link>
        </Reveal>
        <Reveal delay={0.08}>
          <ul className="divide-y divide-graphite-100">
            {rest.slice(0, 4).map((a) => (
              <li key={a.slug}>
                <Link href={`/inspiracion/${a.slug}`} className="group flex items-center gap-4 py-4 first:pt-0">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                    <Image src={a.image} alt="" fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">{a.category}</p>
                    <h3 className="mt-0.5 font-semibold text-graphite-800 group-hover:text-petrol-800 transition-colors leading-snug">
                      {a.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-graphite-500">{a.readMinutes} min de lectura</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────── 12 · FAQ ─────────────────────────────── */

function FaqPreview() {
  const subset = [faqs[0], faqs[3], faqs[4], faqs[6], faqs[8], faqs[11]];
  return (
    <section className="bg-white border-t border-graphite-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24 grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900">
              Las dudas de siempre, respondidas
            </h2>
            <p className="mt-3 text-graphite-600">
              Pagos, cuotas, documentación y cancelaciones: lo que todos preguntan antes de reservar.
            </p>
            <ButtonLink href="/ayuda" variant="tertiary" className="mt-5">
              Ver todas las preguntas
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            {subset.map((f) => (
              <AccordionItem key={f.q} title={f.q}>
                {f.a}
              </AccordionItem>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Page ────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustLine />
      <PromotionsShowcase />
      <FeaturedPackages />
      <TakeoffScroll />
      <CuratedDestinations />
      <ExperienceFinder />
      <GroupTrips />
      <HumanTouch />
      <CustomTripSection />
      <TravelStories />
      <Inspiration />
      <FaqPreview />
    </>
  );
}
