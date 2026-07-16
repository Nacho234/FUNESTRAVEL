import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BankIcon,
  CalendarCheckIcon,
  CheckIcon,
  CreditCardIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { ShowcasePromo } from "@/lib/types";
import { commercialBenefits, promoShowcase } from "@/data/content";
import { formatDate, formatMoney } from "@/lib/format";
import { Reveal } from "@/components/ui/reveal";

/**
 * Home promotions showcase: one editorial hero, two distinct secondary pieces
 * and an integrated commercial-benefits strip. Fully driven by the data in
 * `promoShowcase` / `commercialBenefits` (content.ts): the section renders
 * whatever is active there, ordered by priority.
 */

function installmentAmount(promo: ShowcasePromo): string | null {
  if (!promo.installmentsCount || !promo.priceFrom) return null;
  const amount = promo.priceFrom.amount / promo.installmentsCount;
  return `${promo.installmentsCount} cuotas de ${promo.priceFrom.currency} ${new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

/* ─────────────────────────── hero piece ──────────────────────────── */

function HeroPromo({ promo }: { promo: ShowcasePromo }) {
  const installment = installmentAmount(promo);
  return (
    <article className="group relative flex w-full min-h-[540px] lg:min-h-[580px] flex-col justify-between overflow-hidden rounded-[var(--radius-card)]">
      <Image
        src={promo.image!}
        alt={`${promo.title}: ${promo.destination}`}
        fill
        sizes="(max-width: 1024px) 100vw, 62vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      {/* Controlled scrims only where the copy sits */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-petrol-950/55 to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-petrol-950/85 via-petrol-950/35 to-transparent transition-opacity duration-500 group-hover:opacity-95" aria-hidden />

      <div className="relative flex items-start justify-between gap-3 p-6 sm:p-8">
        <span className="rounded-full bg-white/95 px-3.5 py-1.5 text-sm font-bold text-petrol-900 backdrop-blur">
          {promo.badge}
        </span>
        <span className="rounded-full bg-petrol-950/40 px-3 py-1.5 text-xs font-medium text-white/95 backdrop-blur">
          Válida hasta el {formatDate(promo.validUntil)}
        </span>
      </div>

      <div className="relative p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-100">{promo.title}</p>
        <h3 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          {promo.destination}
        </h3>
        <p className="mt-2 max-w-md text-sm sm:text-base text-white/90">{promo.includes}</p>

        <div className="mt-5 flex flex-wrap items-end gap-x-10 gap-y-4">
          {promo.priceFrom && (
            <div>
              <p className="text-sm text-white/75">Desde</p>
              <p className="font-display text-4xl sm:text-5xl font-bold text-white tabular leading-none">
                {formatMoney(promo.priceFrom)}
              </p>
              <p className="mt-1.5 text-xs text-white/75">Por persona en base doble</p>
              {installment && <p className="mt-1 text-sm font-semibold text-teal-100 tabular">{installment}</p>}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={promo.ctaHref}
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-6 py-3 text-[0.9375rem] font-bold text-white transition-colors hover:bg-coral-600"
            >
              {promo.ctaLabel}
              <ArrowRightIcon weight="bold" className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            {promo.secondaryCtaLabel && promo.secondaryCtaHref && (
              <Link
                href={promo.secondaryCtaHref}
                className="rounded-[var(--radius-control)] px-4 py-3 text-sm font-semibold text-white/95 underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
              >
                {promo.secondaryCtaLabel}
              </Link>
            )}
          </div>
        </div>
        {promo.availabilityNote && (
          <p className="mt-4 text-xs text-white/70">{promo.availabilityNote}</p>
        )}
      </div>
    </article>
  );
}

/* ──────────────────────── secondary pieces ───────────────────────── */

function PhotoPromo({ promo }: { promo: ShowcasePromo }) {
  return (
    <article className="group flex flex-1 overflow-hidden rounded-[var(--radius-card)] border border-sand-200 bg-sand-50 transition-colors hover:border-teal-500/50">
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-warning-100 px-2.5 py-1 text-xs font-bold text-warning-700">{promo.badge}</span>
        </div>
        <h3 className="mt-3 font-display text-xl font-bold text-petrol-900 leading-snug">
          <Link href={promo.ctaHref} className="after:absolute after:inset-0">
            {promo.title}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm text-graphite-600">{promo.description}</p>
        {promo.facts && (
          <ul className="mt-3 space-y-1">
            {promo.facts.map((f) => (
              <li key={f} className="flex items-center gap-1.5 text-xs text-graphite-600">
                <CheckIcon weight="bold" className="size-3 text-teal-600" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-4">
          {promo.priceFrom && (
            <p className="text-sm text-graphite-500">
              Desde{" "}
              <span className="font-display text-2xl font-bold text-petrol-900 tabular">{formatMoney(promo.priceFrom)}</span>
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-teal-600 transition-colors group-hover:text-teal-500">
              {promo.ctaLabel}
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
            {promo.availabilityNote && (
              <span className="flex items-center gap-1 whitespace-nowrap text-xs font-medium text-coral-700">
                <UsersThreeIcon className="size-3.5" aria-hidden />
                {promo.availabilityNote}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden w-32 shrink-0 sm:block lg:w-36">
        <Image
          src={promo.image!}
          alt=""
          fill
          sizes="144px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
    </article>
  );
}

function TypographicPromo({ promo }: { promo: ShowcasePromo }) {
  return (
    <article className="group relative flex flex-1 flex-col overflow-hidden rounded-[var(--radius-card)] bg-petrol-900 p-5 sm:p-6 transition-colors hover:bg-petrol-800">
      {/* Small photographic cutout, not decoration: it names the destination */}
      <div className="absolute right-0 top-0 h-full w-24 opacity-45 sm:w-28" aria-hidden>
        <Image src={promo.image!} alt="" fill sizes="112px" className="object-cover [mask-image:linear-gradient(to_left,black,transparent)]" />
      </div>
      <div className="relative">
        <span className="rounded-full bg-coral-500 px-2.5 py-1 text-xs font-bold text-white">{promo.badge}</span>
        <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-ivory leading-snug">
          <Link href={promo.ctaHref} className="after:absolute after:inset-0">
            {promo.title}
          </Link>
        </h3>
        <p className="mt-1.5 max-w-[16rem] text-sm text-petrol-100/85">{promo.description}</p>
        <div className="mt-4 flex items-baseline gap-2">
          {promo.priceFrom && (
            <>
              <span className="font-display text-3xl font-bold text-ivory tabular">{formatMoney(promo.priceFrom)}</span>
              <span className="text-xs text-petrol-100/70">{promo.includes}</span>
            </>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-coral-100 transition-colors group-hover:text-white">
            {promo.ctaLabel}
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
          {promo.availabilityNote && <span className="text-xs text-petrol-100/70">{promo.availabilityNote}</span>}
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────── benefits strip ──────────────────────────── */

const benefitIcons = [BankIcon, CreditCardIcon, CalendarCheckIcon];

function BenefitsStrip() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] bg-petrol-950 text-ivory">
      <ul className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {commercialBenefits.map((b, i) => {
          const Icon = benefitIcons[i % benefitIcons.length];
          return (
            <li key={b.id} className="flex items-start gap-3.5 px-6 py-5">
              <Icon className="mt-0.5 size-5 shrink-0 text-teal-100" aria-hidden />
              <div>
                <p className="font-semibold">{b.title}</p>
                <p className="mt-0.5 text-sm leading-snug text-petrol-100/75">{b.detail}</p>
                <Link href={b.linkHref} className="mt-1.5 inline-block text-xs font-semibold text-teal-100 hover:text-white transition-colors">
                  {b.linkLabel}
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ─────────────────────────── section ─────────────────────────────── */

export function PromotionsShowcase() {
  const active = promoShowcase.filter((p) => p.active).sort((a, b) => a.priority - b.priority);
  const hero = active.find((p) => p.layout === "hero");
  const secondaries = active.filter((p) => p.layout !== "hero").slice(0, 2);

  if (!hero && secondaries.length === 0) return null;

  return (
    <section className="bg-sand-50 border-y border-sand-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900 leading-tight">
                Una buena oportunidad también puede ser el comienzo del viaje.
              </h2>
              <p className="mt-2 text-graphite-600">
                Fechas seleccionadas, financiación y beneficios reales para viajar con todo claro desde el principio.
              </p>
              <p className="mt-1 text-xs text-graphite-500">Precios, vigencia y condiciones visibles antes de reservar.</p>
            </div>
            <Link
              href="/promociones"
              className="group hidden items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-500 lg:flex"
            >
              Ver todas las promociones
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.85fr_1fr]">
          {hero && (
            <Reveal className="flex">
              <div className="relative flex w-full">
                <HeroPromo promo={hero} />
              </div>
            </Reveal>
          )}
          <div className="flex flex-col gap-5 md:max-lg:grid md:max-lg:grid-cols-2">
            {secondaries.map((promo, i) => (
              <Reveal key={promo.id} delay={0.12 + i * 0.08} className="relative flex flex-1">
                {promo.layout === "secondary-photo" ? <PhotoPromo promo={promo} /> : <TypographicPromo promo={promo} />}
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.28}>
          <div className="mt-5">
            <BenefitsStrip />
          </div>
        </Reveal>

        <p className="mt-4 text-center text-sm lg:hidden">
          <Link href="/promociones" className="font-semibold text-teal-600">
            Ver todas las promociones
          </Link>
        </p>
      </div>
    </section>
  );
}
