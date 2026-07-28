"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import {
  AirplaneTiltIcon,
  ArrowRightIcon,
  CalendarBlankIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ChatsCircleIcon,
  ClockIcon,
  HeadsetIcon,
  MoonIcon,
  ShieldCheckIcon,
  SuitcaseRollingIcon,
  TagIcon,
} from "@phosphor-icons/react";
import type { FeaturedRoute, RouteCategory, RouteFact } from "@/lib/types";
import { featuredRoutes, routeCommitments, routeFilters } from "@/data/flight-routes";

/**
 * "Rutas destacadas": carrusel editorial de rutas frecuentes con foto de
 * destino, filtros por tipo y una franja de compromiso al pie.
 *
 * Deliberadamente claro y fotográfico, para no repetir el fondo oscuro y la
 * tarjeta de embarque de la sección anterior de esta misma página.
 *
 * El carrusel es una lista con scroll-snap: las flechas y los puntos mueven el
 * scroll real, así que el teclado, el trackpad y el gesto táctil funcionan sin
 * código extra y la lista sigue siendo navegable si el JS no llega.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const FACT_ICONS: Record<RouteFact["icon"], React.ComponentType<{ className?: string; weight?: "light" | "regular" | "bold" | "fill" }>> = {
  plane: AirplaneTiltIcon,
  calendar: CalendarBlankIcon,
  clock: ClockIcon,
  moon: MoonIcon,
  bag: SuitcaseRollingIcon,
};

const COMMITMENT_ICONS = { tag: TagIcon, shield: ShieldCheckIcon, headset: HeadsetIcon };

const BADGE_TONES = {
  petrol: "bg-petrol-900/85 text-white",
  positive: "bg-positive-700/90 text-white",
  night: "bg-[#4b3f72]/85 text-white",
} as const;

const COMMITMENT_TONES = {
  petrol: "bg-petrol-900 text-white",
  positive: "bg-positive-700 text-white",
  coral: "bg-coral-500 text-white",
} as const;

/* Ver la nota en human-touch.tsx: las variantes se pasan siempre y es `hidden`
   la que iguala el reposo bajo reduced motion. */
function buildVariants(reduce: boolean) {
  const t = (duration: number) => ({ duration: reduce ? 0 : duration, ease: EASE });
  return {
    container: { hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : 0.07 } } },
    item: {
      hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
      visible: { opacity: 1, y: 0, transition: t(0.55) },
    },
  } satisfies Record<string, Variants>;
}

/* ── Tarjeta de ruta ──────────────────────────────────────────────── */

function RouteCard({ route }: { route: FeaturedRoute }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)] transition-shadow duration-300 hover:shadow-[var(--shadow-float)]">
      <div className="relative aspect-[16/11] w-full overflow-hidden">
        <Image
          src={route.image}
          alt={route.imageAlt}
          fill
          sizes="(max-width: 640px) 84vw, (max-width: 1024px) 46vw, 31vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-petrol-950/85 via-petrol-950/35 to-transparent"
          aria-hidden
        />

        {route.badge && (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${BADGE_TONES[route.badge.tone]}`}
          >
            {route.badge.text}
          </span>
        )}

        {/* Origen y destino sobre la foto */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[0.8125rem] text-white/85">{route.origin.city}</p>
              <p className="font-display text-[1.75rem] font-bold leading-none tracking-tight text-white sm:text-[2rem]">
                {route.origin.code}
              </p>
            </div>
            <span
              className="mb-1 grid size-8 shrink-0 place-items-center rounded-full bg-white/95 text-petrol-900"
              aria-hidden
            >
              <AirplaneTiltIcon weight="fill" className="size-4" />
            </span>
            <div className="min-w-0 text-right">
              <p className="truncate text-[0.8125rem] text-white/85">{route.destination.city}</p>
              <p className="font-display text-[1.75rem] font-bold leading-none tracking-tight text-white sm:text-[2rem]">
                {route.destination.code}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Franja de datos y precio */}
      <Link
        href={route.primaryCta.href}
        aria-label={`${route.primaryCta.label}: ${route.shortLabel}, desde ${route.currency} ${route.priceFrom}`}
        className="flex flex-1 items-center gap-4 px-4 py-4 sm:gap-5 sm:px-5"
      >
        {route.facts.map((f, i) => {
          const Icon = FACT_ICONS[f.icon];
          return (
            <div
              key={f.value}
              /* A 84vw los dos datos y el precio no entran sin truncarse: en
                 teléfono se muestra sólo el primero. */
              className={`min-w-0 items-center gap-2 ${i === 0 ? "flex" : "hidden sm:flex"}`}
            >
              <Icon className="size-5 shrink-0 text-teal-600" weight="light" aria-hidden />
              <div className="min-w-0">
                {f.label && (
                  <p className="truncate text-[0.6875rem] leading-tight text-graphite-500">{f.label}</p>
                )}
                <p className="truncate text-[0.8125rem] font-semibold leading-tight text-petrol-900">
                  {f.value}
                </p>
              </div>
            </div>
          );
        })}

        <div className="ml-auto flex shrink-0 items-center gap-2 text-right">
          <div>
            <p className="text-[0.6875rem] leading-tight text-graphite-500">Desde</p>
            <p className="tabular font-display text-[1.0625rem] font-bold leading-tight text-coral-600">
              {route.currency} {route.priceFrom}
            </p>
          </div>
          <ArrowRightIcon
            className="size-4 text-graphite-400 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1 group-hover:text-coral-600"
            aria-hidden
          />
        </div>
      </Link>
    </article>
  );
}

/* ── Sección ──────────────────────────────────────────────────────── */

export function FeaturedRoutes({
  routes = featuredRoutes,
  commitments = routeCommitments,
}: {
  routes?: FeaturedRoute[];
  commitments?: typeof routeCommitments;
} = {}) {
  const reduce = useReducedMotion() ?? false;
  const V = useMemo(() => buildVariants(reduce), [reduce]);

  const [filter, setFilter] = useState<RouteCategory>("recomendadas");
  const visible = useMemo(() => routes.filter((r) => r.categories.includes(filter)), [routes, filter]);

  const railRef = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  /** Cuántas tarjetas entran a la vez decide cuántos puntos mostrar. */
  const measure = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const perView = Math.max(1, Math.round(el.clientWidth / card.offsetWidth));
    setPages(Math.max(1, Math.ceil(visible.length / perView)));
    setPage(Math.round(el.scrollLeft / (card.offsetWidth * perView)));
  }, [visible.length]);

  useEffect(() => {
    measure();
    const el = railRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: reduce ? "instant" : "smooth" });
  };

  const atStart = page <= 0;
  const atEnd = page >= pages - 1;

  return (
    <section aria-labelledby="featured-routes-heading" className="bg-ivory">
      <motion.div
        className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-20"
        variants={V.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* Encabezado */}
        <motion.p
          variants={V.item}
          className="text-center text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-coral-600"
        >
          Rutas destacadas
        </motion.p>
        <motion.h2
          id="featured-routes-heading"
          variants={V.item}
          className="mx-auto mt-4 max-w-[20ch] text-center font-display text-[2rem] font-bold leading-[1.08] tracking-tight text-petrol-900 sm:text-[2.5rem] lg:text-[3rem]"
        >
          Rutas que más emitimos
        </motion.h2>
        <motion.p
          variants={V.item}
          className="mx-auto mt-4 max-w-[56ch] text-center leading-relaxed text-graphite-600"
        >
          Precios de referencia por tramo, ida y vuelta por persona. Varían según fecha, anticipación
          y condiciones de la tarifa.
        </motion.p>

        {/* Filtros */}
        <motion.div
          variants={V.item}
          className="mt-9 flex flex-col items-center gap-4 lg:flex-row lg:justify-center"
        >
          <div
            role="tablist"
            aria-label="Tipo de ruta"
            /* w-full: dentro de un flex con items-center el contenedor tomaría el ancho
   de su contenido y el overflow-x nunca entraría en juego. */
            className="-mx-4 flex w-[calc(100%+2rem)] snap-x gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:w-auto lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {routeFilters.map((f) => {
              const on = f.id === filter;
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setFilter(f.id)}
                  className={`shrink-0 cursor-pointer snap-start whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                    on
                      ? "border-petrol-900 bg-petrol-900 text-ivory"
                      : "border-graphite-200 bg-white text-graphite-600 hover:border-graphite-400 hover:text-petrol-800"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <p className="flex items-center gap-2 text-xs leading-snug text-graphite-500 lg:ml-auto lg:text-right">
            <TagIcon className="size-4 shrink-0 text-coral-500" weight="light" aria-hidden />
            Precios por persona, ida y vuelta, en USD
          </p>
        </motion.div>

        {/* Carrusel */}
        <motion.div variants={V.item} className="relative mt-8">
          {/* Flechas: sólo donde hay lugar fuera del riel */}
          {pages > 1 && (
            <>
              <button
                type="button"
                onClick={() => scrollByPage(-1)}
                disabled={atStart}
                aria-label="Ver rutas anteriores"
                className="absolute -left-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white text-petrol-900 shadow-[var(--shadow-float)] transition-opacity hover:text-coral-600 disabled:pointer-events-none disabled:opacity-0 xl:grid"
              >
                <CaretLeftIcon weight="bold" className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => scrollByPage(1)}
                disabled={atEnd}
                aria-label="Ver más rutas"
                className="absolute -right-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white text-petrol-900 shadow-[var(--shadow-float)] transition-opacity hover:text-coral-600 disabled:pointer-events-none disabled:opacity-0 xl:grid"
              >
                <CaretRightIcon weight="bold" className="size-5" aria-hidden />
              </button>
            </>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={filter}
              ref={railRef}
              onScroll={measure}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
              className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {visible.map((r) => (
                <li
                  key={r.id}
                  className="w-[84vw] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-2.5rem)/3)]"
                >
                  <RouteCard route={r} />
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>

          {/* Puntos de página */}
          {pages > 1 && (
            <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Páginas de rutas">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === page}
                  aria-label={`Página ${i + 1} de ${pages}`}
                  onClick={() => {
                    const el = railRef.current;
                    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? "instant" : "smooth" });
                  }}
                  className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                    i === page ? "w-6 bg-petrol-900" : "w-2 bg-graphite-200 hover:bg-graphite-400"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Franja de compromiso */}
        <motion.div
          variants={V.item}
          className="mt-14 grid gap-10 rounded-[var(--radius-card)] bg-sand-50 px-6 py-9 sm:px-9 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_auto] lg:items-start lg:gap-12"
        >
          <div>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-coral-600">
              Nuestro compromiso
            </p>
            <h3 className="mt-3 font-display text-[1.5rem] font-bold leading-[1.15] tracking-tight text-petrol-900">
              No es solo el precio, es la experiencia completa.
            </h3>
            <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-graphite-600">
              Revisamos cada detalle antes de emitir y te acompañamos si algo cambia.
            </p>
          </div>

          <ul className="grid gap-8 sm:grid-cols-3 lg:border-l lg:border-sand-200 lg:pl-12">
            {commitments.map((c) => {
              const Icon = COMMITMENT_ICONS[c.icon];
              return (
                <li key={c.title}>
                  <span
                    className={`grid size-11 place-items-center rounded-full ${COMMITMENT_TONES[c.tone]}`}
                    aria-hidden
                  >
                    <Icon className="size-5" weight="regular" />
                  </span>
                  <h4 className="mt-3.5 font-display text-[0.9375rem] font-bold text-petrol-900">
                    {c.title}
                  </h4>
                  <p className="mt-1.5 max-w-[30ch] text-[0.8125rem] leading-relaxed text-graphite-600">
                    {c.text}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="lg:border-l lg:border-sand-200 lg:pl-12">
            <span className="grid size-11 place-items-center rounded-full bg-coral-50 text-coral-600" aria-hidden>
              <ChatsCircleIcon className="size-5" weight="regular" />
            </span>
            <p className="mt-3.5 font-display text-[0.9375rem] font-bold text-petrol-900">
              ¿Tenés dudas?
            </p>
            <a
              href="https://wa.me/5493415550123?text=Hola,%20quiero%20consultar%20por%20un%20vuelo."
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-1.5 inline-flex items-center gap-2 border-b border-coral-500/40 pb-0.5 text-sm font-bold text-coral-700 transition-colors hover:border-coral-500"
            >
              Hablá con un asesor
              <ArrowRightIcon
                weight="bold"
                className="size-4 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
                aria-hidden
              />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
