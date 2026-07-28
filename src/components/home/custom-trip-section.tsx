"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ClockIcon, PencilSimpleLineIcon, UserIcon } from "@phosphor-icons/react";
import { CustomTripForm } from "./custom-trip-form";

/**
 * "Viajes a medida": editorial pitch on the left, intake card on the right,
 * over plain white.
 *
 * The landscape at the bottom left is decoration, not content: it is masked
 * into the background on two axes, sits behind everything with pointer events
 * off and does not move. The dashed route and the plane are part of the
 * artwork, nothing is redrawn in CSS. Swap the artwork with the
 * `backgroundDecorationImage` prop.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const benefits = [
  {
    icon: ClockIcon,
    title: "Propuesta en 24 hs hábiles",
    text: "Te enviamos una primera propuesta real y concreta.",
  },
  {
    icon: PencilSimpleLineIcon,
    title: "Ajustes antes de confirmar",
    text: "Adaptamos cada detalle hasta que sea perfecto para vos.",
  },
  {
    icon: UserIcon,
    title: "Respuesta humana, no automática",
    text: "Te acompaña un asesor real durante todo el proceso.",
  },
];

export function CustomTripSection({
  backgroundDecorationImage = "/images/custom-trip-route.webp",
}: {
  backgroundDecorationImage?: string;
}) {
  const reduce = useReducedMotion() ?? false;

  return (
    <section aria-labelledby="custom-trip-heading" className="relative overflow-hidden bg-white">
      {/* Contour texture, barely there, top center */}
      <svg
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-56 w-[70%] -translate-x-1/2 text-petrol-900/[0.055]"
        viewBox="0 0 900 220"
        fill="none"
        preserveAspectRatio="none"
      >
        {[0, 26, 52, 78, 104, 130].map((offset) => (
          <path
            key={offset}
            d={`M-20 ${40 + offset} C 150 ${-10 + offset}, 300 ${90 + offset}, 460 ${45 + offset} S 760 ${-5 + offset}, 920 ${55 + offset}`}
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        ))}
      </svg>

      {/* Route decoration: bottom strip on small screens, bottom-left field on desktop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 sm:h-48 lg:inset-x-auto lg:left-0 lg:h-auto lg:w-[62%] xl:w-[58%]"
      >
        {/* No mask and no blend: the artwork's white matches the section, and a
            fade would clip the plane at the end of the route. */}
        <div className="relative h-full w-full lg:aspect-[1400/788]">
          <Image
            src={backgroundDecorationImage}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 62vw"
            className="object-cover object-left-bottom"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-[88rem] px-4 py-24 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[44fr_56fr] lg:gap-16 xl:gap-20">
          {/* ── Editorial column ───────────────────────────────────── */}
          <motion.div
            className="min-w-0"
            variants={reduce ? undefined : container}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={reduce ? undefined : item}>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-coral-600">
                Tu próximo viaje, diseñado para vos
              </p>
              <span className="mt-3 block h-px w-10 bg-coral-500/60" aria-hidden />
            </motion.div>

            <motion.h2
              id="custom-trip-heading"
              variants={reduce ? undefined : item}
              className="mt-6 max-w-[15ch] pb-1 font-display text-[2.375rem] font-bold leading-[1.08] tracking-tight text-petrol-900 sm:text-5xl xl:text-[3.375rem]"
            >
              Contanos tu idea, nosotros la hacemos{" "}
              <em className="font-accent text-[1.12em] font-medium text-coral-600">realidad.</em>
            </motion.h2>

            <motion.p
              variants={reduce ? undefined : item}
              className="mt-5 max-w-[46ch] leading-relaxed text-graphite-600"
            >
              Completá los datos y recibí una propuesta personalizada de nuestro equipo en menos de
              24 horas hábiles.
            </motion.p>

            <motion.ul variants={reduce ? undefined : item} className="mt-10 grid gap-6">
              {benefits.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-4">
                  <span
                    className="grid size-11 shrink-0 place-items-center rounded-full border border-coral-500/25 text-coral-600"
                    aria-hidden
                  >
                    <Icon weight="light" className="size-5" />
                  </span>
                  <div className="min-w-0 pt-1.5">
                    <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-petrol-900">
                      {title}
                    </h3>
                    <p className="mt-1 max-w-[38ch] text-sm leading-relaxed text-graphite-600">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ── Intake card ────────────────────────────────────────── */}
          <motion.div
            className="min-w-0"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            <CustomTripForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
