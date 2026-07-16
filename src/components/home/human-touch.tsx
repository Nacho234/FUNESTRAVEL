"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { IMG } from "@/data/img";

/**
 * Secondary cinematic hero: an immersive human travel scene with strong
 * vertical parallax (the portrait photo has plenty of hidden height, the
 * foreground stays almost still), a petrol scrim for legibility and a minimal
 * left-aligned copy block. Collapses to a static composition under
 * prefers-reduced-motion.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(3px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: EASE } },
};

const highlights = [
  "Atención humana de principio a fin",
  "Seguimiento antes y durante el viaje",
  "Respuesta real ante cambios e imprevistos",
  "Equipo local con experiencia en cada salida",
];

export function HumanTouch() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduce = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- post-hydration environment sync
    setMounted(true);
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  const reduce = mounted && prefersReduce;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Strong background travel, gentler on mobile; foreground almost still.
  const range = isMobile ? 10 : 18;
  const bgY = useTransform(scrollYProgress, [0, 1], [`-${range * 0.35}%`, `${range * 0.65}%`]);
  const mistY = useTransform(scrollYProgress, [0, 1], ["9%", "-9%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  return (
    <section
      ref={ref}
      className="relative flex h-[68vh] min-h-[480px] items-end overflow-hidden bg-petrol-950 md:h-[74vh]"
      aria-label="Acompañamiento real durante todo el viaje"
    >
      {/* Background: oversized so the parallax has real travel */}
      <motion.div
        style={reduce ? undefined : { y: bgY }}
        className="absolute -inset-y-[16%] inset-x-0 will-change-transform"
      >
        <Image
          src={IMG.humanScene}
          alt="Viajera recorriendo a pie un callejón de una ciudad europea"
          fill
          sizes="100vw"
          quality={70}
          className="object-cover object-[center_42%]"
        />
      </motion.div>

      {/* Drifting warm light layer */}
      <motion.div
        style={reduce ? undefined : { y: mistY }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_20%,rgb(238_215_180/0.22),transparent_70%)]"
        aria-hidden
      />

      {/* Legibility scrims: from the left and up from the bottom */}
      <div className="absolute inset-0 bg-gradient-to-r from-petrol-950/85 via-petrol-950/45 to-petrol-950/10" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-petrol-950/70 to-transparent" aria-hidden />

      {/* Subtle route detail */}
      <svg
        className="pointer-events-none absolute bottom-8 right-8 hidden w-48 text-white/25 lg:block"
        viewBox="0 0 200 60"
        fill="none"
        aria-hidden
      >
        <path d="M4 48 C 60 10, 120 55, 196 18" stroke="currentColor" strokeWidth="1.25" strokeDasharray="1 6" strokeLinecap="round" />
        <circle cx="4" cy="48" r="2.5" fill="currentColor" />
        <circle cx="196" cy="18" r="2.5" fill="currentColor" />
        <text x="120" y="52" className="fill-current" fontSize="8" letterSpacing="1.5">
          32.91° S · 60.81° O
        </text>
      </svg>

      {/* Content */}
      <motion.div
        style={reduce ? undefined : { y: contentY }}
        variants={reduce ? undefined : container}
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        className="relative mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 md:pb-16"
      >
        <motion.p
          variants={reduce ? undefined : item}
          className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-teal-100"
        >
          <span className="h-px w-6 bg-teal-100/70" aria-hidden />
          Acompañamiento real
        </motion.p>

        <motion.h2
          variants={reduce ? undefined : item}
          className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight leading-tight text-white sm:text-4xl lg:text-5xl [text-shadow:0_1px_24px_rgb(8_37_48_/_0.5)]"
        >
          Reservás online, pero nunca viajás solo
        </motion.h2>

        <motion.p
          variants={reduce ? undefined : item}
          className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-white/90 [text-shadow:0_1px_14px_rgb(8_37_48_/_0.55)]"
        >
          Detrás de cada propuesta hay un equipo que revisa, organiza y acompaña cada etapa del viaje.
        </motion.p>

        {/* Highlights as one elegant attribute line, not cards */}
        <motion.ul
          variants={reduce ? undefined : item}
          className="mt-6 grid max-w-xl gap-x-8 gap-y-2.5 text-sm text-white/85 sm:grid-cols-2"
        >
          {highlights.map((h) => (
            <li
              key={h}
              className="cursor-default border-l border-teal-100/40 pl-3 leading-snug transition-colors duration-200 hover:border-teal-100 hover:text-white"
            >
              {h}
            </li>
          ))}
        </motion.ul>

        <motion.div variants={reduce ? undefined : item} className="mt-7 flex flex-wrap items-center gap-4">
          <a
            href="https://wa.me/5493415550123?text=Hola,%20me%20gustar%C3%ADa%20hablar%20con%20un%20asesor%20para%20organizar%20un%20viaje."
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-6 py-3 text-[0.9375rem] font-bold text-white transition-all duration-200 hover:bg-coral-600 hover:brightness-105"
          >
            Hablá con un asesor
            <ArrowRightIcon weight="bold" className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
          </a>
          <Link
            href="/nosotros"
            className="text-sm font-semibold text-white/90 underline decoration-white/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            Conocé cómo trabajamos
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
