import Image from "next/image";
import Link from "next/link";
import {
  AirplaneTiltIcon,
  ArrowRightIcon,
  BankIcon,
  CheckCircleIcon,
  HeadsetIcon,
  LockKeyIcon,
  MoonIcon,
  ShieldCheckIcon,
  StarIcon,
  UserFocusIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";
import type {
  FeaturedPromotion,
  FeaturedPromotionFact,
  FeaturedPromotionTerm,
} from "@/lib/types";
import { featuredPromotion } from "@/data/featured-promotion";

/**
 * Banner de la promoción destacada de /promociones.
 *
 * Va entre el aviso celeste y la lista, y comparte con la card de esa misma
 * promo el precio, la vigencia y el `href`: es la misma oferta contada en
 * grande, no una segunda.
 *
 * El borde entre la copia y la foto es una curva real, dibujada con un
 * clipPath de SVG en coordenadas relativas, para evitar el corte recto de un
 * 50/50. Componente de servidor: acá no hay estado ni interacción.
 */

const FACT_ICONS: Record<FeaturedPromotionFact["icon"], React.ComponentType<{ className?: string; weight?: "light" | "regular" | "bold" | "fill" }>> = {
  capitals: BankIcon,
  nights: MoonIcon,
  guided: UserFocusIcon,
  coordination: HeadsetIcon,
};

const TERM_ICONS: Record<FeaturedPromotionTerm["icon"], React.ComponentType<{ className?: string; weight?: "light" | "regular" | "bold" | "fill" }>> = {
  shield: ShieldCheckIcon,
  lock: LockKeyIcon,
  seats: UsersThreeIcon,
  check: CheckCircleIcon,
};

/** Curva que separa la copia de la foto. Sólo se aplica desde lg. */
const CURVE_ID = "featured-promo-curve";

export function FeaturedPromotionBanner({
  promo = featuredPromotion,
}: {
  promo?: FeaturedPromotion;
} = {}) {
  return (
    <section
      aria-labelledby="featured-promo-heading"
      className="overflow-hidden rounded-[var(--radius-card)] bg-ivory shadow-[var(--shadow-lift)]"
    >
      <svg aria-hidden className="absolute size-0" focusable="false">
        <defs>
          <clipPath id={CURVE_ID} clipPathUnits="objectBoundingBox">
            {/* Entra por arriba a la izquierda, se hunde al centro y vuelve */}
            <path d="M0.18,0 C0.06,0.30 0.10,0.66 0.30,1 L1,1 L1,0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative lg:grid lg:grid-cols-[minmax(0,52fr)_minmax(0,48fr)]">
        {/* ── Copia ──────────────────────────────────────────────── */}
        <div className="relative z-10 p-6 sm:p-8 lg:py-10 lg:pl-10 lg:pr-0 xl:py-12 xl:pl-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-coral-500/40 px-3.5 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-coral-600">
            <StarIcon weight="fill" className="size-3.5" aria-hidden />
            {promo.badge}
          </p>

          <h2
            id="featured-promo-heading"
            className="mt-5 max-w-[15ch] font-display text-[2.125rem] font-bold leading-[1.08] tracking-tight text-petrol-900 sm:text-[2.5rem] xl:text-[2.875rem]"
          >
            {promo.title}
          </h2>

          <span aria-hidden className="mt-5 block h-[3px] w-14 rounded-full bg-coral-500" />

          <p className="mt-5 max-w-[34ch] font-semibold leading-relaxed text-petrol-800">
            {promo.subtitle}
          </p>

          <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5">
            {promo.facts.map((f) => {
              const Icon = FACT_ICONS[f.icon];
              return (
                <li key={f.text} className="flex items-center gap-2 text-sm text-graphite-700">
                  <Icon className="size-[1.125rem] shrink-0 text-petrol-700" weight="light" aria-hidden />
                  {f.text}
                </li>
              );
            })}
          </ul>

          <div className="mt-7">
            <p className="text-sm text-graphite-500">Desde</p>
            <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2.5">
              <span className="tabular font-display text-[2rem] font-bold leading-none text-coral-600 sm:text-[2.25rem]">
                {promo.priceFrom}
              </span>
              <span className="text-sm text-graphite-600">{promo.priceSuffix}</span>
            </p>
            <p className="mt-1.5 text-sm text-graphite-500">{promo.priceBasis}</p>
          </div>

          <Link
            href={promo.href}
            className="group mt-6 inline-flex items-center gap-2.5 rounded-[var(--radius-control)] bg-coral-500 px-6 py-3.5 text-[0.9375rem] font-bold text-white transition-colors hover:bg-coral-600 active:translate-y-px"
          >
            {promo.ctaLabel}
            <ArrowRightIcon
              weight="bold"
              className="size-4 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>

        {/* ── Foto ───────────────────────────────────────────────── */}
        <div className="relative h-56 sm:h-72 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[56%]">
          <div className="relative size-full lg:[clip-path:url(#featured-promo-curve)]">
            {/* Dos recortes en vez de una clase armada en runtime: Tailwind sólo
                genera las clases que encuentra escritas en el código. */}
            <Image
              src={promo.imageMobile ?? promo.imageDesktop}
              alt={promo.imageAlt}
              fill
              sizes="100vw"
              quality={78}
              style={{ objectPosition: promo.imagePositionMobile ?? "center" }}
              className="object-cover lg:hidden"
            />
            <Image
              src={promo.imageDesktop}
              alt=""
              fill
              sizes="56vw"
              quality={78}
              style={{ objectPosition: promo.imagePositionDesktop ?? "center" }}
              className="hidden object-cover lg:block"
            />
          </div>

          {/* Sello de vigencia */}
          <div className="absolute right-5 top-5 grid size-[6.5rem] place-items-center rounded-full bg-ivory/95 text-center shadow-[var(--shadow-lift)] backdrop-blur-sm sm:size-[7.5rem] lg:right-8 lg:top-8">
            <div>
              <AirplaneTiltIcon
                weight="fill"
                className="mx-auto size-4 text-coral-500 sm:size-[1.125rem]"
                aria-hidden
              />
              <p className="mt-1 text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-graphite-500">
                {promo.validUntil.label}
              </p>
              <p className="font-display text-[1.0625rem] font-bold leading-tight text-coral-600 sm:text-xl">
                {promo.validUntil.day}
              </p>
              <p className="text-xs text-graphite-600">{promo.validUntil.year}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Franja de condiciones ─────────────────────────────────── */}
      <ul className="relative z-10 grid bg-petrol-900 sm:grid-cols-2 lg:grid-cols-4">
        {promo.terms.map((t, i) => {
          const Icon = TERM_ICONS[t.icon];
          return (
            <li
              key={t.title}
              className={`flex items-start gap-3.5 px-6 py-5 lg:px-7 ${
                i > 0 ? "border-t border-white/12 sm:border-t-0 sm:odd:border-l-0 lg:border-l" : ""
              } ${i === 1 ? "sm:border-l sm:border-white/12" : ""} ${
                i >= 2 ? "sm:border-t sm:border-white/12 lg:border-t-0" : ""
              } ${i > 0 ? "lg:border-l lg:border-white/12" : ""}`}
            >
              <Icon className="mt-0.5 size-6 shrink-0 text-white/85" weight="light" aria-hidden />
              <div className="min-w-0">
                <p className="text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-white">
                  {t.title}
                </p>
                <p className="mt-1 text-[0.8125rem] leading-snug text-white/70">{t.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
