"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import type { TravelExperience } from "@/lib/types";
import { defaultExperienceSlug, travelExperiences } from "@/data/experiences";
import { formatMoney } from "@/lib/format";

/**
 * Home experience finder. Editorial two-column composition: a narrow numbered
 * selector on the left (accessible tabs) and a large immersive panel on the
 * right that swaps background, copy, CTAs and related destinations per travel
 * style.
 *
 * Everything the panel renders comes from `src/data/experiences.ts` — changing
 * a background image or a CTA is a data edit, never a layout edit.
 *
 * Images: only visited experiences stay mounted, so the first selection loads
 * its scene and every later switch is an instant crossfade.
 */

const experiences = travelExperiences.filter((e) => e.active).sort((a, b) => a.order - b.order);

/** Vertical travel of the background under scroll, in percent of its own height. */
const PARALLAX = 3.5;
const EASE = [0.16, 1, 0.3, 1] as const;

/** Entrada al entrar en pantalla. Ver la nota en human-touch.tsx. */
function buildEnter(reduce: boolean): Variants {
  return {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.55, ease: EASE } },
  };
}

function Destinations({ exp }: { exp: TravelExperience }) {
  return (
    <ul className="grid gap-x-2 gap-y-3 sm:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-white/15">
      {exp.destinations.map((d) => (
        <li key={d.name} className="min-w-0 lg:px-4 lg:first:pl-1 lg:last:pr-1">
          <Link
            href={d.href}
            aria-label={
              d.priceFrom
                ? `${d.name}, ${d.tag}, desde ${formatMoney(d.priceFrom)}`
                : `${d.name}, ${d.tag}`
            }
            className="group/dest flex items-center gap-3"
          >
            <span className="relative size-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/25">
              <Image
                src={d.image}
                alt=""
                fill
                sizes="40px"
                className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover/dest:scale-110"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline gap-3">
                <span className="min-w-0 truncate text-[0.8125rem] font-bold text-white underline-offset-4 group-hover/dest:underline">
                  {d.name}
                </span>
                {d.priceFrom && (
                  <span className="ml-auto shrink-0 whitespace-nowrap text-[0.6875rem] text-white/60">
                    desde <span className="tabular text-white/85">{formatMoney(d.priceFrom)}</span>
                  </span>
                )}
              </span>
              <span className="mt-0.5 block truncate text-[0.6875rem] text-white/65">{d.tag}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ExperienceFinder() {
  const [selectedSlug, setSelectedSlug] = useState(defaultExperienceSlug);
  const [visited, setVisited] = useState<Set<string>>(() => new Set([defaultExperienceSlug]));
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const enter = useMemo(() => buildEnter(reduce), [reduce]);

  const selected = experiences.find((e) => e.slug === selectedSlug) ?? experiences[0];

  // Depth cue: the scene drifts slightly slower than the panel it lives in.
  const { scrollYProgress } = useScroll({ target: panelRef, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [`${-PARALLAX}%`, `${PARALLAX}%`]);

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

  const onKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    refs: React.RefObject<(HTMLButtonElement | null)[]>,
  ) => {
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
    <section
      aria-labelledby="exp-heading"
      className="bg-gradient-to-b from-ivory via-sand-50/50 to-ivory"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] xl:gap-16">
          {/* ── Left rail: heading + numbered selector ─────────────── */}
          <motion.div
            className="min-w-0 lg:flex lg:flex-col"
            variants={enter}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2
              id="exp-heading"
              className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-petrol-900 sm:text-4xl xl:text-[2.5rem]"
            >
              Encontrá un viaje hecho para vos
            </h2>
            <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-graphite-600">
              No hace falta tener el destino decidido. Elegí cómo querés viajar y descubrí
              propuestas pensadas para ese momento.
            </p>

            {/* Desktop selector: vertical typographic list */}
            <div
              role="tablist"
              aria-label="Estilos de viaje"
              aria-orientation="vertical"
              className="mt-9 hidden border-t border-graphite-200/70 pt-3 lg:block"
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
                    className="group relative block w-full cursor-pointer py-2.5 pl-5 text-left"
                  >
                    {active && (
                      <motion.span
                        layoutId="exp-marker"
                        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE }}
                        className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-coral-500"
                        aria-hidden
                      />
                    )}
                    <span className="flex items-baseline gap-3">
                      <span
                        className={`text-[0.6875rem] font-semibold tabular transition-colors duration-300 ${
                          active ? "text-coral-600" : "text-graphite-400 group-hover:text-graphite-500"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-display font-bold tracking-tight transition-all duration-300 ease-[var(--ease-out-soft)] ${
                          active
                            ? "text-[1.375rem] text-petrol-900"
                            : "text-[1.0625rem] text-graphite-400 group-hover:text-graphite-600"
                        }`}
                      >
                        {exp.name}
                      </span>
                    </span>
                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.span
                          key="phrase"
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                          className="block overflow-hidden pl-8 text-[0.8125rem] leading-snug text-graphite-500"
                        >
                          <span className="block pt-1">{exp.shortPhrase}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Right: immersive panel ─────────────────────────────── */}
          {/* min-w-0: without it the grid item grows to the pill scroller's
              max-content width and pushes the panel past the viewport. */}
          <motion.div
            className="min-w-0"
            variants={enter}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: reduce ? 0 : 0.12 }}
          >
            {/* Mobile / tablet selector: horizontal pills with snap */}
            <div
              role="tablist"
              aria-label="Estilos de viaje"
              aria-orientation="horizontal"
              className="-mx-4 mb-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                    className={`shrink-0 snap-start cursor-pointer whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                      active
                        ? "border-petrol-900 bg-petrol-900 text-ivory"
                        : "border-graphite-200 bg-white/60 text-graphite-500 hover:border-graphite-400 hover:text-petrol-800"
                    }`}
                  >
                    {exp.name}
                  </button>
                );
              })}
            </div>

            <div
              ref={panelRef}
              id="exp-panel"
              role="tabpanel"
              aria-labelledby={`exp-tab-${selected.slug}`}
              className="relative overflow-hidden rounded-[var(--radius-card)] bg-petrol-950 shadow-[var(--shadow-float)] lg:h-[40rem] xl:h-[43rem]"
            >
              {/* Scene: visited backgrounds stay mounted for instant crossfades */}
              <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
                <motion.div
                  style={{ y: reduce ? 0 : drift }}
                  className="absolute inset-x-0 -inset-y-[6%]"
                >
                  {experiences.map((exp) => {
                    const active = exp.slug === selected.slug;
                    if (!visited.has(exp.slug) && !active) return null;
                    return (
                      <div
                        key={exp.id}
                        aria-hidden={!active}
                        className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-out-soft)] ${
                          active
                            ? "scale-100 opacity-100"
                            : "pointer-events-none scale-[1.04] opacity-0"
                        }`}
                      >
                        <Image
                          src={exp.imageDesktop}
                          alt={active ? exp.imageAlt : ""}
                          fill
                          sizes="(max-width: 1024px) 100vw, 70vw"
                          className="object-cover"
                        />
                      </div>
                    );
                  })}
                </motion.div>

                {/* Scrims: bottom for the copy block, left for desktop legibility */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-petrol-950 from-5% via-petrol-950/25 via-45% to-transparent lg:via-petrol-950/75 lg:via-52%"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-petrol-950/65 to-transparent to-60% lg:block"
                />
              </div>

              {/* Copy: below the scene on mobile, overlaid on desktop */}
              <motion.div
                key={selected.slug}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                className="relative -mt-px bg-petrol-950 px-5 pb-6 pt-4 sm:px-7 sm:pb-7 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:bg-transparent lg:p-9 xl:p-10"
              >
                {/* Text shadows only where the copy sits on the photo (lg+) */}
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-teal-100 lg:[text-shadow:0_1px_14px_rgb(8_37_48_/_0.7)]">
                  {selected.eyebrow}
                </p>
                <h3 className="mt-2.5 max-w-[19ch] font-display text-[1.75rem] font-bold leading-[1.1] tracking-tight text-white sm:text-[2rem] lg:text-[2.25rem] lg:[text-shadow:0_2px_24px_rgb(8_37_48_/_0.6)] xl:text-[2.5rem]">
                  {selected.title}
                </h3>
                <p className="mt-3 max-w-[54ch] text-[0.9375rem] leading-relaxed text-white/80 lg:[text-shadow:0_1px_14px_rgb(8_37_48_/_0.65)]">
                  {selected.description}
                </p>

                <ul className="mt-5 grid max-w-2xl gap-x-8 gap-y-2 sm:grid-cols-2">
                  {selected.facts.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-1.5 text-[0.8125rem] text-white/85 lg:[text-shadow:0_1px_12px_rgb(8_37_48_/_0.7)]"
                    >
                      <CheckIcon weight="bold" className="size-3.5 shrink-0 text-teal-100" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={selected.ctaHref}
                    className="group/cta inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-coral-600 active:translate-y-px sm:w-auto"
                  >
                    {selected.ctaLabel}
                    <ArrowRightIcon
                      weight="bold"
                      className="size-4 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover/cta:translate-x-1"
                      aria-hidden
                    />
                  </Link>
                  {selected.secondaryCtaLabel && selected.secondaryCtaHref && (
                    <Link
                      href={selected.secondaryCtaHref}
                      className="inline-flex w-full items-center justify-center rounded-[var(--radius-control)] border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/60 hover:bg-white/12 active:translate-y-px sm:w-auto"
                    >
                      {selected.secondaryCtaLabel}
                    </Link>
                  )}
                </div>

                {/* Related destinations strip */}
                <div className="mt-7 border-t border-white/15 pt-4 lg:mt-8 lg:rounded-xl lg:border lg:border-white/15 lg:bg-white/[0.07] lg:p-3 lg:backdrop-blur-md">
                  <Destinations exp={selected} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
