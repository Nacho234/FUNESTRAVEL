import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Condiciones generales de contratación de Funes Travel EVT, legajo 18.432. Reservas, pagos, cambios, responsabilidades y documentación.",
};

export default function TermsPage() {
  return (
    <div className="pt-28 lg:pt-32 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-[75ch]">
          <h1 className="font-display text-4xl font-bold tracking-tight text-petrol-900">
            Términos y condiciones
          </h1>
          <p className="mt-3 text-sm text-graphite-500">
            Última actualización: julio de 2026 · Funes Travel EVT · Legajo 18.432
          </p>

          <div className="mt-8 space-y-8 text-[0.9375rem] leading-relaxed text-graphite-700">
            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">1. Quiénes somos</h2>
              <p className="mt-3">
                Funes Travel es una Empresa de Viajes y Turismo (EVT) inscripta en el Registro de
                Agentes de Viajes bajo el legajo 18.432, con oficina en San José 1650, Funes, provincia
                de Santa Fe. Operamos conforme a la Ley Nacional de Agentes de Viajes 18.829, su
                decreto reglamentario 2182/72 y la Resolución 256/2000 de la Secretaría de Turismo.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">2. Nuestro rol de intermediación</h2>
              <p className="mt-3">
                Actuamos como intermediarios entre el pasajero y los prestadores de los servicios
                (aerolíneas, hoteles, operadores receptivos, compañías de asistencia). Cada prestador es
                responsable por la ejecución de su servicio conforme a sus propias condiciones de
                contratación, que informamos antes de la compra. Esto no nos desentiende: gestionamos
                cada reclamo ante el prestador y acompañamos al pasajero durante todo el proceso.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">3. Reservas y confirmación</h2>
              <p className="mt-3">
                Una reserva se considera confirmada cuando se acredita la seña correspondiente (en
                general el 20% del total o USD 500 en viajes de larga distancia) y emitimos la
                confirmación por escrito con el detalle de servicios, fechas y condiciones. Las
                cotizaciones tienen la vigencia indicada en cada propuesta; vencida la vigencia, los
                precios se recotizan según tarifas y tipo de cambio del día.
              </p>
              <p className="mt-3">
                Los precios publicados en el sitio son por persona en base doble, en la moneda indicada
                en cada caso, y pueden variar por fecha, disponibilidad y cantidad de pasajeros. Cuando
                un precio no incluye impuestos, se aclara antes de confirmar cualquier pago.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">4. Pagos</h2>
              <p className="mt-3">
                Aceptamos los medios de pago detallados en{" "}
                <Link href="/medios-de-pago" className="font-semibold text-teal-600 underline">
                  medios de pago
                </Link>
                . Los saldos deben cancelarse hasta 35 días antes de la salida, salvo condiciones
                distintas informadas en la reserva. La falta de pago del saldo en término habilita la
                cancelación de la reserva con los cargos que correspondan según la política del paquete.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">5. Cambios y cancelaciones</h2>
              <p className="mt-3">
                Cada paquete publica su política de cancelación específica antes de la reserva, y esa
                política prevalece sobre las condiciones generales. Los criterios generales están
                explicados en{" "}
                <Link href="/politica-de-cancelaciones" className="font-semibold text-teal-600 underline">
                  política de cancelaciones
                </Link>
                . Los pasajes aéreos se rigen siempre por las reglas tarifarias de la aerolínea emisora.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">6. Documentación del pasajero</h2>
              <p className="mt-3">
                Es responsabilidad del pasajero contar con la documentación exigida por cada país:
                documento o pasaporte vigente, visas, autorizaciones de menores, certificados de
                vacunación y seguros obligatorios. Informamos los requisitos conocidos al momento de la
                reserva y avisamos si cambian antes de la salida, pero la obtención de la documentación
                es personal e intransferible. Los gastos derivados de documentación faltante o vencida
                no son reembolsables.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">7. Alteraciones de servicios</h2>
              <p className="mt-3">
                Los horarios de vuelos, el orden de excursiones y los hoteles confirmados pueden sufrir
                modificaciones por decisión de los prestadores o causas de fuerza mayor. Ante un cambio,
                ofrecemos alternativas de calidad igual o superior, y cuando esto no es posible, la
                devolución proporcional del servicio no prestado.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">8. Protección de datos</h2>
              <p className="mt-3">
                Tratamos los datos personales conforme a la Ley 25.326 y a nuestra{" "}
                <Link href="/privacidad" className="font-semibold text-teal-600 underline">
                  política de privacidad
                </Link>
                . Nunca almacenamos datos completos de tarjetas de crédito en nuestros sistemas.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">9. Reclamos</h2>
              <p className="mt-3">
                Cualquier reclamo puede presentarse en nuestra oficina, por correo a
                hola@funestravel.com.ar o por los canales de{" "}
                <Link href="/contacto" className="font-semibold text-teal-600 underline">
                  contacto
                </Link>
                . También está disponible el libro de quejas físico y digital, y la vía de Defensa del
                Consumidor de la provincia de Santa Fe.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
