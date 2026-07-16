import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRightIcon,
  CreditCardIcon,
  FileTextIcon,
} from "@phosphor-icons/react/dist/ssr";
import { faqs } from "@/data/content";
import { FaqBrowser } from "@/components/help/faq-browser";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Ayuda y preguntas frecuentes",
  description:
    "Respuestas sobre reservas, pagos en cuotas, cancelaciones, documentación, equipaje y asistencia al viajero.",
};

const quickLinks = [
  {
    href: "/politica-de-cancelaciones",
    icon: FileTextIcon,
    title: "Política de cancelaciones",
    text: "Plazos y costos según destino, explicados sin letra chica.",
  },
  {
    href: "/medios-de-pago",
    icon: CreditCardIcon,
    title: "Medios de pago",
    text: "Cuotas, transferencia con descuento y pago en oficina.",
  },
];

export default function HelpPage() {
  return (
    <div className="pt-28 lg:pt-32 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-petrol-900">
            ¿En qué te ayudamos?
          </h1>
          <p className="mt-3 max-w-xl text-graphite-600">
            Las respuestas a lo que más nos preguntan. Si no encontrás la tuya, escribinos: contestamos
            en horario de atención y las urgencias de viaje, siempre.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 max-w-3xl">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-start gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-lift)] transition-shadow hover:shadow-[var(--shadow-float)]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-600">
                <link.icon className="size-5" aria-hidden />
              </span>
              <span>
                <span className="flex items-center gap-1.5 font-display font-bold text-petrol-900 group-hover:text-petrol-700 transition-colors">
                  {link.title}
                  <ArrowRightIcon
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
                <span className="mt-1 block text-sm text-graphite-600">{link.text}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <FaqBrowser faqs={faqs} />
        </div>
      </div>
    </div>
  );
}
