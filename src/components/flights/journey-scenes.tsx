"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * "De la pista al destino": tres momentos del viaje en una sola composición
 * panorámica.
 *
 * Sólo fotografía, sin clips: el peso de la página manda. La escena bajo el
 * cursor se acerca apenas, se aclara su velo y su línea coral crece; las otras
 * dos retroceden. Nada de controles ni de botón de play.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

interface Scene {
  number: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
}

const scenes: Scene[] = [
  {
    number: "01",
    title: "En tierra",
    text: "Preparamos cada detalle antes de tu viaje.",
    image: "/images/journey-ground.webp",
    imageAlt: "Avión en pista al atardecer, con el sol reflejado en el asfalto mojado",
  },
  {
    number: "02",
    title: "Despegue",
    text: "Gestionamos cada etapa para que todo salga bien.",
    image: "/images/journey-takeoff.webp",
    imageAlt: "Avión despegando de la pista al atardecer",
  },
  {
    number: "03",
    title: "En vuelo",
    text: "Seguimos disponibles ante cualquier cambio o imprevisto.",
    image: "/images/journey-inflight.webp",
    imageAlt: "Ala del avión sobre un mar de nubes al amanecer",
  },
];

/* Ver la nota en human-touch.tsx: las variantes se pasan siempre y es `hidden`
   la que iguala el reposo bajo reduced motion. */
function buildVariants(reduce: boolean) {
  return {
    container: { hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : 0.08 } } },
    item: {
      hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
      visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.55, ease: EASE } },
    },
  } satisfies Record<string, Variants>;
}

export function JourneyScenes() {
  const reduce = useReducedMotion() ?? false;
  const V = buildVariants(reduce);
  /** null = ninguna escena señalada: las tres se ven por igual. */
  const [active, setActive] = useState<number | null>(null);

  return (
    <section aria-labelledby="journey-scenes-heading" className="bg-ivory">
      <motion.div
        className="mx-auto max-w-[105rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-20"
        variants={V.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* Encabezado */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            variants={V.item}
            className="text-[0.6875rem] font-bold uppercase tracking-[0.26em] text-coral-600"
          >
            Cada etapa, acompañada
          </motion.p>
          <motion.h2
            id="journey-scenes-heading"
            variants={V.item}
            className="mx-auto mt-4 max-w-[22ch] font-display text-[2rem] font-bold leading-[1.1] tracking-tight text-petrol-900 sm:text-[2.5rem] lg:text-[2.875rem]"
          >
            De la pista al destino, con vos en cada paso
          </motion.h2>
          <motion.p variants={V.item} className="mt-4 leading-relaxed text-graphite-600">
            Te acompañamos antes, durante y después de tu viaje.
          </motion.p>
        </div>

        {/* Escenario: tres paneles contiguos, sin separación visible */}
        <motion.div
          variants={V.item}
          onMouseLeave={() => setActive(null)}
          className="mt-12 flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-petrol-950 md:h-[clamp(600px,58vw,760px)] md:flex-row md:gap-px lg:mt-14"
        >
          {scenes.map((s, i) => {
            const on = active === i;
            const dimmed = active !== null && !on;
            return (
              <div
                key={s.title}
                /* h-full, no flex-1: dentro del panel no hay contexto flex y se
                   quedaría sin altura. */
                className="group relative isolate h-[22rem] overflow-hidden md:h-full md:flex-1"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                aria-label={`${s.title}. ${s.text}`}
              >
                <Image
                  src={s.image}
                  alt={s.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 34vw"
                  quality={80}
                  className={`object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] ${
                    on ? "scale-[1.05]" : "scale-100"
                  }`}
                />

                {/* Velo de legibilidad: se aclara sobre la escena señalada y se
                    espesa sobre las otras, para que una sola lleve la mirada. */}
                <div
                  aria-hidden
                  className={`absolute inset-0 bg-gradient-to-t from-petrol-950 via-petrol-950/45 via-45% to-petrol-950/15 transition-opacity duration-500 ${
                    on ? "opacity-80" : dimmed ? "opacity-100" : "opacity-95"
                  }`}
                />

                <div className="relative flex h-full flex-col justify-between p-6 lg:p-8">
                  <p className="font-display text-[0.8125rem] font-bold tabular tracking-[0.2em] text-white/55">
                    {s.number}
                  </p>

                  <div>
                    <span
                      aria-hidden
                      className={`block h-[3px] rounded-full bg-coral-500 transition-all duration-500 ease-[var(--ease-out-soft)] ${
                        on ? "w-16" : "w-8"
                      }`}
                    />
                    <h3 className="mt-4 font-display text-[1.5rem] font-bold leading-tight tracking-tight text-white lg:text-[1.75rem]">
                      {s.title}
                    </h3>
                    <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-white/75">
                      {s.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.p
          variants={V.item}
          className="mx-auto mt-8 max-w-[52ch] text-center text-sm leading-relaxed text-graphite-500"
        >
          Un mismo equipo detrás de cada tramo, desde que reservás hasta que volvés.
        </motion.p>
      </motion.div>
    </section>
  );
}
