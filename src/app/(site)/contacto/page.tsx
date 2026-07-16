import type { Metadata } from "next";
import Link from "next/link";
import {
  ClockIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escribinos por WhatsApp, correo o el formulario. Atendemos de lunes a viernes de 9 a 18 y sábados de 9 a 13 en Funes, Santa Fe.",
};

const channels = [
  {
    icon: WhatsappLogoIcon,
    title: "WhatsApp",
    detail: "+54 9 341 555-0123",
    note: "La vía más rápida para consultas y cotizaciones",
    href: "https://wa.me/5493415550123",
    external: true,
  },
  {
    icon: EnvelopeSimpleIcon,
    title: "Correo",
    detail: "hola@funestravel.com.ar",
    note: "Ideal para enviar documentación o consultas largas",
    href: "mailto:hola@funestravel.com.ar",
    external: false,
  },
  {
    icon: MapPinIcon,
    title: "Oficina",
    detail: "San José 1650, Funes, Santa Fe",
    note: "Vení sin turno en horario de atención",
    href: "/sucursales",
    external: false,
  },
];

export default function ContactPage() {
  return (
    <div className="pt-28 lg:pt-32 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-petrol-900">
            Hablemos de tu viaje
          </h1>
          <p className="mt-3 max-w-xl text-graphite-600">
            Elegí el canal que te quede más cómodo. Las consultas de la web las responde el mismo equipo
            que después te acompaña durante el viaje.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div className="space-y-4">
              {channels.map((channel) => {
                const inner = (
                  <>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-600">
                      <channel.icon className="size-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block font-display font-bold text-petrol-900">{channel.title}</span>
                      <span className="block text-sm font-semibold text-graphite-800">{channel.detail}</span>
                      <span className="mt-0.5 block text-xs text-graphite-500">{channel.note}</span>
                    </span>
                  </>
                );
                const className =
                  "flex items-start gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-lift)] transition-shadow hover:shadow-[var(--shadow-float)]";
                return channel.external ? (
                  <a
                    key={channel.title}
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link key={channel.title} href={channel.href} className={className}>
                    {inner}
                  </Link>
                );
              })}

              <div className="flex items-start gap-4 rounded-[var(--radius-card)] bg-sand-100 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-teal-600">
                  <ClockIcon className="size-5" aria-hidden />
                </span>
                <div>
                  <h2 className="font-display font-bold text-petrol-900">Horarios de atención</h2>
                  <p className="mt-1 text-sm text-graphite-700">Lunes a viernes de 9 a 18 h</p>
                  <p className="text-sm text-graphite-700">Sábados de 9 a 13 h</p>
                  <p className="mt-1.5 text-xs text-graphite-500">
                    Pasajeros en viaje: la línea de emergencias del voucher atiende las 24 h.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
