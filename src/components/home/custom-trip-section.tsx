"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ClockIcon, PencilSimpleLineIcon, UserCircleCheckIcon } from "@phosphor-icons/react";
import { avatar } from "@/data/img";
import { QuoteForm } from "./quote-form";

/**
 * "Viajes a medida": compact editorial pitch on the left, two-step intake card
 * on the right. Dense, low-height section; both columns enter in sequence.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const benefits = [
  { icon: ClockIcon, text: "Propuesta en 24 hs hábiles" },
  { icon: PencilSimpleLineIcon, text: "Ajustes antes de confirmar" },
  { icon: UserCircleCheckIcon, text: "Lo revisa una persona real" },
];

export function CustomTripSection() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ivory to-sand-50">
      {/* Cartographic hint behind the editorial column */}
      <svg
        className="pointer-events-none absolute left-0 top-10 hidden h-40 w-[40%] text-petrol-800/10 lg:block"
        viewBox="0 0 600 160"
        fill="none"
        aria-hidden
      >
        <path d="M-10 135 C 130 45, 300 145, 430 65 S 590 25, 630 60" stroke="currentColor" strokeWidth="1.25" strokeDasharray="1 7" strokeLinecap="round" />
        <circle cx="180" cy="93" r="2.5" fill="currentColor" />
        <circle cx="430" cy="65" r="2.5" fill="currentColor" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          {/* Editorial column: dense, no dead air */}
          <motion.div
            variants={reduce ? undefined : container}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p
              variants={reduce ? undefined : item}
              className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-graphite-500"
            >
              <span className="h-px w-6 bg-coral-500/70" aria-hidden />
              Viajes a medida
            </motion.p>

            <motion.h2
              variants={reduce ? undefined : item}
              className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-petrol-900"
            >
              ¿No encontraste el viaje ideal? Lo diseñamos con vos.
            </motion.h2>

            <motion.p variants={reduce ? undefined : item} className="mt-3 max-w-md leading-relaxed text-graphite-600">
              Contanos lo básico y te enviamos una primera propuesta real para empezar.
            </motion.p>

            <motion.ul variants={reduce ? undefined : item} className="mt-6 flex max-w-lg flex-wrap gap-x-7 gap-y-3">
              {benefits.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-sm font-semibold text-graphite-700">
                  <span className="grid size-7 place-items-center rounded-full bg-teal-50 text-teal-600">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {text}
                </li>
              ))}
            </motion.ul>

            <motion.div
              variants={reduce ? undefined : item}
              className="mt-6 inline-flex items-center gap-3 rounded-full border border-sand-200 bg-white py-1.5 pl-1.5 pr-4"
            >
              <Image src={avatar(20)} alt="" width={30} height={30} className="rounded-full" />
              <p className="text-sm text-graphite-600">
                <span className="font-semibold text-petrol-900">Respuesta humana</span>, no automática.
              </p>
            </motion.div>
          </motion.div>

          {/* Two-step intake card */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.2, ease: EASE }}
          >
            <QuoteForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
