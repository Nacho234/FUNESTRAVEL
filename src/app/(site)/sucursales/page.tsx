import type { Metadata } from "next";
import {
  BusIcon,
  CarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Nuestra oficina",
  description:
    "Visitanos en San José 1650, Funes, Santa Fe. Lunes a viernes de 9 a 18 y sábados de 9 a 13, sin turno previo.",
};

export default function BranchesPage() {
  return (
    <div className="pt-28 lg:pt-32 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-petrol-900">
            Nuestra oficina en Funes
          </h1>
          <p className="mt-3 max-w-xl text-graphite-600">
            La agencia funciona en la misma cuadra desde el primer día. Vení sin turno: siempre hay un
            asesor disponible para sentarse a mirar tu viaje.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* Map placeholder: swap for a Google Maps embed when the API key is available */}
          {/* TODO: reemplazar por iframe de Google Maps (place: San José 1650, Funes, Santa Fe) */}
          <Reveal>
            <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] bg-sand-100 p-10 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-white text-teal-600">
                <MapPinIcon weight="fill" className="size-7" aria-hidden />
              </span>
              <p className="font-display text-xl font-bold text-petrol-900">San José 1650, Funes</p>
              <p className="max-w-xs text-sm text-graphite-600">
                Santa Fe, Argentina. A dos cuadras de la plaza central, sobre la vereda del banco.
              </p>
              <a
                href="https://maps.google.com/?q=San+Jose+1650+Funes+Santa+Fe"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-graphite-200 bg-white px-4 py-2 text-sm font-semibold text-petrol-900 hover:border-petrol-600 hover:text-petrol-700 transition-colors"
              >
                Abrir en Google Maps
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="space-y-4">
              <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-petrol-900">
                  <ClockIcon className="size-5 text-teal-600" aria-hidden />
                  Horarios
                </h2>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-graphite-600">Lunes a viernes</dt>
                    <dd className="font-semibold text-graphite-800">9 a 18 h</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-graphite-600">Sábados</dt>
                    <dd className="font-semibold text-graphite-800">9 a 13 h</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-graphite-600">Domingos y feriados</dt>
                    <dd className="font-semibold text-graphite-800">Cerrado</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs text-graphite-500">
                  Pasajeros en viaje: la línea de emergencias del voucher atiende las 24 h, todos los días.
                </p>
              </div>

              <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
                <h2 className="font-display text-lg font-bold text-petrol-900">Cómo llegar</h2>
                <ul className="mt-3 space-y-2.5 text-sm text-graphite-600">
                  <li className="flex items-start gap-2.5">
                    <CarIcon className="mt-0.5 size-4.5 shrink-0 text-teal-600" aria-hidden />
                    En auto: por ruta 9 o autopista Rosario-Córdoba, salida Funes centro. Hay
                    estacionamiento libre en la cuadra.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <BusIcon className="mt-0.5 size-4.5 shrink-0 text-teal-600" aria-hidden />
                    En colectivo: líneas interurbanas Rosario-Funes con parada a tres cuadras de la
                    oficina.
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://wa.me/5493415550123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-positive-700 px-5 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <WhatsappLogoIcon weight="fill" className="size-4.5" aria-hidden />
                  WhatsApp
                </a>
                <a
                  href="tel:+5493415550123"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-petrol-900 px-5 py-3 text-sm font-semibold text-ivory hover:bg-petrol-800 transition-colors"
                >
                  <PhoneIcon className="size-4.5" aria-hidden />
                  Llamar
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
