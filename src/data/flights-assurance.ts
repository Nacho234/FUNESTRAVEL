import type {
  FlightAssuranceRoute,
  FlightAssuranceStep,
  FlightAssuranceTrust,
} from "@/lib/types";

/**
 * Contenido de la sección "Vuelos con respaldo" de /vuelos.
 *
 * Las rutas son DEMO: los precios y horarios ilustran cómo se compone el costo
 * real de una tarifa, no son disponibilidad viva. Al conectar el GDS, esto se
 * reemplaza por el adaptador y la sección no cambia.
 */

export const assuranceRoutes: FlightAssuranceRoute[] = [
  {
    code: "ROS",
    city: "Rosario",
    to: { code: "BRC", city: "Bariloche" },
    stopsLabel: "Directo",
    duration: "2 h 05 m",
    date: "12 AGO 2025",
    depTime: "08:15",
    arrTime: "10:20",
    airline: "Aerolíneas Argentinas",
    fareName: "Tarifa Estándar",
    fareTag: "Recomendada",
    priceBreakdown: [
      { label: "Tarifa publicada", amount: "USD 96" },
      { label: "Equipaje despachado", amount: "USD 24", highlight: true },
    ],
    realCost: "USD 120",
    includes: ["Carry-on", "Equipaje despachado (23 kg)", "Cambios permitidos", "Selección de asiento"],
    conditions: [
      { label: "Cambios", value: "Permitidos con cargo" },
      { label: "Reembolsos", value: "Según condiciones" },
      { label: "Acumulás millas", value: "Sí" },
    ],
    href: "/vuelos/resultados?origen=Rosario&destino=Bariloche&modo=ida-vuelta",
  },
  {
    code: "AEP",
    city: "Buenos Aires",
    to: { code: "MDZ", city: "Mendoza" },
    stopsLabel: "Directo",
    duration: "1 h 55 m",
    date: "03 SEP 2025",
    depTime: "07:40",
    arrTime: "09:35",
    airline: "Aerolíneas Argentinas",
    fareName: "Tarifa Promo",
    fareTag: "Más económica",
    priceBreakdown: [
      { label: "Tarifa publicada", amount: "USD 74" },
      { label: "Equipaje despachado", amount: "USD 28", highlight: true },
    ],
    realCost: "USD 102",
    includes: ["Carry-on", "Equipaje despachado (15 kg)", "Selección de asiento"],
    conditions: [
      { label: "Cambios", value: "Con cargo y diferencia" },
      { label: "Reembolsos", value: "No reembolsable" },
      { label: "Acumulás millas", value: "Parcial" },
    ],
    href: "/vuelos/resultados?origen=Buenos%20Aires&destino=Mendoza&modo=ida-vuelta",
  },
  {
    code: "EZE",
    city: "Buenos Aires",
    to: { code: "GIG", city: "Río de Janeiro" },
    stopsLabel: "Directo",
    duration: "2 h 55 m",
    date: "18 OCT 2025",
    depTime: "08:45",
    arrTime: "11:40",
    airline: "Aerolíneas Argentinas",
    fareName: "Tarifa Estándar",
    fareTag: "Recomendada",
    priceBreakdown: [
      { label: "Tarifa publicada", amount: "USD 289" },
      { label: "Equipaje despachado", amount: "USD 49", highlight: true },
    ],
    realCost: "USD 338",
    includes: ["Carry-on", "Equipaje despachado (23 kg)", "Cambios permitidos", "Selección de asiento"],
    conditions: [
      { label: "Cambios", value: "Permitidos con cargo" },
      { label: "Reembolsos", value: "Según condiciones" },
      { label: "Acumulás millas", value: "Sí" },
    ],
    href: "/vuelos/resultados?origen=Buenos%20Aires&destino=R%C3%ADo%20de%20Janeiro&modo=ida-vuelta",
  },
  {
    code: "MAD",
    city: "Buenos Aires",
    to: { code: "MAD", city: "Madrid" },
    stopsLabel: "Directo · nocturno",
    duration: "12 h 10 m",
    date: "05 NOV 2025",
    depTime: "23:55",
    arrTime: "16:05",
    airline: "Iberia",
    fareName: "Tarifa Optima",
    fareTag: "Con equipaje",
    priceBreakdown: [
      { label: "Tarifa publicada", amount: "USD 812" },
      { label: "Equipaje despachado", amount: "USD 138", highlight: true },
    ],
    realCost: "USD 950",
    includes: ["Carry-on", "Equipaje despachado (23 kg)", "Cambios permitidos", "Comidas a bordo"],
    conditions: [
      { label: "Cambios", value: "Permitidos con cargo" },
      { label: "Reembolsos", value: "Parcial según tarifa" },
      { label: "Acumulás millas", value: "Sí" },
    ],
    href: "/vuelos/resultados?origen=Buenos%20Aires&destino=Madrid&modo=ida-vuelta",
  },
];

export const assuranceSteps: FlightAssuranceStep[] = [
  {
    title: "Vemos el costo real",
    text: "Comparamos tarifa, equipaje y servicios para mostrarte la opción completa.",
    icon: "search",
  },
  {
    title: "Emitimos y verificamos",
    text: "La reserva queda emitida y controlada por una agencia habilitada.",
    icon: "ticket",
  },
  {
    title: "Respondemos ante cambios",
    text: "Si la aerolínea modifica tu vuelo, gestionamos alternativas directamente con ellos.",
    icon: "headset",
  },
];

export const assuranceTrust: FlightAssuranceTrust[] = [
  {
    title: "Agencia habilitada",
    text: "Emisión respaldada y documentación completa de tu viaje.",
    icon: "shield",
  },
  {
    title: "Condiciones claras",
    text: "Equipaje, cambios y restricciones visibles antes de pagar.",
    icon: "clipboard",
  },
  {
    title: "Atención durante el viaje",
    text: "Un canal directo para resolver reprogramaciones e imprevistos.",
    icon: "person",
  },
];
