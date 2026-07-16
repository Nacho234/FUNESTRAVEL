import type { Metadata } from "next";
import Link from "next/link";
import { InfoIcon } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Política de cancelaciones",
  description:
    "Plazos y costos de cancelación por tipo de viaje: nacionales, regionales y larga distancia. Cambios de fecha, reembolsos y seguro de cancelación.",
};

export default function CancellationPolicyPage() {
  return (
    <div className="pt-28 lg:pt-32 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-[75ch]">
          <h1 className="font-display text-4xl font-bold tracking-tight text-petrol-900">
            Política de cancelaciones
          </h1>
          <p className="mt-3 text-graphite-600">
            Cada paquete publica su política específica antes de reservar, y esa política prevalece.
            Esta página explica los criterios generales para que sepas qué esperar antes de mirar la
            letra de tu reserva.
          </p>

          <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-card)] bg-teal-50 p-5 text-sm text-graphite-700">
            <InfoIcon className="mt-0.5 size-5 shrink-0 text-teal-600" aria-hidden />
            <p>
              Los pasajes aéreos se rigen siempre por las reglas tarifarias de la aerolínea, que pueden
              ser más restrictivas que la política del paquete. Te las informamos antes de emitir.
            </p>
          </div>

          <div className="mt-10 space-y-8 text-[0.9375rem] leading-relaxed text-graphite-700">
            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">
                Criterios generales por tipo de viaje
              </h2>
              <p className="mt-3">
                Los porcentajes aplican sobre la porción terrestre del paquete (hotel, traslados,
                excursiones). Los plazos se cuentan en días corridos antes de la salida.
              </p>
              <ul className="mt-4 space-y-4">
                <li className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-lift)]">
                  <h3 className="font-display font-bold text-petrol-900">Escapadas y viajes nacionales</h3>
                  <p className="mt-1.5 text-sm">
                    Sin costo hasta 20 o 30 días antes según el paquete. Entre ese plazo y los 7 a 10
                    días previos se retiene entre el 20% y el 30%. Con menos de 7 a 10 días, los gastos
                    alcanzan el 100% de la porción terrestre.
                  </p>
                </li>
                <li className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-lift)]">
                  <h3 className="font-display font-bold text-petrol-900">Brasil y países limítrofes</h3>
                  <p className="mt-1.5 text-sm">
                    Sin costo hasta 20 o 30 días antes. Entre 29 y 15 días se retiene hasta el 30%. Con
                    menos de 15 días, gastos del 100% sobre la porción terrestre.
                  </p>
                </li>
                <li className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-lift)]">
                  <h3 className="font-display font-bold text-petrol-900">Caribe y larga distancia</h3>
                  <p className="mt-1.5 text-sm">
                    Sin costo hasta 45 o 60 días antes según el destino. Entre ese plazo y los 21 a 30
                    días previos se retiene entre el 25% y el 30%. Con menos de 21 a 30 días, gastos del
                    100% sobre la porción terrestre.
                  </p>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">Cambio de fecha en lugar de cancelar</h2>
              <p className="mt-3">
                Casi siempre conviene más cambiar que cancelar. El cambio de fecha abona la diferencia
                de tarifa si la hubiera más los cargos de la aerolínea, y evita las retenciones de la
                porción terrestre cuando se gestiona dentro de los plazos sin costo. Escribinos apenas
                sepas que necesitás mover el viaje: cuanto antes, más barato.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">Reembolsos</h2>
              <p className="mt-3">
                Los reembolsos se procesan por el mismo medio de pago utilizado, dentro de los 30 días
                de aprobada la devolución por el prestador. Cuando el pago fue en pesos al tipo de
                cambio del día, la devolución se calcula según la normativa vigente al momento del
                reintegro, con el detalle discriminado por escrito.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">Seguro de cancelación opcional</h2>
              <p className="mt-3">
                Para viajes de larga distancia ofrecemos un seguro de cancelación que cubre causas
                justificadas (enfermedad, accidente, causas laborales documentadas) hasta el 100% de los
                gastos no reembolsables. Se contrata junto con la seña, no después. Pedile la cotización
                a tu asesor.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">Cancelaciones del prestador</h2>
              <p className="mt-3">
                Si un prestador cancela un servicio (vuelo, salida grupal sin cupo mínimo, hotel), te
                ofrecemos alternativas equivalentes o la devolución del 100% de lo abonado por ese
                servicio, a tu elección. Las salidas grupales publican su condición de cupo mínimo en el
                itinerario.
              </p>
            </section>
          </div>

          <div className="mt-10 rounded-[var(--radius-card)] bg-sand-100 p-6 text-sm text-graphite-700">
            <p>
              ¿Tenés una reserva y querés saber exactamente qué te cobrarían hoy por cancelar? Escribinos
              por{" "}
              <Link href="/contacto" className="font-semibold text-teal-600 underline">
                los canales de contacto
              </Link>{" "}
              con tu número de reserva y te lo calculamos en el día, por escrito y sin compromiso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
