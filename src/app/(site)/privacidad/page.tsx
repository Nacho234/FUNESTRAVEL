import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo tratamos tus datos personales: qué recolectamos, para qué los usamos, con quién los compartimos y cuáles son tus derechos según la Ley 25.326.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-28 lg:pt-32 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-[75ch]">
          <h1 className="font-display text-4xl font-bold tracking-tight text-petrol-900">
            Política de privacidad
          </h1>
          <p className="mt-3 text-sm text-graphite-500">
            Última actualización: julio de 2026 · Responsable: Funes Travel EVT, San José 1650, Funes, Santa Fe
          </p>

          <div className="mt-8 space-y-8 text-[0.9375rem] leading-relaxed text-graphite-700">
            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">Qué datos recolectamos</h2>
              <p className="mt-3">
                Para cotizar y reservar necesitamos datos de contacto (nombre, correo, teléfono) y, al
                confirmar una reserva, los datos exigidos por los prestadores: documento o pasaporte,
                fecha de nacimiento, nacionalidad y, cuando el servicio lo requiere, datos de salud
                declarados voluntariamente (por ejemplo, necesidades especiales de asistencia).
              </p>
              <p className="mt-3">
                Nunca pedimos más de lo necesario para el servicio contratado, y nunca almacenamos los
                datos completos de tarjetas de crédito: los pagos se procesan en las plataformas de los
                proveedores de pago (por ejemplo, Mercado Pago).
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">Para qué los usamos</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Emitir reservas, vouchers, pasajes y seguros a tu nombre.</li>
                <li>Comunicarnos por cambios, recordatorios de pago y alertas del viaje.</li>
                <li>Cumplir obligaciones legales, contables e impositivas.</li>
                <li>
                  Enviarte promociones solo si te suscribiste; cada correo incluye la baja en un clic.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">Con quién los compartimos</h2>
              <p className="mt-3">
                Únicamente con los prestadores que necesitan tus datos para brindarte el servicio:
                aerolíneas, hoteles, operadores receptivos, compañías de asistencia al viajero y
                procesadores de pago. No vendemos ni cedemos bases de datos a terceros con fines
                publicitarios.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">Cuánto tiempo los guardamos</h2>
              <p className="mt-3">
                Conservamos la documentación de reservas durante los plazos exigidos por la normativa
                fiscal y turística (en general, diez años). Los datos de contacto para marketing se
                conservan hasta que pidas la baja.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">Tus derechos</h2>
              <p className="mt-3">
                Conforme a la Ley 25.326 de Protección de Datos Personales, podés solicitar el acceso,
                la rectificación o la supresión de tus datos escribiendo a hola@funestravel.com.ar. La
                Agencia de Acceso a la Información Pública, en su carácter de órgano de control, tiene
                la atribución de atender denuncias y reclamos sobre incumplimientos a la norma.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">Cookies y analítica</h2>
              <p className="mt-3">
                El sitio usa cookies técnicas (necesarias para el funcionamiento, como tus favoritos y
                tu reserva en curso) y métricas de uso agregadas para mejorar la experiencia. No
                usamos cookies para construir perfiles publicitarios personales.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">Consultas</h2>
              <p className="mt-3">
                Ante cualquier duda sobre esta política, escribinos por los canales de{" "}
                <Link href="/contacto" className="font-semibold text-teal-600 underline">
                  contacto
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
