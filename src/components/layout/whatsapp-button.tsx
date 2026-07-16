"use client";

import { usePathname } from "next/navigation";
import { WhatsappLogoIcon } from "@phosphor-icons/react";
import { getPackage } from "@/data/packages";
import { getHotel } from "@/data/hotels";
import { getExcursion } from "@/data/excursions";
import { getDestination } from "@/data/destinations";

/**
 * Contextual WhatsApp entry point. The prefilled message references what the
 * user is looking at so they never have to explain themselves from scratch.
 */
function buildMessage(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);

  if (parts[0] === "paquetes" && parts[1]) {
    const p = getPackage(parts[1]);
    if (p) return `Hola, estoy viendo el paquete ${p.name} de ${p.nights} noches en la web (funestravel.com.ar/paquetes/${p.slug}). Quisiera consultar disponibilidad.`;
  }
  if (parts[0] === "hoteles" && parts[1]) {
    const h = getHotel(parts[1]);
    if (h) return `Hola, estoy viendo el hotel ${h.name} en la web. Quisiera consultar disponibilidad y tarifas.`;
  }
  if (parts[0] === "excursiones" && parts[1]) {
    const e = getExcursion(parts[1]);
    if (e) return `Hola, quisiera consultar por la excursión ${e.name}.`;
  }
  if (parts[0] === "destinos" && parts[1]) {
    const d = getDestination(parts[1]);
    if (d) return `Hola, estoy pensando en viajar a ${d.name} y quisiera recibir opciones.`;
  }
  if (parts[0] === "viajes-grupales") return "Hola, quisiera información sobre las próximas salidas grupales.";
  if (parts[0] === "viajes-a-medida") return "Hola, quiero armar un viaje a medida y me gustaría hablar con un asesor.";
  if (parts[0] === "checkout" || parts[0] === "reserva") return "Hola, estoy haciendo una reserva en la web y tengo una consulta.";
  return "Hola, estoy navegando la web de Funes Travel y quisiera hacer una consulta.";
}

export function WhatsAppButton() {
  const pathname = usePathname();

  // The checkout and the package detail keep their own persistent CTAs
  // (bottom bar on mobile); the floating button would overlap them.
  if (pathname.startsWith("/checkout") || /^\/paquetes\/[^/]+$/.test(pathname)) return null;

  const href = `https://wa.me/5493415550123?text=${encodeURIComponent(buildMessage(pathname))}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-40 flex items-center gap-2 rounded-full bg-positive-700 py-2.5 pl-3 pr-4 text-sm font-semibold text-white shadow-[var(--shadow-float)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
      aria-label="Consultar por WhatsApp"
    >
      <WhatsappLogoIcon weight="fill" className="size-5" aria-hidden />
      <span className="hidden sm:inline">Hablar con un asesor</span>
    </a>
  );
}
