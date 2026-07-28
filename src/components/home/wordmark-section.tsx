"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  AirplaneTiltIcon,
  ArrowRightIcon,
  CalendarCheckIcon,
  GlobeHemisphereWestIcon,
  HeartIcon,
  ShieldCheckIcon,
  StarIcon,
  SuitcaseRollingIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { trustMetrics } from "@/data/stories";

/**
 * "Empieza acá": the word VIAJÁ is the whole section.
 *
 * An ivory plate covers the band and the letters are punched out of it with an
 * SVG mask, so the panorama sits *one layer behind the entire word* and reads
 * as a single continuous scene across every glyph — not a copy per letter.
 * `background-clip: text` would do the same, but the mask lets `textLength`
 * pin the word to the full width before the display font has loaded, which
 * kills the reflow that approach suffers from.
 *
 * Swap the panorama with `wordBackgroundImage`. `cutoutImage` is an optional
 * transparent PNG (a traveller, a couple) that stands *in front* of the type;
 * without it the composition simply closes up.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/*
 * Two rules, and breaking either one hides the section:
 *
 * 1. Every animated child declares `variants`, never its own
 *    initial/whileInView pair. Inside a variant-driven parent Motion
 *    propagates the parent's label and a child's in-view gesture never fires.
 * 2. Those variants exist under reduced motion too, where `hidden` equals the
 *    resting state. `useReducedMotion()` returns null on the first render, so
 *    children mount hidden; dropping their variants later would strand them at
 *    opacity 0 with no way back.
 */
function buildVariants(reduce: boolean) {
  const t = (duration: number) => ({ duration: reduce ? 0 : duration, ease: EASE });
  const OPEN = "inset(0 0 0% 0)";

  return {
    rise: {
      hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0, transition: t(0.6) },
    },
    accentLine: {
      hidden: reduce ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 },
      visible: { scaleX: 1, opacity: 1, transition: t(0.55) },
    },
    /** The type wipes up into view, revealing plate and panorama together. */
    wordReveal: {
      hidden: reduce ? { clipPath: OPEN, opacity: 1 } : { clipPath: "inset(0 0 100% 0)", opacity: 0 },
      visible: { clipPath: OPEN, opacity: 1, transition: t(1) },
    },
  } satisfies Record<string, Variants>;
}

interface Benefit {
  icon: React.ComponentType<{ className?: string; weight?: "regular" | "light" | "bold" | "fill" }>;
  title: string;
  text: string;
}

interface Metric {
  icon: React.ComponentType<{ className?: string; weight?: "regular" | "light" | "bold" | "fill" }>;
  value: string;
  label: string;
}

const defaultBenefits: Benefit[] = [
  {
    icon: UsersThreeIcon,
    title: "Asesoramiento personalizado",
    text: "Te acompañamos en cada paso.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Viajes seguros",
    text: "Trabajamos con los mejores operadores.",
  },
  {
    icon: CalendarCheckIcon,
    title: "Flexibilidad",
    text: "Opciones de pago y cambios adaptables.",
  },
];

/**
 * DEMO figures, in line with the rest of the site. The rating comes from
 * `trustMetrics`; wire the other three to real data before production.
 */
const defaultMetrics: Metric[] = [
  { icon: SuitcaseRollingIcon, value: "+10 años", label: "De experiencia en viajes" },
  { icon: AirplaneTiltIcon, value: "+50 destinos", label: "Nacionales e internacionales" },
  { icon: HeartIcon, value: "+5.000 viajeros", label: "Confiaron en nosotros" },
  {
    icon: StarIcon,
    value: `${trustMetrics.averageRating.toLocaleString("es-AR")}/5`,
    label: "Calificación de nuestros viajeros",
  },
];

interface WordmarkSectionProps {
  eyebrow?: string;
  title?: string;
  word?: string;
  /** Panorama shown through the letters, as one continuous image. */
  wordBackgroundImage?: string;
  /** Crop for that panorama, e.g. "object-cover object-[center_40%]". */
  wordBackgroundFit?: string;
  /** Optional transparent PNG standing in front of the type. */
  cutoutImage?: string;
  cutoutAlt?: string;
  support?: { title: string; text: string };
  cta?: { label: string; href: string };
  benefits?: Benefit[];
  metrics?: Metric[];
}

export function WordmarkSection({
  eyebrow = "Tu próximo viaje",
  title = "Empieza acá",
  word = "VIAJÁ",
  wordBackgroundImage = "/images/travel/wordmark-panorama.webp",
  wordBackgroundFit = "object-cover object-[center_52%]",
  cutoutImage = "/images/travel/travellers-cutout.webp",
  cutoutAlt = "",
  support = {
    title: "Elegí el destino.\nNosotros hacemos que suceda.",
    text: "Descubrí paquetes, vuelos y experiencias con asesoramiento humano antes, durante y después del viaje.",
  },
  cta = { label: "Encontrar mi próximo viaje", href: "#destinos" },
  benefits = defaultBenefits,
  metrics = defaultMetrics,
}: WordmarkSectionProps = {}) {
  const reduce = useReducedMotion() ?? false;
  const V = useMemo(() => buildVariants(reduce), [reduce]);

  return (
    <section
      aria-labelledby="wordmark-heading"
      className="relative flex min-h-[900px] items-center overflow-hidden bg-ivory py-16 lg:min-h-[100vh] lg:py-14"
    >
      {/* Cartography, barely there: contours, one air route, one coordinate */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full text-petrol-900"
        viewBox="0 0 1440 900"
        /* `none` keeps the marks where they were drawn; stretching abstract
           contours is invisible, letting them slide off an edge is not. */
        preserveAspectRatio="none"
        fill="none"
      >
        <g opacity="0.06">
          {[0, 22, 44, 66, 88].map((o) => (
            <path
              key={o}
              d={`M-40 ${120 + o} C 220 ${60 + o}, 430 ${180 + o}, 700 ${120 + o} S 1200 ${40 + o}, 1480 ${140 + o}`}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
          {[0, 26, 52].map((o) => (
            <path
              key={`b${o}`}
              d={`M-40 ${700 + o} C 260 ${640 + o}, 520 ${770 + o}, 820 ${690 + o} S 1240 ${620 + o}, 1480 ${720 + o}`}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </g>
        {/* Squashed into a phone viewport this route reads as a stray doodle
            across the copy, so it only shows where there is room for it. */}
        <g opacity="0.28" className="hidden text-coral-500 lg:block">
          <path
            d="M120 236 C 300 176, 470 268, 660 208"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="5 8"
            strokeLinecap="round"
          />
          <circle cx="120" cy="236" r="4.5" stroke="currentColor" strokeWidth="1.5" />
        </g>
        <g opacity="0.35" className="text-teal-600">
          <circle cx="1268" cy="742" r="3" fill="currentColor" />
        </g>
      </svg>

      <motion.div
        className="relative mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: reduce ? 0 : 0.08 }}
      >
        {/* ── Centred header ─────────────────────────────────────── */}
        <motion.p
          variants={V.rise}
          className="text-center text-[0.72rem] font-semibold uppercase tracking-[0.42em] text-graphite-500 sm:text-[0.8125rem]"
        >
          {eyebrow}
        </motion.p>
        <motion.span
          aria-hidden
          variants={V.accentLine}
          className="mx-auto mt-4 block h-[3px] w-16 origin-center rounded-full bg-coral-500"
        />
        <motion.h2
          id="wordmark-heading"
          variants={V.rise}
          className="mt-4 text-center font-display text-[2rem] font-bold uppercase leading-none tracking-[0.16em] text-petrol-900 sm:text-5xl lg:text-[3.75rem] lg:tracking-[0.2em]"
        >
          {title}
        </motion.h2>

        {/* ── The word, with the panorama behind the knockout ────── */}
        <motion.div
          variants={V.wordReveal}
          className="relative mt-8 -mx-4 sm:mx-0 lg:mt-10"
        >
          <span className="sr-only">{word}</span>

          {/* Inset by a pixel so the photo never peeks out from under the
              plate when the band height lands on a fractional value. */}
          <div className="absolute inset-px overflow-hidden" aria-hidden>
            <Image
              src={wordBackgroundImage}
              alt=""
              fill
              sizes="100vw"
              quality={80}
              className={wordBackgroundFit}
            />
          </div>

          <svg viewBox="0 0 1000 280" className="relative z-10 block w-full" aria-hidden>
            <defs>
              <mask id="wordmark-knockout">
                <rect width="1000" height="280" fill="white" />
                <text
                  x="500"
                  y="228"
                  textAnchor="middle"
                  textLength="980"
                  lengthAdjust="spacingAndGlyphs"
                  fontSize="230"
                  fontWeight="800"
                  fill="black"
                  className="font-display"
                >
                  {word}
                </text>
              </mask>
            </defs>
            <rect width="1000" height="280" fill="var(--color-ivory)" mask="url(#wordmark-knockout)" />
          </svg>

          {/* Traveller cutout: stands in front of the type, feet on the
              baseline. Absent by default, and the layout closes up. */}
          {cutoutImage && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto hidden w-[46%] max-w-[40rem] translate-y-[24%] sm:block"
              aria-hidden={cutoutAlt === "" ? true : undefined}
            >
              {/* The trimmed PNG ends on a straight edge; fade its base so the
                  rock settles onto the page instead of being cut off. */}
              <Image
                src={cutoutImage}
                alt={cutoutAlt}
                width={1100}
                height={515}
                sizes="(max-width: 1024px) 60vw, 46vw"
                className="h-auto w-full"
                style={{
                  maskImage: "linear-gradient(to top, transparent 0%, #000 14%)",
                  WebkitMaskImage: "linear-gradient(to top, transparent 0%, #000 14%)",
                }}
              />
            </div>
          )}
        </motion.div>

        {/* ── Lower row: pitch and CTA left, benefits right ───────── */}
        <div className="relative z-30 mt-10 grid gap-10 lg:mt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-16 xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]">
          <motion.div
            variants={V.rise}
            className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left"
          >
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-full border border-coral-500/30 text-coral-500"
              aria-hidden
            >
              <GlobeHemisphereWestIcon className="size-6" weight="regular" />
            </span>
            <div>
              <p className="whitespace-pre-line font-display text-lg font-bold leading-snug text-petrol-950 sm:text-xl">
                {support.title}
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-graphite-600">
                {support.text}
              </p>
              <Link
                href={cta.href}
                className="group mt-6 inline-flex items-center gap-3 rounded-[var(--radius-control)] bg-coral-500 px-7 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white shadow-[var(--shadow-lift)] transition-colors hover:bg-coral-600 active:translate-y-px"
              >
                {cta.label}
                <ArrowRightIcon
                  weight="bold"
                  className="size-4 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </div>
          </motion.div>

          {/* Floating benefits card */}
          <motion.ul
            variants={V.rise}
            className="grid gap-6 rounded-[var(--radius-card)] border border-sand-200/70 bg-white/85 p-6 shadow-[var(--shadow-lift)] backdrop-blur-sm sm:grid-cols-3 sm:gap-5"
          >
            {benefits.map(({ icon: Icon, title: bTitle, text }) => (
              <li key={bTitle}>
                <Icon className="size-6 text-coral-500" weight="regular" aria-hidden />
                <p className="mt-3 text-[0.8125rem] font-bold leading-snug text-petrol-900">
                  {bTitle}
                </p>
                <p className="mt-1.5 text-[0.75rem] leading-relaxed text-graphite-500">{text}</p>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* ── Metrics strip ──────────────────────────────────────── */}
        <motion.ul
          variants={V.rise}
          className="relative z-30 mt-10 grid rounded-[var(--radius-card)] border border-sand-200/70 bg-white/85 shadow-[var(--shadow-lift)] backdrop-blur-sm sm:grid-cols-2 lg:mt-10 lg:grid-cols-4"
        >
          {metrics.map(({ icon: Icon, value, label }, i) => (
            <li
              key={label}
              className={`flex items-center gap-4 px-6 py-5 ${
                i > 0
                  ? "border-t border-sand-200/70 sm:border-t-0 sm:odd:border-l-0 lg:border-l lg:odd:border-l"
                  : ""
              } ${i === 1 ? "sm:border-l sm:border-sand-200/70" : ""} ${
                i >= 2 ? "sm:border-t sm:border-sand-200/70" : ""
              }`}
            >
              <Icon className="size-7 shrink-0 text-petrol-800" weight="light" aria-hidden />
              <div className="min-w-0">
                <p className="font-display text-lg font-bold tracking-tight text-petrol-950">
                  {value}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-graphite-500">{label}</p>
              </div>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
