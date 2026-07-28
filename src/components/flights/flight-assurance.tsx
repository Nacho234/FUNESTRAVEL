"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import {
  AirplaneTiltIcon,
  ArrowRightIcon,
  CheckIcon,
  ClipboardTextIcon,
  HeadsetIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  TicketIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import type {
  FlightAssuranceIcon,
  FlightAssuranceRoute,
  FlightAssuranceStep,
  FlightAssuranceTrust,
} from "@/lib/types";
import { assuranceRoutes, assuranceSteps, assuranceTrust } from "@/data/flights-assurance";

/**
 * "Vuelos con respaldo": el argumento de la página de vuelos, contado con una
 * tarjeta de embarque en lugar de tres cards de beneficios.
 *
 * La tarjeta desglosa el costo real de la tarifa (publicada + equipaje), que es
 * el punto comercial de la sección: el precio que se ve en un buscador no es el
 * que se termina pagando. Las rutas son pestañas accesibles y todo el contenido
 * vive en `src/data/flights-assurance.ts`.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const ICONS: Record<FlightAssuranceIcon, React.ComponentType<{ className?: string; weight?: "light" | "regular" | "bold" | "fill" }>> = {
  search: MagnifyingGlassIcon,
  ticket: TicketIcon,
  headset: HeadsetIcon,
  shield: ShieldCheckIcon,
  clipboard: ClipboardTextIcon,
  person: UserCircleIcon,
};

/*
 * Las variantes se pasan siempre y es `hidden` la que iguala el reposo bajo
 * reduced motion: useReducedMotion() devuelve null en el primer render, así que
 * quitar el prop después dejaría los hijos atascados en opacity 0.
 */
function buildVariants(reduce: boolean) {
  const t = (duration: number) => ({ duration: reduce ? 0 : duration, ease: EASE });
  return {
    container: { hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : 0.08 } } },
    item: {
      hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
      visible: { opacity: 1, y: 0, transition: t(0.55) },
    },
    card: {
      hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
      visible: { opacity: 1, y: 0, transition: t(0.7) },
    },
  } satisfies Record<string, Variants>;
}

/* ── Tarjeta de embarque ──────────────────────────────────────────── */

function BoardingPass({ route }: { route: FlightAssuranceRoute }) {
  return (
    <div className="overflow-hidden rounded-[1.375rem] border border-sand-200/70 bg-ivory shadow-[0_24px_70px_-24px_rgb(8_37_48_/_0.55)]">
      {/* Cabecera: origen, trayecto y destino */}
      <div className="flex items-start justify-between gap-4 px-5 pt-6 sm:px-8 sm:pt-7">
        <div>
          <p className="font-display text-[2rem] font-bold leading-none tracking-tight text-petrol-900 sm:text-[2.75rem]">
            {route.code}
          </p>
          <p className="mt-1.5 text-sm text-graphite-500">{route.city}</p>
        </div>

        <div className="hidden flex-1 pt-2 sm:block" aria-hidden>
          <div className="flex items-center justify-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-graphite-500">
            <span>{route.stopsLabel}</span>
            <span className="text-graphite-300">·</span>
            <span className="tabular">{route.duration}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-px flex-1 border-t border-dashed border-graphite-200" />
            <AirplaneTiltIcon weight="fill" className="size-5 shrink-0 text-teal-600" />
            <span className="h-px flex-1 border-t border-dashed border-graphite-200" />
          </div>
        </div>

        <div className="text-right">
          <p className="font-display text-[2rem] font-bold leading-none tracking-tight text-petrol-900 sm:text-[2.75rem]">
            {route.to.code}
          </p>
          <p className="mt-1.5 text-sm text-graphite-500">{route.to.city}</p>
        </div>
      </div>

      {/* En pantalla angosta el trayecto va debajo, no entre los códigos */}
      <p className="mt-4 flex items-center justify-center gap-2 px-5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-graphite-500 sm:hidden">
        {route.stopsLabel}
        <AirplaneTiltIcon weight="fill" className="size-4 text-teal-600" aria-hidden />
        <span className="tabular">{route.duration}</span>
      </p>

      {/* Datos del vuelo */}
      <dl className="mt-5 grid grid-cols-2 gap-y-4 px-5 pb-6 sm:grid-cols-4 sm:px-8">
        {[
          { k: "Fecha", v: route.date },
          { k: "Salida", v: route.depTime },
          { k: "Llegada", v: route.arrTime },
          { k: "Vuela con", v: route.airline },
        ].map(({ k, v }) => (
          <div key={k}>
            <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-graphite-400">
              {k}
            </dt>
            <dd className="mt-1 font-display text-[0.9375rem] font-bold text-petrol-900">{v}</dd>
          </div>
        ))}
      </dl>

      {/* Perforación del ticket */}
      <div className="relative" aria-hidden>
        <span className="absolute left-0 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-petrol-950" />
        <span className="absolute right-0 top-1/2 size-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-petrol-950" />
        <div className="mx-5 border-t border-dashed border-graphite-200 sm:mx-8" />
      </div>

      {/* Talón: costo real, qué incluye y condiciones */}
      <div className="grid gap-6 px-5 py-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] sm:gap-8 sm:px-8">
        <div>
          <h4 className="font-display text-base font-bold text-petrol-900">Tarifa completa</h4>
          <dl className="mt-3.5 space-y-2">
            {route.priceBreakdown.map((line) => (
              <div
                key={line.label}
                className={`flex items-baseline justify-between gap-3 rounded-lg text-sm ${
                  line.highlight ? "bg-sand-100/70 px-2.5 py-1.5" : "px-2.5 py-1.5"
                }`}
              >
                <dt className="text-graphite-600">{line.label}</dt>
                <dd className="tabular whitespace-nowrap font-semibold text-petrol-900">
                  {line.amount}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-graphite-100 px-2.5 pt-3.5">
            <p className="font-display text-base font-bold text-petrol-900">Costo real</p>
            <p className="tabular font-display text-xl font-bold text-coral-600">{route.realCost}</p>
          </div>
        </div>

        <div className="sm:border-l sm:border-graphite-100 sm:pl-8">
          <h4 className="font-display text-base font-bold text-petrol-900">Incluye</h4>
          <ul className="mt-3.5 space-y-2">
            {route.includes.map((inc) => (
              <li key={inc} className="flex items-start gap-2 text-sm leading-snug text-graphite-600">
                <CheckIcon weight="bold" className="mt-0.5 size-3.5 shrink-0 text-teal-600" aria-hidden />
                {inc}
              </li>
            ))}
          </ul>
        </div>

        <div className="sm:border-l sm:border-graphite-100 sm:pl-8">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-display text-base font-bold text-petrol-900">{route.fareName}</h4>
            {route.fareTag && (
              <span className="rounded-full bg-coral-50 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-coral-700">
                {route.fareTag}
              </span>
            )}
          </div>
          <dl className="mt-3.5 space-y-2.5">
            {route.conditions.map((c) => (
              <div key={c.label}>
                <dt className="text-[0.8125rem] font-semibold text-petrol-900">{c.label}</dt>
                <dd className="text-[0.8125rem] leading-snug text-graphite-500">{c.value}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={route.href}
            className="group/cta mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-coral-600 active:translate-y-px"
          >
            Ver opciones
            <ArrowRightIcon
              weight="bold"
              className="size-4 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover/cta:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Sección ──────────────────────────────────────────────────────── */

export function FlightAssurance({
  routes = assuranceRoutes,
  steps = assuranceSteps,
  trust = assuranceTrust,
}: {
  routes?: FlightAssuranceRoute[];
  steps?: FlightAssuranceStep[];
  trust?: FlightAssuranceTrust[];
} = {}) {
  const reduce = useReducedMotion() ?? false;
  const V = useMemo(() => buildVariants(reduce), [reduce]);
  const [activeCode, setActiveCode] = useState(routes[0]?.code ?? "");

  const active = routes.find((r) => r.code === activeCode) ?? routes[0];
  const index = routes.indexOf(active);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const next =
      e.key === "ArrowRight" ? (index + 1) % routes.length
      : e.key === "ArrowLeft" ? (index - 1 + routes.length) % routes.length
      : e.key === "Home" ? 0
      : e.key === "End" ? routes.length - 1
      : -1;
    if (next === -1) return;
    e.preventDefault();
    setActiveCode(routes[next].code);
    (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };

  if (!active) return null;

  return (
    <section aria-labelledby="flight-assurance-heading">
      {/* ── Bloque oscuro ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-petrol-950 via-petrol-900 to-petrol-950">
        {/* Cartografía de rutas, apenas perceptible */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1440 820"
          preserveAspectRatio="none"
          fill="none"
        >
          <g className="text-teal-100" opacity="0.07">
            <path d="M-40 300 C 260 170, 560 380, 860 240 S 1280 90, 1500 210" stroke="currentColor" strokeWidth="1" />
            <path d="M-40 470 C 300 360, 620 560, 940 420 S 1300 280, 1500 400" stroke="currentColor" strokeWidth="1" />
            <path d="M120 60 C 380 -10, 700 130, 980 40" stroke="currentColor" strokeWidth="1" />
          </g>
          <g className="text-teal-100" opacity="0.5">
            <path
              d="M300 130 C 470 40, 640 60, 760 96"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="4 7"
              strokeLinecap="round"
              opacity="0.45"
            />
            <circle cx="300" cy="130" r="3" fill="currentColor" opacity="0.6" />
            <circle cx="1094" cy="612" r="2.5" fill="currentColor" opacity="0.4" />
            <circle cx="196" cy="596" r="2.5" fill="currentColor" opacity="0.4" />
          </g>
        </svg>

        <motion.div
          className="relative mx-auto max-w-[91rem] px-4 py-12 sm:px-6 lg:px-10 lg:py-14"
          variants={V.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Selector de rutas */}
          <motion.div
            variants={V.item}
            role="tablist"
            aria-label="Rutas de ejemplo"
            className="-mx-4 mb-10 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:mb-8 lg:justify-end [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {routes.map((r) => {
              const on = r.code === active.code;
              return (
                <button
                  key={r.code}
                  role="tab"
                  aria-selected={on}
                  aria-controls="flight-assurance-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActiveCode(r.code)}
                  onKeyDown={onKeyDown}
                  className={`relative shrink-0 cursor-pointer whitespace-nowrap px-4 py-2 text-sm font-semibold tracking-[0.08em] transition-colors ${
                    on ? "text-white" : "text-white/45 hover:text-white/80"
                  }`}
                >
                  {r.code}
                  {on && (
                    <motion.span
                      layoutId="flight-assurance-tab"
                      transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE }}
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-white"
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </motion.div>

          <div className="grid items-start gap-12 xl:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] xl:gap-16">
            {/* Columna editorial */}
            <div className="xl:pt-4">
              <motion.p
                variants={V.item}
                className="text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-teal-100"
              >
                Vuelos con respaldo
              </motion.p>

              <motion.h2
                id="flight-assurance-heading"
                variants={V.item}
                className="mt-5 max-w-[19ch] font-display text-[2.125rem] font-bold leading-[1.06] tracking-tight text-white sm:text-[2.5rem] xl:text-[clamp(2.25rem,2.85vw,3rem)]"
              >
                No comprás solo un pasaje. Comprás a quién llamar si algo cambia.
              </motion.h2>

              <motion.p
                variants={V.item}
                className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-white/75"
              >
                Revisamos equipaje, cambios, aeropuertos y condiciones antes de emitir.{" "}
                <span className="font-semibold text-white">Vos elegís con toda la información</span> y
                nosotros seguimos del otro lado después de pagar.
              </motion.p>

              <motion.div variants={V.item} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href="#buscador"
                  className="group inline-flex items-center gap-3 rounded-[var(--radius-control)] bg-coral-500 px-7 py-4 text-[0.9375rem] font-bold text-white shadow-[0_10px_30px_-10px_rgb(217_85_42_/_0.7)] transition-colors hover:bg-coral-600 active:translate-y-px"
                >
                  Buscar mi próximo vuelo
                  <ArrowRightIcon
                    weight="bold"
                    className="size-4 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
                <a
                  href="https://wa.me/5493415550123?text=Hola,%20quiero%20consultar%20por%20un%20vuelo."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 border-b border-white/30 pb-1 text-sm font-semibold text-white transition-colors hover:border-white"
                >
                  Hablar con un asesor
                  <ArrowRightIcon
                    className="size-3.5 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
                    aria-hidden
                  />
                </a>
              </motion.div>
            </div>

            {/* Tarjeta de embarque */}
            <motion.div variants={V.card} id="flight-assurance-panel" role="tabpanel">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.code}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                >
                  <BoardingPass route={active} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Proceso de tres pasos */}
          <motion.ol
            variants={V.item}
            className="mt-11 grid gap-8 md:grid-cols-3 lg:mt-12 lg:gap-10"
          >
            {steps.map((s, i) => {
              const Icon = ICONS[s.icon];
              return (
                <li key={s.title} className="relative flex items-start gap-4 lg:gap-5">
                  <span
                    className="grid size-14 shrink-0 place-items-center rounded-full border border-teal-100/25 bg-white/[0.04] font-display text-base font-bold tabular text-teal-100"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="mt-3 hidden size-7 shrink-0 text-teal-100/70 xl:block" weight="light" aria-hidden />
                  <div className="min-w-0 pt-1.5">
                    <h3 className="font-display text-[1.0625rem] font-bold text-white">{s.title}</h3>
                    <p className="mt-1.5 max-w-[38ch] text-sm leading-relaxed text-white/65">{s.text}</p>
                  </div>
                </li>
              );
            })}
          </motion.ol>
        </motion.div>
      </div>

      {/* ── Franja clara de confianza ──────────────────────────────── */}
      <div className="border-b border-sand-200/70 bg-sand-50">
        <div className="mx-auto grid max-w-[91rem] gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:items-center lg:gap-10 lg:px-10">
          {trust.map((t) => {
            const Icon = ICONS[t.icon];
            return (
              <div key={t.title} className="flex items-start gap-4">
                <span
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-petrol-800 shadow-[var(--shadow-lift)]"
                  aria-hidden
                >
                  <Icon className="size-6" weight="light" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[0.9375rem] font-bold text-petrol-900">{t.title}</h3>
                  <p className="mt-1 max-w-[36ch] text-sm leading-relaxed text-graphite-600">{t.text}</p>
                </div>
              </div>
            );
          })}
          <Link
            href="/nosotros"
            className="group inline-flex items-center gap-2 self-start border-b border-coral-500/40 pb-1 text-sm font-bold text-coral-700 transition-colors hover:border-coral-500 lg:self-center"
          >
            Conocer cómo trabajamos
            <ArrowRightIcon
              weight="bold"
              className="size-4 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
