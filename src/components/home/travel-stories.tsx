import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  LifebuoyIcon,
  SealCheckIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { TravelStory } from "@/lib/types";
import { travelerPhotos, travelStories, trustMetrics } from "@/data/stories";
import { formatDate } from "@/lib/format";
import { Reveal } from "@/components/ui/reveal";
import { StoriesGallery } from "./stories-gallery";

/**
 * Traveler stories: one featured trip story, two compact secondary stories, an
 * "incident resolved" editorial note, a traveler photo strip with lightbox and
 * a trust band. All content comes from `src/data/stories.ts`.
 */

const stories = travelStories.filter((s) => s.active && s.publishPermission).sort((a, b) => a.order - b.order);
const featured = stories.find((s) => s.layout === "featured");
const secondaries = stories.filter((s) => s.layout === "secondary").slice(0, 2);
const incident = stories.find((s) => s.layout === "incident");

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-600">
      <SealCheckIcon weight="fill" className="size-3.5" aria-hidden />
      Viaje verificado
    </span>
  );
}

/* ── Featured story: big trip photo with an integrated panel ─────── */

function FeaturedStory({ story }: { story: TravelStory }) {
  return (
    <article className="group relative flex w-full min-h-[480px] flex-col justify-end overflow-hidden rounded-[var(--radius-card)]">
      <Image
        src={story.tripImages[0]}
        alt={story.tripImageAlt}
        fill
        sizes="(max-width: 1024px) 100vw, 60vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      />
      <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-petrol-950/90 via-petrol-950/45 to-transparent" aria-hidden />

      <div className="absolute left-5 top-5 flex flex-wrap gap-2 lg:left-6 lg:top-6">
        <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-petrol-900">
          {story.tripType} · {story.country}
        </span>
      </div>

      <div className="relative max-w-xl p-5 lg:p-7">
        <blockquote className="font-display text-xl lg:text-2xl font-bold leading-snug text-white [text-shadow:0_1px_18px_rgb(8_37_48_/_0.4)]">
          “{story.highlight}”
        </blockquote>
        <p className="mt-2.5 text-sm leading-relaxed text-white/90">{story.fullText}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <p className="text-sm font-bold text-white">{story.travelerName}</p>
          <VerifiedBadge />
        </div>
        <p className="mt-0.5 text-xs text-white/75">
          {story.city} · {story.destination} · {formatDate(story.date)}
        </p>
        <Link
          href={story.ctaHref}
          className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-coral-600"
        >
          {story.ctaLabel}
          <ArrowRightIcon weight="bold" className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

/* ── Secondary story: compact, photo beside the text ─────────────── */

function SecondaryStory({ story }: { story: TravelStory }) {
  return (
    <article className="group relative flex flex-1 gap-4 rounded-xl border border-sand-200 bg-white p-4 transition-colors hover:border-teal-500/50">
      <div className="relative hidden w-24 shrink-0 overflow-hidden rounded-lg sm:block">
        <Image
          src={story.tripImages[0]}
          alt={story.tripImageAlt}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-base font-bold leading-snug text-petrol-900">{story.storyTitle}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-graphite-600">“{story.highlight}”</p>
        <p className="mt-2 text-xs text-graphite-500">
          <span className="font-bold text-graphite-800">{story.travelerName}</span> · {story.city} · {story.tripType}
        </p>
        <Link
          href={story.ctaHref}
          className="relative z-10 mt-2 inline-flex items-center gap-1 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-500"
        >
          {story.ctaLabel}
          <ArrowRightIcon className="size-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

/* ── Incident note: how the agency responds when plans change ────── */

function IncidentNote({ story }: { story: TravelStory }) {
  return (
    <aside className="flex flex-1 gap-3.5 rounded-xl bg-petrol-950 p-5 text-ivory">
      <LifebuoyIcon className="mt-0.5 size-6 shrink-0 text-teal-100" aria-hidden />
      <div>
        <h3 className="font-display text-base font-bold leading-snug">{story.storyTitle}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-petrol-100/85">{story.highlight}</p>
        <p className="mt-2.5 text-xs text-petrol-100/70">
          <span className="font-semibold text-petrol-100">{story.travelerName}</span> · {story.destination} ·{" "}
          {formatDate(story.date)}
        </p>
      </div>
    </aside>
  );
}

/* ── Section ─────────────────────────────────────────────────────── */

export function TravelStories() {
  if (!featured) return null;

  return (
    <section className="bg-sand-50 border-y border-sand-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div className="max-w-xl">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-graphite-500">
                Viajeros reales · Experiencias verificadas
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900">
                Viajes reales, contados por quienes estuvieron ahí
              </h2>
              <p className="mt-2 text-graphite-600">
                Historias de personas que viajaron con nosotros, desde la primera consulta hasta el regreso a casa.
              </p>
            </div>
            <Link
              href="/experiencias"
              className="group hidden items-center gap-1.5 pb-1 text-sm font-semibold text-teal-600 hover:text-teal-500 lg:flex"
            >
              Ver todas las experiencias
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Reveal className="flex">
            <div className="relative flex w-full">
              <FeaturedStory story={featured} />
            </div>
          </Reveal>
          <div className="flex flex-col gap-4">
            {secondaries.map((story, i) => (
              <Reveal key={story.id} delay={0.08 + i * 0.06} className="flex flex-1">
                <SecondaryStory story={story} />
              </Reveal>
            ))}
            {incident && (
              <Reveal delay={0.2} className="flex flex-1">
                <IncidentNote story={incident} />
              </Reveal>
            )}
          </div>
        </div>

        {/* Traveler photos */}
        <Reveal delay={0.1}>
          <div className="mt-8">
            <h3 className="mb-3 text-sm font-bold text-graphite-800">Fotos que nos mandaron los viajeros</h3>
            <StoriesGallery photos={travelerPhotos} />
          </div>
        </Reveal>

        {/* Trust band */}
        <Reveal delay={0.15}>
          <div className="mt-8 grid gap-y-4 rounded-[var(--radius-card)] border border-sand-200 bg-white px-6 py-5 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_auto] lg:items-center lg:gap-x-10">
            <div className="flex items-center gap-3">
              <p className="font-display text-3xl font-bold text-petrol-900 tabular">
                {trustMetrics.averageRating.toLocaleString("es-AR")}
                <span className="text-base font-sans font-normal text-graphite-500">/5</span>
              </p>
              <div>
                <div className="flex gap-0.5" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} weight="fill" className="size-3.5 text-warning-700" />
                  ))}
                </div>
                <p className="mt-0.5 text-xs text-graphite-500">{trustMetrics.ratingNote}</p>
              </div>
            </div>
            <p className="flex items-center gap-2 text-sm text-graphite-600">
              <SealCheckIcon weight="fill" className="size-4.5 shrink-0 text-teal-500" aria-hidden />
              {trustMetrics.verifiedCount}
            </p>
            <p className="text-sm text-graphite-600">{trustMetrics.freshnessNote}</p>
            <Link
              href={trustMetrics.reviewsLinkHref}
              className="text-sm font-semibold text-teal-600 hover:text-teal-500 whitespace-nowrap"
            >
              {trustMetrics.reviewsLinkLabel}
            </Link>
          </div>
        </Reveal>

        <p className="mt-5 text-center lg:hidden">
          <Link href="/experiencias" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600">
            Ver todas las experiencias
            <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </p>
      </div>
    </section>
  );
}
