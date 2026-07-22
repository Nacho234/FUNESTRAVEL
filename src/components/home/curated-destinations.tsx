import Image from "next/image";
import Link from "next/link";
import {
  AirplaneTiltIcon,
  ArrowRightIcon,
  CalendarBlankIcon,
  MoonStarsIcon,
  SealCheckIcon,
  UsersIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { CuratedDestination } from "@/lib/types";
import { curatedDestinations, curationMeta } from "@/data/curated-destinations";
import { formatMoney } from "@/lib/format";
import { avatar } from "@/data/img";
import { IMG } from "@/data/img";
import { Reveal } from "@/components/ui/reveal";
import { SaveDestinationButton } from "./save-destination-button";
import { MiniProposalForm } from "./mini-proposal-form";
import { FavoriteButton } from "@/components/cards/favorite-button";

/**
 * "Destinos elegidos para esta temporada": a curated, asymmetric editorial
 * composition. Every pick carries its selection reason and transparent
 * pricing; content lives in `src/data/curated-destinations.ts`. Each card
 * variant shares typography and palette but not the same layout treatment.
 */

const picks = curatedDestinations.filter((d) => d.active).sort((a, b) => a.priority - b.priority);
const hero = picks.find((d) => d.featured && d.variant === "hero");
const panel = picks.find((d) => d.variant === "panel");
const plaque = picks.find((d) => d.variant === "plaque");
const editorial = picks.find((d) => d.variant === "editorial");

function nights(d: CuratedDestination): string {
  return d.nightsMin === d.nightsMax ? `${d.nightsMin} noches` : `${d.nightsMin} a ${d.nightsMax} noches`;
}

function priceClarification(d: CuratedDestination): string {
  const parts = [
    d.priceBase.replace("Por persona en base doble", "Base doble"),
    d.flightIncluded ? (d.taxesIncluded ? "aéreo e impuestos incluidos" : "aéreo incluido, más impuestos") : d.taxesIncluded ? "impuestos incluidos" : "más impuestos",
  ];
  return parts.join(" · ");
}

/* ── Hero: content integrated over the image ─────────────────────── */

function HeroCard({ d }: { d: CuratedDestination }) {
  return (
    <article className="group relative flex h-[480px] lg:h-[540px] flex-col justify-end overflow-hidden rounded-[var(--radius-card)]">
      <Image
        src={d.imageDesktop}
        alt={d.imageAlt}
        fill
        sizes="(max-width: 1024px) 100vw, 58vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      />
      <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-petrol-950/90 via-petrol-950/45 to-transparent" aria-hidden />

      {/* Editorial label + coordinates */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6 lg:p-7">
        <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-petrol-900">{d.reason}</span>
        {d.coordinates && (
          <span className="hidden whitespace-nowrap rounded-full bg-petrol-950/35 px-2.5 py-1 text-[0.6875rem] font-medium tracking-wide text-white/90 tabular backdrop-blur-sm sm:inline-flex">{d.coordinates}</span>
        )}
      </div>

      <div className="relative p-6 lg:p-7">
        <p className="text-sm font-medium text-white/80">{d.country}</p>
        <h3 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-white">{d.name}</h3>
        <p className="mt-2 max-w-md text-sm lg:text-[0.9375rem] text-white/90">{d.description}</p>

        <ul className="mt-3 flex max-w-xl flex-wrap gap-x-5 gap-y-1.5 text-[0.8125rem] text-white/85">
          <li className="flex items-center gap-1.5">
            <MoonStarsIcon className="size-4 text-teal-100" aria-hidden /> {nights(d)}
          </li>
          <li className="flex items-center gap-1.5">
            <AirplaneTiltIcon className="size-4 text-teal-100" aria-hidden /> Salidas desde {d.departureCities.join(" y ")}
          </li>
          <li className="flex items-center gap-1.5">
            <UsersIcon className="size-4 text-teal-100" aria-hidden /> {d.experienceType}
          </li>
          {d.bestSeason && (
            <li className="flex items-center gap-1.5">
              <CalendarBlankIcon className="size-4 text-teal-100" aria-hidden /> Mejor época: {d.bestSeason}
            </li>
          )}
        </ul>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-3xl font-bold text-white tabular leading-none">
              <span className="text-sm font-sans font-normal text-white/75">Desde </span>
              {formatMoney(d.priceFrom)}
              <span className="text-sm font-sans font-normal text-white/75"> por persona</span>
            </p>
            <p className="mt-1 text-xs text-white/70">{priceClarification(d)}</p>
            {d.installmentsNote && <p className="mt-0.5 text-xs font-semibold text-teal-100">{d.installmentsNote}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={d.ctaHref}
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-5 py-2.5 text-sm font-bold text-white transition-colors group-hover:bg-coral-600 hover:bg-coral-600"
            >
              {d.ctaLabel}
              <ArrowRightIcon weight="bold" className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <SaveDestinationButton slug={d.slug} />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Panel: image beside a light info panel (Bariloche) ──────────── */

function PanelCard({ d }: { d: CuratedDestination }) {
  return (
    <article className="group grid min-h-44 grid-cols-[42%_1fr] overflow-hidden rounded-xl border border-sand-200 bg-white transition-colors hover:border-teal-500/50">
      <div className="relative overflow-hidden">
        <Image
          src={d.imageDesktop}
          alt={d.imageAlt}
          fill
          sizes="(max-width: 1024px) 45vw, 18vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-petrol-950/60 px-2.5 py-0.5 text-[0.6875rem] font-bold text-white backdrop-blur">
          {d.reason}
        </span>
      </div>
      <div className="flex flex-col justify-center p-4 lg:p-5">
        <p className="text-xs text-graphite-500">{d.country}</p>
        <h3 className="font-display text-xl font-bold text-petrol-900">
          <Link href={d.ctaHref} className="after:absolute after:inset-0">
            {d.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs text-graphite-600">
          {nights(d)} · {d.experienceType.toLowerCase()} · desde {d.departureCities.join(" y ")}
        </p>
        <p className="mt-2 text-sm text-graphite-500">
          Desde <span className="font-display text-lg font-bold text-petrol-900 tabular">{formatMoney(d.priceFrom)}</span>
          <span className="block text-[0.6875rem] text-graphite-500">{priceClarification(d)}</span>
        </p>
        <span className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-teal-600 transition-colors group-hover:text-teal-500">
          {d.ctaLabel}
          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton itemKey={`dest:${d.slug}`} className="!size-8" />
      </div>
    </article>
  );
}

/* ── Plaque: image with a translucent info plaque (Río) ──────────── */

function PlaqueCard({ d }: { d: CuratedDestination }) {
  return (
    <article className="group relative flex min-h-64 w-full flex-col justify-end overflow-hidden rounded-lg">
      <Image
        src={d.imageDesktop}
        alt={d.imageAlt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[0.6875rem] font-bold text-petrol-900">
        {d.reason}
      </span>
      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton itemKey={`dest:${d.slug}`} className="!size-8" />
      </div>
      <div className="relative m-2.5 rounded-md bg-petrol-950/60 p-3.5 backdrop-blur-md">
        <p className="text-[0.6875rem] text-white/75">{d.country}</p>
        <h3 className="font-display text-lg font-bold leading-tight text-white">
          <Link href={d.ctaHref} className="after:absolute after:inset-0">
            {d.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-[0.6875rem] text-white/80">
          {nights(d)} · {d.experienceType.toLowerCase()}
        </p>
        <p className="mt-1.5 text-xs text-white/80">
          Desde <span className="font-display text-base font-bold text-white tabular">{formatMoney(d.priceFrom)}</span>
        </p>
        <p className="text-[0.625rem] text-white/65">{priceClarification(d)}</p>
        <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-teal-100 transition-colors group-hover:text-white">
          {d.ctaLabel}
          <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}

/* ── Editorial: image on top, typographic data below (París) ─────── */

function EditorialCard({ d }: { d: CuratedDestination }) {
  return (
    <article className="group relative flex min-h-64 w-full flex-col overflow-hidden rounded-lg border border-sand-200 bg-white transition-colors hover:border-teal-500/50">
      <div className="relative h-28 shrink-0 overflow-hidden sm:h-32">
        <Image
          src={d.imageDesktop}
          alt={d.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute right-3 top-3 z-10">
          <FavoriteButton itemKey={`dest:${d.slug}`} className="!size-8" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3.5 lg:p-4">
        <p className="text-[0.6875rem] font-bold uppercase tracking-wide text-coral-700">{d.reason}</p>
        <h3 className="mt-1 font-display text-lg font-bold leading-tight text-petrol-900">
          <Link href={d.ctaHref} className="after:absolute after:inset-0">
            {d.name}
          </Link>
          <span className="ml-1.5 text-xs font-sans font-normal text-graphite-500">{d.country}</span>
        </h3>
        <p className="mt-1 text-xs leading-snug text-graphite-600">
          {nights(d)} · {d.description.toLowerCase().replace(/\.$/, "")} · {d.experienceType.toLowerCase()}
        </p>
        <div className="mt-auto pt-2">
          <p className="text-xs text-graphite-500">
            Desde <span className="font-display text-base font-bold text-petrol-900 tabular">{formatMoney(d.priceFrom)}</span>
          </p>
          <p className="text-[0.625rem] text-graphite-500">{priceClarification(d)}</p>
          <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-teal-600 transition-colors group-hover:text-teal-500">
            {d.ctaLabel}
            <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}

/* ── Curation seal ───────────────────────────────────────────────── */

function CurationSeal() {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-sand-200 bg-white px-5 py-3.5">
      <Image src={avatar(20)} alt="" width={38} height={38} className="rounded-full" />
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-sm font-bold text-petrol-900">
          Selección del equipo Funes Travel
          <SealCheckIcon weight="fill" className="size-4 text-teal-500" aria-hidden />
        </p>
        <p className="text-xs text-graphite-500">{curationMeta.reviewedNote}</p>
      </div>
    </div>
  );
}

/* ── Custom trip module ──────────────────────────────────────────── */

function ProposalModule() {
  return (
    <div className="relative flex flex-1 overflow-hidden rounded-xl bg-sand-100">
      <div className="relative z-10 flex-1 p-5 sm:pr-24 lg:pr-20 xl:pr-28">
        <h3 className="font-display text-lg font-bold leading-snug text-petrol-900">¿Tenés otro destino en mente?</h3>
        <p className="mt-1 mb-3.5 text-xs leading-snug text-graphite-600">
          Contanos qué tipo de viaje imaginás y un asesor prepara una propuesta a medida.
        </p>
        <MiniProposalForm />
      </div>
      {/* Partial planning scene, masked into the module edge */}
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 hidden w-28 sm:block lg:w-24 xl:w-32" aria-hidden>
        <Image
          src={IMG.planning}
          alt=""
          fill
          sizes="128px"
          className="object-cover object-left [mask-image:linear-gradient(to_left,black_30%,transparent)] opacity-90"
        />
      </div>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────── */

export function CuratedDestinations() {
  if (!hero) return null;

  return (
    <section id="destinos" className="relative scroll-mt-20 overflow-hidden bg-ivory">

      {/* Subtle cartographic route in the background */}
      <svg
        className="pointer-events-none absolute right-0 top-14 hidden h-32 w-[46%] text-petrol-800/25 lg:block"
        viewBox="0 0 660 130"
        fill="none"
        aria-hidden
      >
        <path d="M-10 105 C 150 30, 330 115, 470 55 S 640 25, 680 60" stroke="currentColor" strokeWidth="1.25" strokeDasharray="1 7" strokeLinecap="round" />
        <circle cx="200" cy="72" r="2.5" fill="currentColor" />
        <circle cx="470" cy="55" r="2.5" fill="currentColor" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div className="max-w-xl">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-graphite-600">
                {curationMeta.label} · {curationMeta.period}
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900">
                Destinos elegidos para esta temporada
              </h2>
              <p className="mt-2 text-graphite-700">
                Seleccionamos propuestas que combinan buen momento para viajar, disponibilidad y precios competitivos.
              </p>
            </div>
            <Link
              href="/destinos"
              className="group hidden items-center gap-1.5 pb-1 text-sm font-semibold text-teal-600 hover:text-teal-500 lg:flex"
            >
              Explorar todos los destinos
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          {/* Main pick + curation seal + video card (fills the leftover height) */}
          <Reveal className="lg:col-span-7 flex flex-col gap-4">
            <HeroCard d={hero} />
            <CurationSeal />
            <div className="relative min-h-48 flex-1 overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-lift)]">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster="/videos/destinos-poster.jpg"
                aria-hidden
              >
                <source src="/videos/destinos.webm" type="video/webm" />
                <source src="/videos/destinos.mp4" type="video/mp4" />
              </video>
            </div>
          </Reveal>

          {/* Secondary picks + proposal module */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {panel && (
              <Reveal delay={0.08} className="relative">
                <PanelCard d={panel} />
              </Reveal>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {plaque && (
                <Reveal delay={0.14} className="flex">
                  <div className="relative flex w-full">
                    <PlaqueCard d={plaque} />
                  </div>
                </Reveal>
              )}
              {editorial && (
                <Reveal delay={0.2} className="flex">
                  <div className="relative flex w-full">
                    <EditorialCard d={editorial} />
                  </div>
                </Reveal>
              )}
            </div>
            <Reveal delay={0.26} className="flex flex-1">
              <ProposalModule />
            </Reveal>
          </div>
        </div>

        <p className="mt-6 text-center lg:hidden">
          <Link href="/destinos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600">
            Explorar todos los destinos
            <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </p>
      </div>
    </section>
  );
}
