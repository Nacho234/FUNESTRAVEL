import type { FeaturedPromotion } from "@/lib/types";
import { IMG } from "./img";

/**
 * Promoción destacada de /promociones.
 *
 * Espeja la promo `promo-europa-grupal` de content.ts: mismo precio, misma
 * vigencia y el mismo `href`, para no abrir un segundo camino de compra. Si
 * cambia una, hay que cambiar la otra.
 *
 * La foto es del banco del proyecto hasta que llegue la definitiva; se cambia
 * en `imageDesktop` y nada más.
 */
export const featuredPromotion: FeaturedPromotion = {
  id: "promo-europa-grupal",
  badge: "Promoción destacada",
  title: "Europa grupal: últimos 6 lugares",
  subtitle: "Salida acompañada del 8 de septiembre con coordinadora",
  facts: [
    { icon: "capitals", text: "4 capitales" },
    { icon: "nights", text: "14 noches" },
    { icon: "guided", text: "Visitas guiadas" },
    { icon: "coordination", text: "Coordinación permanente" },
  ],
  priceFrom: "USD 4.190",
  priceSuffix: "por persona",
  priceBasis: "En base doble",
  validUntil: { label: "Válida hasta", day: "15 AGO", year: "2026" },
  terms: [
    { icon: "shield", title: "Precio por persona", text: "En base doble más impuestos" },
    { icon: "lock", title: "Seña de USD 500", text: "Para bloquear tu lugar" },
    { icon: "seats", title: "Cupos limitados", text: "No te quedes sin tu lugar" },
    { icon: "check", title: "Condiciones claras", text: "Te contamos todo antes de que reserves" },
  ],
  imageDesktop: IMG.grecia,
  imageAlt: "Pueblo costero mediterráneo escalonado sobre el mar al atardecer",
  imagePositionDesktop: "60% center",
  imagePositionMobile: "center 40%",
  ctaLabel: "Aprovechar esta promo",
  href: "/viajes-grupales/europa-clasica-grupal-septiembre",
};
