import Image from "next/image";
import type { Metadata } from "next";
import {
  ChatsCircleIcon,
  ClockCountdownIcon,
  PencilSimpleLineIcon,
} from "@phosphor-icons/react/dist/ssr";
import { QuoteForm } from "@/components/home/quote-form";
import { IMG } from "@/data/img";

export const metadata: Metadata = {
  title: "Viajes a medida",
  description:
    "Contanos el viaje que imaginás y un asesor de Funes Travel arma una propuesta concreta en 24 horas hábiles, con precio cerrado y cambios ilimitados antes de confirmar.",
};

const steps = [
  {
    icon: ChatsCircleIcon,
    title: "Nos contás tu idea",
    text: "Completás el formulario o venís a la oficina. Alcanza con un destino aproximado, una fecha tentativa y cuántos viajan.",
  },
  {
    icon: ClockCountdownIcon,
    title: "Propuesta en 24 horas hábiles",
    text: "Un asesor arma un itinerario con precios reales y vigencia: sabés exactamente qué incluye y hasta cuándo vale.",
  },
  {
    icon: PencilSimpleLineIcon,
    title: "Ajustamos hasta que cierre",
    text: "Cambiás hoteles, noches o presupuesto las veces que haga falta. Recién cuando estás conforme, señás y confirmamos todo.",
  },
];

const examples = [
  {
    title: "Luna de miel: Turquía y Grecia, 16 noches",
    asked:
      "María y Julián se casaban en octubre y querían \"algo distinto a Europa clásica\", 15 a 18 días, sin madrugones todos los días y con presupuesto tope de USD 4.500 por persona.",
    built:
      "Estambul (4 noches), Capadocia con hotel cueva y vuelo en globo (3), ferry por las islas griegas: Santorini (4) y Atenas (2), más 3 noches libres en Mykonos. Traslados privados, media pensión en Turquía y desayuno en Grecia. Cerró en USD 4.280 por persona con la cena de aniversario en Oia de regalo.",
  },
  {
    title: "Egresados de posgrado: Nueva York, 7 noches",
    asked:
      "Un grupo de 14 compañeros de una maestría quería festejar la graduación en Nueva York en diciembre, con hotel en Manhattan, un partido de la NBA y cena de gala incluida, coordinando salidas desde Rosario y Córdoba.",
    built:
      "Aéreos desde ambas ciudades llegando el mismo día, hotel 4★ en Midtown, entradas para Knicks en el Madison Square Garden, cena de gala en un rooftop de Brooklyn con menú cerrado, y city tour privado de día completo. Pago en 6 cuotas por persona con la seña grupal congelando la tarifa.",
  },
];

export default function CustomTripsPage() {
  return (
    <div className="pb-16 lg:pb-24">
      {/* Editorial hero */}
      <section className="relative flex min-h-[60dvh] items-end">
        <Image
          src={IMG.planning}
          alt="Persona planificando un viaje con mapas y cuaderno"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-petrol-950/85 via-petrol-950/40 to-petrol-950/20" aria-hidden />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 pb-14 pt-40">
          <h1 className="max-w-2xl font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08]">
            Contanos el viaje que imaginás. Nosotros lo hacemos existir.
          </h1>
          <p className="mt-4 max-w-xl text-white/85 leading-relaxed">
            Sin paquetes forzados: armamos el itinerario alrededor de tus fechas, tu presupuesto y tu
            forma de viajar.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20">
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-petrol-900">
          Cómo funciona
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="border-t-2 border-teal-500 pt-5">
              <div className="flex items-center gap-3">
                <Icon className="size-7 text-teal-600" aria-hidden />
                <span className="font-display text-sm font-bold text-graphite-500 tabular">{i + 1} de 3</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-petrol-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="bg-sand-50 border-y border-sand-200/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14 lg:py-20">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-petrol-900">
            Empecemos por tu idea
          </h2>
          <p className="mt-2 text-graphite-600">
            Cuanto más nos cuentes, más afinada llega la primera propuesta. Pero con un destino y una
            fecha aproximada ya podemos arrancar.
          </p>
          <div className="mt-8">
            <QuoteForm extended />
          </div>
        </div>
      </section>

      {/* Real examples */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20">
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-petrol-900 max-w-xl">
          Dos viajes que empezaron igual que el tuyo
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {examples.map((ex) => (
            <article key={ex.title} className="flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)]">
              <h3 className="border-b border-graphite-100 px-6 py-5 font-display text-lg font-bold text-petrol-900">
                {ex.title}
              </h3>
              <div className="grid flex-1 divide-y divide-graphite-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-graphite-500">Lo que nos pidieron</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-graphite-600">{ex.asked}</p>
                </div>
                <div className="bg-teal-50/60 p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-600">Lo que armamos</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-graphite-700">{ex.built}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
