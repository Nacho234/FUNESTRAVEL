"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react";
import type { TravelExperience } from "@/lib/types";
import { defaultExperienceSlug, travelExperiences } from "@/data/experiences";
import { formatMoney } from "@/lib/format";

/**
 * Home experience finder: a vertical typographic selector (accessible tabs)
 * paired with a large cinematic panel that swaps scene, copy, related
 * destinations and CTA per travel style. Content lives in
 * `src/data/experiences.ts`; the initial selection honors ?experiencia=<slug>.
 *
 * Images: only the visited experiences are mounted (the initial one loads with
 * the section; the rest load on first selection and stay cached for instant
 * crossfades afterwards).
 */

const experiences = travelExperiences.filter((e) => e.active).sort((a, b) => a.order - b.order);

function RouteDestinations({ exp, variant }: { exp: TravelExperience; variant: "panel" | "list" }) {
  if (variant === "list") {
    return (
      <ul className="divide-y divide-graphite-100 rounded-[var(--radius-card)] border border-graphite-100 bg-white">
        {exp.destinations.map((d) => (
          <li key={d.name}>
            <Link href={d.href} className="flex items-center gap-3.5 px-4 py-3 group">
              <span className="relative size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-teal-100">
                <Image src={d.image} alt="" fill sizes="44px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-petrol-900">{d.name}</span>
                <span className="block text-xs text-graphite-500">{d.tag}</span>
              </span>
              {d.priceFrom && (
                <span className="text-xs text-graphite-500 whitespace-nowrap">
                  desde <span className="font-bold text-petrol-900 tabular">{formatMoney(d.priceFrom)}</span>
                </span>
              )}
              <ArrowRightIcon className="size-4 shrink-0 text-teal-600 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  // Panel variant: an editorial "route" strip, destinations joined by a dashed path.
  return (
    <div className="flex items-stretch gap-0 rounded-xl bg-petrol-950/55 px-4 py-3 backdrop-blur-md">
      {exp.destinations.map((d, i) => (
        <div key={d.name} className="flex flex-1 items-center min-w-0 justify-center first:justify-start last:justify-end">
          {i > 0 && (
            <div className="relative mx-3 w-8 shrink-0 lg:w-12" aria-hidden>
              <div className="border-t border-dashed border-white/40" />
              <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
            </div>
          )}
          <Link href={d.href} className="group flex min-w-0 items-center gap-2.5">
            <span className="relative size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white/60">
              <Image src={d.image} alt="" fill sizes="40px" className="object-cover transition-transform duration-300 group-hover:scale-110" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-white group-hover:underline underline-offset-2">
                {d.name}
              </span>
              <span className="block truncate text-[0.6875rem] text-white/70">
                {d.tag}
                {d.priceFrom && <span className="tabular"> · {formatMoney(d.priceFrom)}</span>}
              </span>
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
}

function PanelContent({ exp }: { exp: TravelExperience }) {
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-wide text-teal-100">Experiencia seleccionada</p>
      <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white max-w-lg [text-shadow:0_1px_20px_rgb(8_37_48_/_0.55)]">
        {exp.title}
      </h3>
      <p className="mt-2 max-w-xl text-sm sm:text-[0.9375rem] leading-relaxed text-white/90 [text-shadow:0_1px_12px_rgb(8_37_48_/_0.6)]">{exp.description}</p>
      <ul className="mt-3.5 grid max-w-xl grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
        {exp.facts.map((f) => (
          <li key={f} className="flex items-center gap-1.5 text-[0.8125rem] text-white/90 [text-shadow:0_1px_10px_rgb(8_37_48_/_0.65)]">
            <CheckIcon weight="bold" className="size-3.5 shrink-0 text-teal-100" aria-hidden />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href={exp.ctaHref}
          className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-coral-600"
        >
          {exp.ctaLabel}
          <ArrowRightIcon weight="bold" className="size-4" aria-hidden />
        </Link>
        <Link
          href="/viajes-a-medida"
          className="px-2 py-2.5 text-sm font-semibold text-white/95 underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
        >
          Diseñar un viaje a medida
        </Link>
      </div>
    </>
  );
}

export function ExperienceFinder() {
  const [selectedSlug, setSelectedSlug] = useState(defaultExperienceSlug);
  const [visited, setVisited] = useState<Set<string>>(() => new Set([defaultExperienceSlug]));
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileTabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selected = experiences.find((e) => e.slug === selectedSlug) ?? experiences[0];

  // Honor ?experiencia=<slug> as the initial selection
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("experiencia");
    if (slug && experiences.some((e) => e.slug === slug)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time URL sync after mount
      setSelectedSlug(slug);
      setVisited((v) => new Set(v).add(slug));
      // Center the preselected tab in the mobile scroller
      const index = experiences.findIndex((e) => e.slug === slug);
      mobileTabRefs.current[index]?.scrollIntoView({ inline: "center", block: "nearest" });
    }
  }, []);

  const select = useCallback((slug: string, scrollTarget?: HTMLButtonElement | null) => {
    setSelectedSlug(slug);
    setVisited((v) => (v.has(slug) ? v : new Set(v).add(slug)));
    // Reflect the selection in the URL without navigating
    const url = new URL(window.location.href);
    url.searchParams.set("experiencia", slug);
    window.history.replaceState(null, "", url);
    // Center the active tab in the mobile scroller
    scrollTarget?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  const onKeyDown = (e: React.KeyboardEvent, index: number, refs: React.RefObject<(HTMLButtonElement | null)[]>) => {
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (index + 1) % experiences.length
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (index - 1 + experiences.length) % experiences.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? experiences.length - 1
              : -1;
    if (next === -1) return;
    e.preventDefault();
    const btn = refs.current?.[next];
    btn?.focus();
    select(experiences[next].slug, btn);
  };

  return (
    <section className="bg-white border-y border-graphite-100" aria-label="Encontrá un viaje hecho para vos">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900">
            Encontrá un viaje hecho para vos
          </h2>
          <p className="mt-2 text-graphite-600">
            No hace falta tener el destino decidido. Elegí cómo querés viajar y descubrí propuestas pensadas para ese momento.
          </p>
        </div>

        {/* Mobile / tablet selector: horizontal text tabs with snap */}
        <div
          role="tablist"
          aria-label="Estilos de viaje"
          aria-orientation="horizontal"
          className="mt-7 -mx-4 flex snap-x snap-mandatory gap-1 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {experiences.map((exp, i) => {
            const active = exp.slug === selected.slug;
            return (
              <button
                key={exp.id}
                ref={(el) => {
                  mobileTabRefs.current[i] = el;
                }}
                role="tab"
                id={`exp-tab-m-${exp.slug}`}
                aria-selected={active}
                aria-controls="exp-panel"
                tabIndex={active ? 0 : -1}
                onClick={(e) => select(exp.slug, e.currentTarget)}
                onKeyDown={(e) => onKeyDown(e, i, mobileTabRefs)}
                className={`snap-start shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                  active ? "bg-petrol-900 text-ivory" : "text-graphite-500 hover:text-petrol-800"
                }`}
              >
                {exp.name}
              </button>
            );
          })}
        </div>

        <div className="mt-2 lg:mt-10 grid gap-6 lg:grid-cols-[minmax(260px,28%)_1fr] lg:gap-12">
          {/* Desktop selector: vertical typographic list */}
          <div
            role="tablist"
            aria-label="Estilos de viaje"
            aria-orientation="vertical"
            className="hidden lg:flex flex-col justify-center gap-1"
          >
            {experiences.map((exp, i) => {
              const active = exp.slug === selected.slug;
              return (
                <button
                  key={exp.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`exp-tab-${exp.slug}`}
                  aria-selected={active}
                  aria-controls="exp-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => select(exp.slug)}
                  onKeyDown={(e) => onKeyDown(e, i, tabRefs)}
                  className="group relative py-2.5 pl-6 text-left cursor-pointer"
                >
                  {/* Accent marker */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full bg-coral-500 transition-all duration-300 ${
                      active ? "h-4/5 opacity-100" : "h-0 opacity-0"
                    }`}
                    aria-hidden
                  />
                  <span className="flex items-baseline gap-3">
                    <span
                      className={`text-[0.6875rem] font-semibold tabular transition-colors ${
                        active ? "text-coral-600" : "text-graphite-400 group-hover:text-graphite-500"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display font-bold tracking-tight transition-all duration-300 ${
                        active
                          ? "text-2xl text-petrol-900"
                          : "text-lg text-graphite-400 group-hover:text-graphite-600"
                      }`}
                    >
                      {exp.name}
                    </span>
                  </span>
                  <span
                    className={`block overflow-hidden pl-8 text-sm text-graphite-500 transition-all duration-300 ${
                      active ? "mt-1 max-h-12 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    “{exp.shortPhrase}”
                  </span>
                </button>
              );
            })}
          </div>

          {/* Visual panel */}
          <div>
            <div
              id="exp-panel"
              role="tabpanel"
              aria-labelledby={`exp-tab-${selected.slug}`}
              className="relative overflow-hidden rounded-[var(--radius-card)] aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto lg:h-[620px]"
            >
              {/* Scenes: visited ones stay mounted for instant crossfades */}
              {experiences.map((exp) => {
                const active = exp.slug === selected.slug;
                if (!visited.has(exp.slug) && !active) return null;
                return (
                  <div
                    key={exp.id}
                    aria-hidden={!active}
                    className={`absolute inset-0 transition-[opacity,transform] duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
                      active ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-[1.02] pointer-events-none"
                    }`}
                  >
                    <Image
                      src={exp.imageDesktop}
                      alt={active ? exp.imageAlt : ""}
                      fill
                      sizes="(max-width: 1024px) 100vw, 68vw"
                      className="object-cover"
                    />
                  </div>
                );
              })}

              {/* Localized scrim + copy (desktop overlay) */}
              <div className="absolute inset-x-0 bottom-0 hidden lg:block h-[75%] bg-gradient-to-t from-petrol-950/90 via-petrol-950/55 to-transparent" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 hidden lg:block p-7">
                <PanelContent exp={selected} />
                <div className="mt-6">
                  <RouteDestinations exp={selected} variant="panel" />
                </div>
              </div>

              {/* Mobile: only the small label sits on the image */}
              <span className="absolute left-4 top-4 rounded-full bg-petrol-950/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur lg:hidden">
                {selected.name}
              </span>
            </div>

            {/* Mobile / tablet: copy and destinations live below the image */}
            <div className="mt-5 lg:hidden">
              <div className="rounded-[var(--radius-card)] bg-petrol-950 p-5 sm:p-6">
                <PanelContent exp={selected} />
              </div>
              <div className="mt-4">
                <RouteDestinations exp={selected} variant="list" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
