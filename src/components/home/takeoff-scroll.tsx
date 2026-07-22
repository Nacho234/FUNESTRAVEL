"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { IMG } from "@/data/img";
import { VIDEO } from "@/data/video";
import { SceneMedia } from "@/components/ui/scene-media";

/**
 * Scroll-driven takeoff scene. The whole composition is a pure function of the
 * section's scroll progress (0 → 1): scrolling forward advances the takeoff,
 * stopping freezes it, scrolling back rewinds it. The page scroll is never
 * hijacked; the sticky viewport just stays put while the tall wrapper passes.
 *
 * All layers are driven imperatively from ONE progress subscription (a single
 * source of truth per frame), which keeps every layer consistent even across
 * re-renders.
 *
 * Timeline (progress):
 *  0.00 – 0.50  runway at dusk, camera pushes in (preparation → acceleration)
 *  0.42 – 0.75  rotation: wheels leave the strip over the runway lights
 *  0.70 – 1.00  the plane continues through the clouds toward the horizon,
 *               handing off into the destinations section
 */

/** Piecewise-linear map with clamping, mirroring Motion's useTransform. */
function ramp(p: number, stops: number[], values: number[]): number {
  if (p <= stops[0]) return values[0];
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i]) {
      const t = (p - stops[i - 1]) / (stops[i] - stops[i - 1]);
      return values[i - 1] + t * (values[i] - values[i - 1]);
    }
  }
  return values[values.length - 1];
}

const microWords = ["Elegí.", "Reservá.", "Viajá."];

function StaticFallback() {
  return (
    <section aria-label="El despegue de tu próximo viaje" className="relative">
      <div className="relative min-h-[70dvh] overflow-hidden">
        <Image
          src={IMG.takeoffFlight}
          alt="Avión en pleno vuelo sobre un mar de nubes doradas al amanecer"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-petrol-950/50 via-petrol-950/20 to-ivory" aria-hidden />
        <div className="relative mx-auto flex min-h-[70dvh] max-w-7xl flex-col items-start justify-center px-4 sm:px-6 py-20">
          <h2 className="max-w-xl font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Tu próxima historia ya está en movimiento.
          </h2>
          <p className="mt-3 max-w-md text-white/85">Elegí el destino. Nosotros nos ocupamos de acompañarte en cada etapa.</p>
          <Link
            href="#destinos"
            className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-6 py-3 font-semibold text-white hover:bg-coral-600 transition-colors"
          >
            Explorar destinos <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function TakeoffScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const sceneA = useRef<HTMLDivElement>(null);
  const sceneB = useRef<HTMLDivElement>(null);
  const sceneC = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const text1 = useRef<HTMLDivElement>(null);
  const text2 = useRef<HTMLDivElement>(null);
  const text3 = useRef<HTMLDivElement>(null);
  const exit = useRef<HTMLDivElement>(null);
  const words = useRef<(HTMLSpanElement | null)[]>([]);

  const apply = useCallback((p: number) => {
    const set = (el: HTMLElement | null, opacity: number, transform: string, interactive = false) => {
      if (!el) return;
      el.style.opacity = String(opacity);
      el.style.transform = transform;
      if (interactive) el.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
    };

    /* Scene A: preparation → acceleration (camera push-in) */
    const aOpacity = ramp(p, [0, 0.42, 0.55], [1, 1, 0]);
    set(
      sceneA.current,
      aOpacity,
      `translateX(${ramp(p, [0, 0.5], [0, -3])}%) scale(${ramp(p, [0, 0.5], [1, 1.28])})`,
    );

    /* Scene B: wheels off the runway */
    const bOpacity = ramp(p, [0.42, 0.53, 0.68, 0.78], [0, 1, 1, 0]);
    set(
      sceneB.current,
      bOpacity,
      `translateY(${ramp(p, [0.42, 0.78], [5, -4])}%) scale(${ramp(p, [0.42, 0.78], [1.18, 1])})`,
    );

    /* Scene C: above the clouds */
    const cOpacity = ramp(p, [0.7, 0.82], [0, 1]);
    set(
      sceneC.current,
      cOpacity,
      `translateY(${ramp(p, [0.7, 1], [4, 0])}%) scale(${ramp(p, [0.7, 1], [1.12, 1])})`,
    );

    /* Atmospheric veil masking the B → C cut */
    set(veil.current, ramp(p, [0.64, 0.73, 0.84], [0, 0.9, 0]), "none");

    /* Copy */
    set(text1.current, ramp(p, [0.03, 0.1, 0.26, 0.34], [0, 1, 1, 0]), `translateY(${ramp(p, [0.03, 0.34], [24, -24])}px)`);
    set(text2.current, ramp(p, [0.52, 0.61, 0.72, 0.8], [0, 1, 1, 0]), `translateY(${ramp(p, [0.52, 0.8], [28, -20])}px)`);
    set(text3.current, ramp(p, [0.84, 0.93], [0, 1]), `translateY(${ramp(p, [0.84, 0.93], [24, 0])}px)`, true);

    microWords.forEach((_, i) => {
      const start = 0.24 + i * 0.06;
      set(words.current[i], ramp(p, [start, start + 0.05, 0.46, 0.53], [0, 1, 1, 0]), `translateY(${ramp(p, [start, start + 0.05], [12, 0])}px)`);
    });

    /* Exit haze: only as the user leaves the scroll section */
    set(exit.current, ramp(p, [0.9, 1], [0, 1]), "none");

  }, []);

  useMotionValueEvent(scrollYProgress, "change", apply);

  // The clips are tiny (<300 KB each), so all three just autoplay and loop; the
  // scroll only drives the crossfade/transform on top. This observer keeps them
  // playing whenever the section is on screen (covering the muted-autoplay race
  // inside a tall sticky section) and pauses them all when it scrolls away, so
  // nothing decodes off screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        for (const r of [sceneA, sceneB, sceneC]) {
          const v = r.current?.querySelector("video");
          if (!v) continue;
          if (entry.isIntersecting) {
            if (v.paused) void v.play().catch(() => {});
          } else if (!v.paused) {
            v.pause();
          }
        }
      },
      { threshold: 0.02 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The reduced-motion fallback swaps in after mount: SSR always renders the
  // animated tree, so server and client HTML match.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-hydration swap
    setMounted(true);
  }, []);

  if (mounted && reduce) return <StaticFallback />;

  return (
    <section ref={ref} aria-label="El despegue de tu próximo viaje" className="relative h-[170vh] md:h-[240vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-petrol-950">
        {/* Scene A: preparation on the runway */}
        <div ref={sceneA} className="absolute inset-0 will-change-transform">
          <SceneMedia
            img="/images/takeoff-airport-poster.jpg"
            video={VIDEO.takeoffAirport}
            alt="Avión en la plataforma de un aeropuerto al atardecer, listo para salir"
            quality={70}
            preload="auto"
            className="object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-petrol-950/45 via-transparent to-petrol-950/55" aria-hidden />
        </div>

        {/* Scene B: rotation, wheels leaving the strip */}
        <div ref={sceneB} className="absolute inset-0 will-change-transform" style={{ opacity: 0 }}>
          <SceneMedia
            img="/images/takeoff-runway-poster.jpg"
            video={VIDEO.takeoffRunway}
            alt="Avión ganando altura sobre las luces de la pista"
            quality={70}
            preload="auto"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-petrol-950/35 via-transparent to-petrol-950/45" aria-hidden />
        </div>

        {/* Scene C: above the clouds */}
        <div ref={sceneC} className="absolute inset-0 will-change-transform" style={{ opacity: 0 }}>
          <SceneMedia
            img="/images/takeoff-flight-poster.jpg"
            video={VIDEO.takeoffFlight}
            alt="Avión en pleno vuelo sobre un mar de nubes doradas al amanecer"
            quality={70}
            preload="auto"
            className="object-cover object-[32%_center] md:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-petrol-950/25 via-transparent to-transparent" aria-hidden />
        </div>

        {/* Atmospheric veil for the climb-through-clouds moment */}
        <div
          ref={veil}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(250_247_242_/_0.95),rgb(250_247_242_/_0.55)_55%,transparent_80%)]"
          style={{ opacity: 0 }}
          aria-hidden
        />

        {/* Stage 1 copy */}
        <div ref={text1} className="absolute inset-x-0 top-[16%] mx-auto max-w-7xl px-4 sm:px-6" style={{ opacity: 0 }}>
          <h2 className="max-w-lg font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight [text-shadow:0_1px_24px_rgb(8_37_48_/_0.45)]">
            Todo gran viaje empieza con una decisión.
          </h2>
          <p className="mt-3 max-w-sm text-sm sm:text-base text-white/90 [text-shadow:0_1px_16px_rgb(8_37_48_/_0.5)]">
            Elegí el destino. Nosotros nos ocupamos de acompañarte en cada etapa.
          </p>
        </div>

        {/* Acceleration micro copy, editorial and quiet */}
        <div className="absolute bottom-[14%] left-0 right-0 mx-auto hidden max-w-7xl px-6 sm:flex gap-6" aria-hidden>
          {microWords.map((w, i) => (
            <span
              key={w}
              ref={(el) => {
                words.current[i] = el;
              }}
              className="font-display text-lg sm:text-xl font-semibold text-white/90 [text-shadow:0_1px_16px_rgb(8_37_48_/_0.5)]"
              style={{ opacity: 0 }}
            >
              {w}
            </span>
          ))}
        </div>

        {/* Stage 3 copy */}
        <div ref={text2} className="absolute inset-x-0 top-[20%] mx-auto max-w-7xl px-4 sm:px-6" style={{ opacity: 0 }}>
          <h2 className="max-w-lg font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight [text-shadow:0_1px_24px_rgb(8_37_48_/_0.45)]">
            Tu próxima historia ya está en movimiento.
          </h2>
        </div>

        {/* Final handoff */}
        <div
          ref={text3}
          className="absolute inset-x-0 bottom-[18%] mx-auto flex max-w-7xl flex-col items-center px-4 sm:px-6 text-center"
          style={{ opacity: 0, pointerEvents: "none" }}
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white [text-shadow:0_1px_24px_rgb(8_37_48_/_0.45)]">
            ¿Hacia dónde querés ir?
          </h2>
          <Link
            href="#destinos"
            className="mt-5 inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-6 py-3 font-semibold text-white shadow-[var(--shadow-float)] hover:bg-coral-600 transition-colors"
          >
            Explorar destinos <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </div>
        {/* Exit haze: fades in only at the end of the scroll, blending the
            final frame into the next section */}
        <div ref={exit} className="absolute inset-x-0 bottom-0 h-28 md:h-40 bg-gradient-to-b from-transparent via-ivory/45 to-ivory/90" style={{ opacity: 0 }} aria-hidden />
      </div>
    </section>
  );
}
