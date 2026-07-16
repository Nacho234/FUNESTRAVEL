import type { Metadata } from "next";
import Link from "next/link";
import {
  BankIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  DeviceMobileIcon,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Medios de pago",
  description:
    "Mercado Pago, tarjetas de crédito en 3 a 12 cuotas, transferencia con 5% de descuento y pago en oficina. Señas y pagos parciales.",
};

const methods = [
  {
    icon: DeviceMobileIcon,
    title: "Mercado Pago",
    detail:
      "Link de pago para abonar con saldo, débito o crédito. Las cuotas disponibles se muestran en el propio link antes de confirmar.",
  },
  {
    icon: CreditCardIcon,
    title: "Tarjetas de crédito",
    detail:
      "Visa, Mastercard y American Express de los principales bancos, en 3 a 12 cuotas según la promoción vigente. La financiación aplica sobre el precio en pesos al tipo de cambio del día de pago.",
  },
  {
    icon: BankIcon,
    title: "Transferencia bancaria",
    detail:
      "5% de descuento sobre la porción terrestre en paquetes internacionales. Te enviamos los datos de la cuenta junto con la cotización.",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Efectivo o dólares en oficina",
    detail:
      "Podés abonar en pesos o en dólares billete en San José 1650, Funes. Emitimos recibo oficial en el momento.",
  },
];

const tableRows = [
  { method: "Mercado Pago", currency: "ARS", installments: "Hasta 12 según promo", discount: "-" },
  { method: "Tarjeta de crédito", currency: "ARS", installments: "3 a 12 cuotas", discount: "-" },
  { method: "Transferencia", currency: "ARS o USD", installments: "Pago único", discount: "5% en porción terrestre" },
  { method: "Efectivo en oficina", currency: "ARS o USD", installments: "Pago único o parciales", discount: "Consultar según paquete" },
];

export default function PaymentMethodsPage() {
  return (
    <div className="pt-28 lg:pt-32 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-[75ch]">
          <h1 className="font-display text-4xl font-bold tracking-tight text-petrol-900">
            Medios de pago
          </h1>
          <p className="mt-3 text-graphite-600">
            Todos los precios se confirman por escrito antes de pagar, con impuestos discriminados.
            Nunca te vamos a pedir datos de tarjeta por WhatsApp ni por teléfono.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {methods.map((m) => (
              <div key={m.title} className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
                <span className="grid size-10 place-items-center rounded-full bg-teal-50 text-teal-600">
                  <m.icon className="size-5" aria-hidden />
                </span>
                <h2 className="mt-3 font-display text-lg font-bold text-petrol-900">{m.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-graphite-600">{m.detail}</p>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="mt-10 overflow-x-auto rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)]">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">Comparación de medios de pago disponibles</caption>
              <thead>
                <tr className="border-b border-graphite-100 bg-petrol-50 text-petrol-900">
                  <th scope="col" className="px-5 py-3.5 font-display font-bold">Medio</th>
                  <th scope="col" className="px-5 py-3.5 font-display font-bold">Moneda</th>
                  <th scope="col" className="px-5 py-3.5 font-display font-bold">Cuotas</th>
                  <th scope="col" className="px-5 py-3.5 font-display font-bold">Beneficio</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.method} className="border-b border-graphite-100 last:border-0">
                    <th scope="row" className="px-5 py-3.5 font-semibold text-graphite-800">
                      {row.method}
                    </th>
                    <td className="px-5 py-3.5 text-graphite-600">{row.currency}</td>
                    <td className="px-5 py-3.5 text-graphite-600">{row.installments}</td>
                    <td className="px-5 py-3.5 text-graphite-600">{row.discount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 space-y-8 text-[0.9375rem] leading-relaxed text-graphite-700">
            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">Seña y saldo</h2>
              <p className="mt-3">
                La mayoría de los paquetes se bloquea con una seña del 20% del total (o USD 500 en
                viajes de larga distancia). El saldo se puede abonar en uno o más pagos parciales hasta
                35 días antes de la salida, combinando medios de pago si te resulta más cómodo.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">Precios en dólares</h2>
              <p className="mt-3">
                Los paquetes internacionales se publican en dólares. Podés pagarlos en pesos al tipo de
                cambio vendedor del día (billete Banco Nación más los impuestos vigentes, siempre
                discriminados antes de confirmar) o en dólares billete en la oficina.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl font-bold text-petrol-900">Comprobantes</h2>
              <p className="mt-3">
                Cada pago genera un recibo oficial y, al completar el total, la factura correspondiente.
                Todos los comprobantes quedan disponibles en{" "}
                <Link href="/cuenta" className="font-semibold text-teal-600 underline">
                  tu cuenta
                </Link>{" "}
                y se envían por correo.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
