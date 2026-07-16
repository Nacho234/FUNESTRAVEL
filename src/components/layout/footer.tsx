import Link from "next/link";
import {
  AirplaneTiltIcon,
  CreditCardIcon,
  EnvelopeSimpleIcon,
  InstagramLogoIcon,
  FacebookLogoIcon,
  LockKeyIcon,
  MapPinIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { NewsletterForm } from "./newsletter-form";

const columns = [
  {
    title: "Viajar",
    links: [
      { label: "Paquetes", href: "/paquetes" },
      { label: "Vuelos", href: "/vuelos" },
      { label: "Hoteles", href: "/hoteles" },
      { label: "Excursiones", href: "/excursiones" },
      { label: "Viajes grupales", href: "/viajes-grupales" },
      { label: "Viajes a medida", href: "/viajes-a-medida" },
      { label: "Promociones", href: "/promociones" },
    ],
  },
  {
    title: "Destinos populares",
    links: [
      { label: "Bariloche", href: "/destinos/bariloche" },
      { label: "Punta Cana", href: "/destinos/punta-cana" },
      { label: "Río de Janeiro", href: "/destinos/rio-de-janeiro" },
      { label: "Europa clásica", href: "/paquetes/europa-clasica-14-noches" },
      { label: "Cataratas del Iguazú", href: "/destinos/iguazu" },
      { label: "Todos los destinos", href: "/destinos" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { label: "Preguntas frecuentes", href: "/ayuda" },
      { label: "Recuperar una reserva", href: "/reserva/recuperar" },
      { label: "Medios de pago", href: "/medios-de-pago" },
      { label: "Política de cancelaciones", href: "/politica-de-cancelaciones" },
      { label: "Contacto", href: "/contacto" },
      { label: "Nuestra oficina", href: "/sucursales" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-petrol-950 text-petrol-100 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2" aria-label="Funes Travel, inicio">
              <span className="grid size-9 place-items-center rounded-full bg-white/10 text-ivory">
                <AirplaneTiltIcon weight="fill" className="size-5" aria-hidden />
              </span>
              <span className="font-display text-lg font-bold text-ivory">
                Funes<span className="text-teal-100"> Travel</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-petrol-100/80">
              Agencia de viajes de Funes, Santa Fe. Armamos tu viaje con asesoramiento real y te
              acompañamos antes, durante y después de cada salida.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <MapPinIcon className="size-4 shrink-0" aria-hidden /> San José 1650, Funes, Santa Fe
              </p>
              <a href="https://wa.me/5493415550123" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-ivory">
                <WhatsappLogoIcon className="size-4 shrink-0" aria-hidden /> +54 9 341 555-0123
              </a>
              <a href="mailto:hola@funestravel.com.ar" className="flex items-center gap-2 hover:text-ivory">
                <EnvelopeSimpleIcon className="size-4 shrink-0" aria-hidden /> hola@funestravel.com.ar
              </a>
            </div>
            <div className="mt-5 flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Funes Travel" className="grid size-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <InstagramLogoIcon className="size-4.5" aria-hidden />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook de Funes Travel" className="grid size-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <FacebookLogoIcon className="size-4.5" aria-hidden />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ivory">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-sm text-petrol-100/80 hover:text-ivory transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-white/5 p-6 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="max-w-md">
            <h3 className="font-display text-lg font-bold text-ivory">Ofertas que valen la pena, sin spam</h3>
            <p className="mt-1 text-sm text-petrol-100/80">
              Un correo por semana con promociones reales, nuevas salidas grupales y alertas de precio de los destinos que te interesan.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-petrol-100/70 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-1.5">
              <CreditCardIcon className="size-4" aria-hidden /> Mercado Pago, tarjetas y transferencia
            </span>
            <span className="flex items-center gap-1.5">
              <LockKeyIcon className="size-4" aria-hidden /> Sitio seguro, datos protegidos
            </span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/terminos" className="hover:text-ivory">Términos y condiciones</Link>
            <Link href="/privacidad" className="hover:text-ivory">Privacidad</Link>
            <Link href="/politica-de-cancelaciones" className="hover:text-ivory">Cancelaciones</Link>
          </div>
        </div>
        <p className="mt-4 text-xs text-petrol-100/50">
          Funes Travel EVT · Legajo 18.432 · Disposición 2447/2023 · © 2026 Funes Travel. Los precios publicados son por persona en base doble y pueden variar según fecha y disponibilidad.
        </p>
      </div>
    </footer>
  );
}
