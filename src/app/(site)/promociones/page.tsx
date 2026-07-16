import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRightIcon, SealCheckIcon } from "@phosphor-icons/react/dist/ssr";
import { promotions } from "@/data/content";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Promociones",
  description:
    "Promociones vigentes de Funes Travel: cuotas sin interés, descuentos por transferencia, cupos limitados y compra anticipada. Siempre con condiciones completas a la vista.",
};

const tagTone = (tag: string) =>
  tag === "Cuotas"
    ? ("positive" as const)
    : tag === "Cupos limitados"
      ? ("warning" as const)
      : tag === "Descuento"
        ? ("coral" as const)
        : ("teal" as const);

export default function PromotionsPage() {
  const sorted = [...promotions].sort(
    (a, b) => new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime(),
  );

  return (
    <div className="pt-28 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900">
            Promociones vigentes
          </h1>
          <p className="mt-2 text-graphite-600">
            Cada promoción muestra qué incluye, hasta cuándo vale y sus condiciones completas. Si algo
            no queda claro, preguntanos antes de reservar: preferimos perder una venta a ganar un malentendido.
          </p>
        </header>

        <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-card)] bg-teal-50 px-5 py-4">
          <SealCheckIcon className="mt-0.5 size-5 shrink-0 text-teal-600" aria-hidden />
          <p className="text-sm leading-relaxed text-graphite-700">
            Los precios promocionales son por persona en base doble y están sujetos a disponibilidad al
            momento de confirmar. Las condiciones de cada promoción figuran completas en esta página, sin
            remitir a letra chica externa.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {sorted.map((promo) => (
            <article
              key={promo.id}
              className="grid overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)] transition-shadow hover:shadow-[var(--shadow-float)] md:grid-cols-[minmax(240px,320px)_1fr]"
            >
              {promo.image ? (
                <div className="relative h-48 md:h-full md:min-h-52">
                  <Image
                    src={promo.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="hidden items-center justify-center bg-petrol-950 p-8 md:flex">
                  <p className="font-display text-2xl font-bold text-ivory text-center leading-snug">
                    {promo.tag}
                  </p>
                </div>
              )}
              <div className="flex flex-col p-6 md:p-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge tone={tagTone(promo.tag)}>{promo.tag}</Badge>
                  <span className="text-xs font-medium text-graphite-500">
                    Válida hasta el {formatDate(promo.validUntil)}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-2xl font-bold text-petrol-900">{promo.title}</h2>
                <p className="mt-1 font-medium text-graphite-700">{promo.detail}</p>
                <p className="mt-2 text-sm text-graphite-600">
                  <span className="font-semibold text-graphite-700">Incluye:</span> {promo.includes}
                </p>
                <p className="mt-3 max-w-[75ch] text-xs leading-relaxed text-graphite-500">
                  Condiciones: {promo.conditions}
                </p>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
                  {promo.priceFrom ? (
                    <div>
                      <p className="text-xs text-graphite-500">Desde</p>
                      <p className="font-display text-2xl font-bold text-petrol-900 tabular leading-tight">
                        {formatMoney(promo.priceFrom)}
                        <span className="font-sans text-sm font-normal text-graphite-500"> por persona</span>
                      </p>
                      <p className="text-xs text-graphite-500">En base doble</p>
                    </div>
                  ) : (
                    <span />
                  )}
                  <Link
                    href={promo.href}
                    className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coral-600"
                  >
                    Aprovechar esta promo
                    <ArrowRightIcon className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
