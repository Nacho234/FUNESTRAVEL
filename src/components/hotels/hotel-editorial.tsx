"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  ArrowRightIcon,
  BedIcon,
  CalendarBlankIcon,
  CoffeeIcon,
  SunHorizonIcon,
  MapPinIcon,
  TreePalmIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import type { FeaturedHotel, HotelStage, HotelStageIcon } from "@/lib/types";
import {
  editorialPhotos,
  featuredHotel,
  hotelStages,
} from "@/data/hotel-editorial";

/**
 * "Elegí cómo querés despertar": pieza editorial de /hoteles.
 *
 * Argumenta que una estadía se elige por tres cosas y no por estrellas:
 * habitación, vista y experiencia. Cada etapa de la columna izquierda apunta a
 * una de las tres fotos; al señalarla, esa foto se acerca y las otras dos
 * ceden un poco, sin que ninguna desaparezca.
 *
 * Los recortes diagonales salen de `clip-path` sobre los contenedores, no de
 * las fotos: cambiar una imagen no toca la composición.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const STAGE_ICONS: Record<
  HotelStageIcon,
  React.ComponentType<{
    className?: string;
    weight?: "light" | "regular" | "bold" | "fill";
  }>
> = {
  bed: BedIcon,
  view: SunHorizonIcon,
  experience: TreePalmIcon,
};

/**
 * Bordes de la composición. El corte de la foto superior y el de las dos de
 * abajo son complementarios, así no queda una franja de fondo entre ellas.
 */
const CLIP = {
  /** Contenedor 0→53%: el borde baja apenas, de 53% (izq) a 51% (der). */
  room: "polygon(0 0, 100% 0, 100% 96.2%, 0 100%)",
  /** Contenedor 50→100%: repite esa recta, con medio punto de solapamiento
      para que no aparezca una costura de subpíxel. */
  terrace: "polygon(0 5%, 100% 1%, 100% 100%, 0 100%)",
  /** El corte marcado de la composición: la piscina entra en cuña. */
  pool: "polygon(14% 0, 100% 0, 100% 100%, 0 100%)",
} as const;

/* Ver la nota en human-touch.tsx: las variantes se pasan siempre y es `hidden`
   la que iguala el reposo bajo reduced motion. */
function buildVariants(reduce: boolean) {
  const t = (duration: number) => ({
    duration: reduce ? 0 : duration,
    ease: EASE,
  });
  return {
    container: {
      hidden: {},
      visible: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
    },
    item: {
      hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
      visible: { opacity: 1, y: 0, transition: t(0.55) },
    },
    photos: {
      hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
      visible: { opacity: 1, y: 0, transition: t(0.7) },
    },
  } satisfies Record<string, Variants>;
}

/* ── Ficha flotante ───────────────────────────────────────────────── */

function HotelCard({ hotel }: { hotel: FeaturedHotel }) {
  const facts = [
    { icon: CalendarBlankIcon, text: hotel.nights },
    { icon: CoffeeIcon, text: hotel.mealPlan },
    { icon: ShieldCheckIcon, text: hotel.cancellation },
  ];

  return (
    <div className="w-full max-w-[19rem] rounded-[1.25rem] border border-sand-200/70 bg-ivory p-6 shadow-[0_24px_60px_-22px_rgb(8_37_48_/_0.35)]">
      <p className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-graphite-500">
        <MapPinIcon
          weight="fill"
          className="size-4 shrink-0 text-coral-500"
          aria-hidden
        />
        {hotel.location}
      </p>

      <h3 className="mt-3 font-accent text-[1.625rem] font-medium not-italic leading-tight text-petrol-900">
        {hotel.name}
      </h3>

      <ul className="mt-5 space-y-3">
        {facts.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-center gap-3 text-sm text-graphite-700"
          >
            <Icon
              className="size-[1.125rem] shrink-0 text-petrol-700"
              weight="light"
              aria-hidden
            />
            {text}
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-sand-200" />

      <Link
        href={hotel.href}
        className="group/cta mt-5 flex w-full items-center justify-center gap-2.5 rounded-[var(--radius-control)] bg-coral-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-coral-600 active:translate-y-px"
      >
        Ver hotel
        <ArrowRightIcon
          weight="bold"
          className="size-4 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover/cta:translate-x-1"
          aria-hidden
        />
      </Link>
    </div>
  );
}

/* ── Sección ──────────────────────────────────────────────────────── */

export function HotelEditorial({
  stages = hotelStages,
  hotel = featuredHotel,
  photos = editorialPhotos,
}: {
  stages?: HotelStage[];
  hotel?: FeaturedHotel;
  photos?: typeof editorialPhotos;
} = {}) {
  const reduce = useReducedMotion() ?? false;
  const V = buildVariants(reduce);
  /** null = ninguna etapa señalada: las tres fotos pesan igual. */
  const [active, setActive] = useState<HotelStage["target"] | null>(null);

  /** Ninguna foto se oculta: la que no manda apenas cede presencia. */
  const photoClass = (target: HotelStage["target"]) => {
    const on = active === target;
    const dimmed = active !== null && !on;
    return `transition-all duration-700 ease-[var(--ease-out-soft)] ${
      on ? "scale-[1.03]" : "scale-100"
    } ${dimmed ? "opacity-70 saturate-[0.85]" : "opacity-100"}`;
  };

  return (
    <section
      aria-labelledby="hotel-editorial-heading"
      className="overflow-hidden bg-sand-50/60"
    >
      <motion.div
        className="mx-auto grid max-w-[100rem] gap-12 px-4 py-16 sm:px-6 lg:min-h-[clamp(36rem,56vw,50rem)] lg:grid-cols-[minmax(0,31fr)_minmax(0,69fr)] lg:gap-14 lg:px-0 lg:py-0 lg:pl-10 xl:pl-16"
        variants={V.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* ── Columna editorial ──────────────────────────────────── */}
        <div className="lg:flex lg:flex-col lg:justify-center lg:py-12 xl:py-14">
          <motion.span
            variants={V.item}
            className="block text-coral-500"
            aria-hidden
          >
            <TreePalmIcon weight="light" className="size-7" />
          </motion.span>

          <motion.p
            variants={V.item}
            className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-coral-600"
          >
            Hoteles seleccionados
          </motion.p>

          <motion.h2
            id="hotel-editorial-heading"
            variants={V.item}
            className="mt-4 max-w-[16ch] font-accent text-[2.75rem] font-medium not-italic leading-[1.05] tracking-tight text-petrol-900 sm:text-[3.25rem] xl:text-[3.75rem]"
          >
            Elegí cómo querés despertar
          </motion.h2>

          <motion.span
            variants={V.item}
            aria-hidden
            className="mt-6 block h-[3px] w-16 rounded-full bg-coral-500"
          />

          <motion.p
            variants={V.item}
            className="mt-6 max-w-[42ch] text-[0.9375rem] leading-relaxed text-graphite-600"
          >
            Desde suites frente al mar hasta experiencias que se disfrutan sin
            apuro. Vos elegís el ritmo, nosotros nos encargamos del resto.
          </motion.p>

          {/* Etapas: una línea fina las une, sin cards */}
          <motion.ul variants={V.item} className="mt-8 lg:mt-10">
            {stages.map((s, i) => {
              const Icon = STAGE_ICONS[s.icon];
              const on = active === s.target;
              return (
                <li
                  key={s.number}
                  className="relative flex gap-5 pb-7 last:pb-0"
                >
                  {/* Tramo que conecta con la etapa siguiente */}
                  {i < stages.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[1.4375rem] top-[3.125rem] bottom-2 w-px bg-sand-200"
                    />
                  )}

                  <button
                    type="button"
                    onMouseEnter={() => setActive(s.target)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(s.target)}
                    onBlur={() => setActive(null)}
                    aria-pressed={on}
                    className="flex cursor-pointer gap-5 text-left"
                  >
                    <span
                      className={`relative z-10 grid size-[2.875rem] shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                        on
                          ? "border-coral-500 bg-coral-50 text-coral-600"
                          : "border-sand-200 bg-ivory text-graphite-500"
                      }`}
                      aria-hidden
                    >
                      <Icon weight="light" className="size-5" />
                    </span>

                    <span className="min-w-0 pt-1">
                      <span className="flex items-baseline gap-3">
                        <span className="font-accent text-[1.0625rem] font-medium not-italic tabular text-coral-600">
                          {s.number}
                        </span>
                        <span
                          className={`font-accent text-[1.375rem] font-medium not-italic transition-colors duration-300 ${
                            on ? "text-petrol-950" : "text-petrol-900"
                          }`}
                        >
                          {s.title}
                        </span>
                      </span>
                      <span className="mt-1 block text-[0.8125rem] leading-relaxed text-graphite-600">
                        {s.text}
                      </span>
                      <span
                        aria-hidden
                        className={`mt-2 block h-px rounded-full bg-coral-500 transition-all duration-500 ease-[var(--ease-out-soft)] ${
                          on ? "w-14 opacity-100" : "w-0 opacity-0"
                        }`}
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>

          <motion.div variants={V.item} className="mt-8">
            <Link
              href="/hoteles"
              className="group inline-flex items-center gap-3 border-b border-coral-500/40 pb-1.5 text-sm font-semibold text-coral-700 transition-colors hover:border-coral-500"
            >
              Ver más hoteles
              <ArrowRightIcon
                className="size-4 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </motion.div>
        </div>

        {/* ── Composición fotográfica ────────────────────────────── */}
        <motion.div variants={V.photos} className="relative lg:h-auto">
          <div className="relative h-[30rem] sm:h-[36rem] lg:absolute lg:inset-0 lg:h-auto">
            {/* Suite: manda, ocupa la franja superior */}
            <div
              className="absolute inset-x-0 top-0 h-[53%] overflow-hidden"
              style={{ clipPath: CLIP.room }}
            >
              <Image
                src={photos.room}
                alt={photos.roomAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 69vw"
                quality={80}
                className={`object-cover ${photoClass("room")}`}
              />
            </div>

            {/* Terraza y piscina comparten la franja inferior */}
            <div
              className="absolute inset-x-0 bottom-0 top-[50%] overflow-hidden"
              style={{ clipPath: CLIP.terrace }}
            >
              <div className="flex h-full">
                <div className="relative h-full w-[50%] shrink-0 overflow-hidden">
                  <Image
                    src={photos.terrace}
                    alt={photos.terraceAlt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 35vw"
                    quality={80}
                    className={`object-cover ${photoClass("terrace")}`}
                  />
                </div>
                <div
                  className="relative -ml-[8%] h-full w-[58%] shrink-0 overflow-hidden"
                  style={{ clipPath: CLIP.pool }}
                >
                  <Image
                    src={photos.pool}
                    alt={photos.poolAlt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 35vw"
                    quality={80}
                    className={`object-cover ${photoClass("pool")}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ficha: debajo en teléfono, superpuesta al lateral derecho en escritorio */}
          <div className="mt-6 flex justify-center lg:absolute lg:right-6 lg:top-1/2 lg:mt-0 lg:-translate-y-1/2 lg:justify-end xl:right-10">
            <HotelCard hotel={hotel} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
