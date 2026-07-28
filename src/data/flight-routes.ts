import type { FeaturedRoute, RouteCategory, RouteCommitment } from "@/lib/types";
import { IMG } from "./img";

/**
 * Rutas destacadas de /vuelos.
 *
 * DEMO: los precios son de referencia, ida y vuelta por persona. Al conectar el
 * GDS se reemplaza este módulo por el adaptador y la sección no cambia.
 */

export const routeFilters: { id: RouteCategory; label: string }[] = [
  { id: "recomendadas", label: "Recomendadas" },
  { id: "nacionales", label: "Nacionales" },
  { id: "internacionales", label: "Internacionales" },
  { id: "larga-distancia", label: "Larga distancia" },
];

export const featuredRoutes: FeaturedRoute[] = [
  {
    id: "ros-brc",
    origin: { city: "Rosario", code: "ROS" },
    destination: { city: "Bariloche", code: "BRC" },
    shortLabel: "Rosario a Bariloche",
    flightType: "Directo",
    duration: "2 h 05 m",
    priceFrom: 120,
    currency: "USD",
    badge: { text: "Temporada de invierno", tone: "petrol" },
    image: IMG.barilocheWinter,
    imageAlt: "Lago y cumbres nevadas de Bariloche en invierno",
    facts: [
      { icon: "plane", value: "Directo" },
      { icon: "calendar", label: "Mejores fechas", value: "Jun a Sep" },
    ],
    highlights: ["Ida y vuelta por persona", "Equipaje según condición de la tarifa", "Salidas frecuentes en temporada"],
    categories: ["recomendadas", "nacionales"],
    primaryCta: { label: "Ver opciones", href: "/vuelos/resultados?origen=Rosario&destino=Bariloche&modo=ida-vuelta" },
  },
  {
    id: "aep-gig",
    origin: { city: "Buenos Aires", code: "AEP" },
    destination: { city: "Río de Janeiro", code: "GIG" },
    shortLabel: "Buenos Aires a Río de Janeiro",
    flightType: "Directo",
    duration: "2 h 55 m",
    priceFrom: 338,
    currency: "USD",
    badge: { text: "Más buscado", tone: "positive" },
    image: IMG.rio,
    imageAlt: "Vista del Cristo Redentor sobre Río de Janeiro al atardecer",
    facts: [
      { icon: "plane", value: "Directo" },
      { icon: "clock", label: "Duración", value: "2 h 55 m" },
    ],
    highlights: ["Ida y vuelta por persona", "Tarifa sujeta a disponibilidad", "Salidas diarias"],
    categories: ["recomendadas", "internacionales"],
    primaryCta: {
      label: "Ver opciones",
      href: "/vuelos/resultados?origen=Buenos%20Aires&destino=R%C3%ADo%20de%20Janeiro&modo=ida-vuelta",
    },
  },
  {
    id: "aep-mad",
    origin: { city: "Buenos Aires", code: "EZE" },
    destination: { city: "Madrid", code: "MAD" },
    shortLabel: "Buenos Aires a Madrid",
    flightType: "Directo · vuelo nocturno",
    duration: "12 h 10 m",
    priceFrom: 950,
    currency: "USD",
    badge: { text: "Vuelo nocturno", tone: "night" },
    image: IMG.madrid,
    imageAlt: "Edificio histórico de Madrid iluminado al anochecer",
    facts: [
      { icon: "moon", label: "Salida noche", value: "22:30" },
      { icon: "bag", label: "Equipaje", value: "1 x 23 kg" },
    ],
    highlights: ["Ida y vuelta por persona", "Equipaje despachado incluido", "Conexiones a toda Europa"],
    categories: ["recomendadas", "internacionales", "larga-distancia"],
    primaryCta: {
      label: "Ver opciones",
      href: "/vuelos/resultados?origen=Buenos%20Aires&destino=Madrid&modo=ida-vuelta",
    },
  },
  {
    id: "aep-mdz",
    origin: { city: "Buenos Aires", code: "AEP" },
    destination: { city: "Mendoza", code: "MDZ" },
    shortLabel: "Buenos Aires a Mendoza",
    flightType: "Directo",
    duration: "1 h 55 m",
    priceFrom: 102,
    currency: "USD",
    image: IMG.mendoza,
    imageAlt: "Viñedos de Mendoza con la cordillera de fondo",
    facts: [
      { icon: "plane", value: "Directo" },
      { icon: "clock", label: "Duración", value: "1 h 55 m" },
    ],
    highlights: ["Ida y vuelta por persona", "Varias frecuencias por día", "Ideal para escapadas de fin de semana"],
    categories: ["nacionales"],
    primaryCta: {
      label: "Ver opciones",
      href: "/vuelos/resultados?origen=Buenos%20Aires&destino=Mendoza&modo=ida-vuelta",
    },
  },
  {
    id: "eze-cun",
    origin: { city: "Buenos Aires", code: "EZE" },
    destination: { city: "Cancún", code: "CUN" },
    shortLabel: "Buenos Aires a Cancún",
    flightType: "Con una escala",
    duration: "11 h 40 m",
    priceFrom: 690,
    currency: "USD",
    image: IMG.cancun,
    imageAlt: "Playa de aguas turquesas en Cancún vista desde el aire",
    facts: [
      { icon: "plane", value: "1 escala" },
      { icon: "clock", label: "Duración", value: "11 h 40 m" },
    ],
    highlights: ["Ida y vuelta por persona", "Tarifa sujeta a disponibilidad", "Combinable con paquete y traslados"],
    categories: ["internacionales", "larga-distancia"],
    primaryCta: {
      label: "Ver opciones",
      href: "/vuelos/resultados?origen=Buenos%20Aires&destino=Canc%C3%BAn&modo=ida-vuelta",
    },
  },
  {
    id: "eze-jfk",
    origin: { city: "Buenos Aires", code: "EZE" },
    destination: { city: "Nueva York", code: "JFK" },
    shortLabel: "Buenos Aires a Nueva York",
    flightType: "Directo · vuelo nocturno",
    duration: "10 h 45 m",
    priceFrom: 880,
    currency: "USD",
    badge: { text: "Vuelo nocturno", tone: "night" },
    image: IMG.nuevayork,
    imageAlt: "Rascacielos de Nueva York al atardecer",
    facts: [
      { icon: "moon", label: "Salida noche", value: "21:50" },
      { icon: "bag", label: "Equipaje", value: "1 x 23 kg" },
    ],
    highlights: ["Ida y vuelta por persona", "Equipaje despachado incluido", "Requiere visa vigente"],
    categories: ["internacionales", "larga-distancia"],
    primaryCta: {
      label: "Ver opciones",
      href: "/vuelos/resultados?origen=Buenos%20Aires&destino=Nueva%20York&modo=ida-vuelta",
    },
  },
];

export const routeCommitments: RouteCommitment[] = [
  {
    icon: "tag",
    tone: "petrol",
    title: "Tarifas sin trampas",
    text: "Te mostramos el costo real, con equipaje y servicios incluidos.",
  },
  {
    icon: "shield",
    tone: "positive",
    title: "Agencia habilitada",
    text: "Emitimos tu ticket con respaldo y todas las garantías.",
  },
  {
    icon: "headset",
    tone: "coral",
    title: "Te acompañamos",
    text: "Si tu vuelo cambia, gestionamos la solución con la aerolínea.",
  },
];
