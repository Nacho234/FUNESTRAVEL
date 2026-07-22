import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  AirplaneTakeoffIcon,
  ArrowRightIcon,
  SealCheckIcon,
  SuitcaseRollingIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { SearchWidget } from "@/components/search/search-widget";

export const metadata: Metadata = {
  title: "Vuelos",
  description:
    "Buscá y emití vuelos de cabotaje e internacionales con asistencia de agencia: tarifas con equipaje aclarado y gestión ante reprogramaciones.",
};

const popularRoutes = [
  {
    from: "Rosario",
    to: "Bariloche",
    detail: "Directo · temporada de invierno",
    priceFrom: "USD 120",
    href: "/vuelos/resultados?origen=Rosario&destino=Bariloche&modo=ida-vuelta",
  },
  {
    from: "Buenos Aires",
    to: "Río de Janeiro",
    detail: "Directo · 2 h 55 m",
    priceFrom: "USD 338",
    href: "/vuelos/resultados?origen=Buenos%20Aires&destino=R%C3%ADo%20de%20Janeiro&modo=ida-vuelta",
  },
  {
    from: "Buenos Aires",
    to: "Madrid",
    detail: "Directo · vuelo nocturno",
    priceFrom: "USD 950",
    href: "/vuelos/resultados?origen=Buenos%20Aires&destino=Madrid&modo=ida-vuelta",
  },
];

const advantages = [
  {
    icon: SuitcaseRollingIcon,
    title: "Tarifas sin trampas",
    text: "Antes de emitir te mostramos qué equipaje incluye cada tarifa y cuánto cuesta agregar valija, para que compares precios reales.",
  },
  {
    icon: SealCheckIcon,
    title: "Emisión como agencia habilitada",
    text: "Emitimos con las aerolíneas y consolidadores con los que trabajamos hace años. Tu ticket queda respaldado por la agencia, no por un buscador anónimo.",
  },
  {
    icon: WhatsappLogoIcon,
    title: "Si el vuelo cambia, lo resolvemos",
    text: "Reprogramaciones y cancelaciones las gestionamos nosotros directamente con la aerolínea. Vos te enterás con la solución, no con el problema.",
  },
];

export default function FlightsPage() {
  return (
    <div className="pb-16 lg:pb-24">
      {/* Compact hero with video background */}
      <section className="relative overflow-hidden bg-petrol-950 pt-28 pb-12 lg:pb-16">
        {/* Mobile: static image */}
        <Image
          src="/videos/vuelos-poster.jpg"
          alt="Vista aérea de la costa desde el avión"
          fill
          priority
          sizes="100vw"
          className="object-cover lg:hidden"
        />
        {/* Desktop: video */}
        <video
          className="absolute inset-0 hidden h-full w-full object-cover lg:block"
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/vuelos-poster.jpg"
          aria-hidden
        >
          <source src="/videos/vuelos.webm" type="video/webm" />
          <source src="/videos/vuelos.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-petrol-950/70 via-petrol-950/45 to-petrol-950/15" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Vuelos con alguien que responde del otro lado
            </h1>
            <p className="mt-3 text-white/80 leading-relaxed">
              Cotizamos cabotaje e internacionales con las condiciones claras: equipaje, cambios y
              reembolsos a la vista antes de pagar.
            </p>
          </div>
          <div className="mt-8">
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* How we work flights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20">
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-petrol-900 max-w-xl">
          Comprar un vuelo acá no es lo mismo que comprarlo solo
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {advantages.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border-t-2 border-teal-500 pt-5">
              <Icon className="size-7 text-teal-600" aria-hidden />
              <h3 className="mt-3 font-display text-lg font-bold text-petrol-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular routes */}
      <section className="bg-sand-50 border-y border-sand-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-petrol-900">
            Rutas que más emitimos
          </h2>
          <p className="mt-2 text-graphite-600 text-sm">
            Precios de referencia por tramo, ida y vuelta por persona. Varían según fecha y anticipación.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {popularRoutes.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex flex-col rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)] transition-shadow hover:shadow-[var(--shadow-float)]"
              >
                <p className="flex items-center gap-2 font-display text-lg font-bold text-petrol-900">
                  {r.from}
                  <AirplaneTakeoffIcon className="size-5 text-teal-600" aria-hidden />
                  {r.to}
                </p>
                <p className="mt-1 text-sm text-graphite-600">{r.detail}</p>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-graphite-500">Desde</p>
                    <p className="font-display text-xl font-bold text-petrol-900 tabular">{r.priceFrom}</p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-semibold text-coral-700">
                    Ver opciones
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
