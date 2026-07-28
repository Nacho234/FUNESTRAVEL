"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { VIDEO } from "@/data/video";
import { SceneMedia } from "@/components/ui/scene-media";

/**
 * The takeoff sequence as a single pinned stage: three video scenes
 * (airport → runway → clouds) that cross-dissolve into one another as the
 * visitor scrolls, each with its own copy. The clips just play and loop
 * (handled by SceneMedia); scroll only drives a clean opacity cross-fade —
 * no zooming or scrubbing of the footage itself.
 */
export function TakeoffScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Short cross-fades; only one scene is fully visible at a time.
  const o1 = useTransform(scrollYProgress, [0, 0.3, 0.37], [1, 1, 0]);
  const o2 = useTransform(scrollYProgress, [0.33, 0.4, 0.62, 0.69], [0, 1, 1, 0]);
  const o3 = useTransform(scrollYProgress, [0.65, 0.73, 1], [0, 1, 1]);

  return (
    <section ref={ref} aria-label="El despegue de tu próximo viaje" className="relative h-[300vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-petrol-950">
        {/* Scene 1 — the decision */}
        <motion.div style={{ opacity: o1 }} className="absolute inset-0">
          <SceneMedia
            img="/images/takeoff-airport-poster.jpg"
            video={VIDEO.takeoffAirport}
            alt="Avión en la plataforma de un aeropuerto al atardecer, listo para salir"
            quality={70}
            priority
            preload="auto"
            className="object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-petrol-950/55 via-petrol-950/20 to-petrol-950/55" aria-hidden />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
              <h2 className="max-w-xl font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white [text-shadow:0_1px_24px_rgb(8_37_48_/_0.5)]">
                Todo gran viaje empieza con una decisión.
              </h2>
              <p className="mt-4 max-w-md text-base sm:text-lg leading-relaxed text-white/90 [text-shadow:0_1px_16px_rgb(8_37_48_/_0.55)]">
                Elegí el destino. Nosotros nos ocupamos de acompañarte en cada etapa.
              </p>
              <div className="mt-7 flex gap-6 font-display text-lg sm:text-xl font-semibold text-white/90 [text-shadow:0_1px_16px_rgb(8_37_48_/_0.5)]">
                <span>Elegí.</span>
                <span>Reservá.</span>
                <span>Viajá.</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scene 2 — in motion */}
        <motion.div style={{ opacity: o2 }} className="absolute inset-0">
          <SceneMedia
            img="/images/takeoff-runway-poster.jpg"
            video={VIDEO.takeoffRunway}
            alt="Avión ganando altura sobre las luces de la pista"
            quality={70}
            preload="auto"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-petrol-950/50 via-petrol-950/15 to-petrol-950/50" aria-hidden />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
              <h2 className="max-w-xl font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white [text-shadow:0_1px_24px_rgb(8_37_48_/_0.5)]">
                Tu próxima historia ya está en movimiento.
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Scene 3 — the invitation */}
        <motion.div style={{ opacity: o3 }} className="absolute inset-0">
          <SceneMedia
            img="/images/takeoff-flight-poster.jpg"
            video={VIDEO.takeoffFlight}
            alt="Avión en pleno vuelo sobre un mar de nubes doradas al amanecer"
            quality={70}
            preload="auto"
            className="object-cover object-[32%_center] md:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-petrol-950/40 via-transparent to-ivory/85" aria-hidden />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center sm:px-6">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white [text-shadow:0_1px_24px_rgb(8_37_48_/_0.5)]">
                ¿Hacia dónde querés ir?
              </h2>
              <Link
                href="#destinos"
                className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-6 py-3 font-semibold text-white shadow-[var(--shadow-float)] transition-colors hover:bg-coral-600"
              >
                Explorar destinos <ArrowRightIcon className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
