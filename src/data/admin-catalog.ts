import { packages } from "./packages";
import { flightResults } from "./flights";
import { providers, type Provider } from "./admin";

/**
 * Demo data for the catalog modules of the backoffice.
 * DEMO — replace with real backend data before production.
 */

/* ── traslados ───────────────────────────────────────────────────── */

export interface AdminTransfer {
  id: string;
  kind: "Privado" | "Compartido";
  origin: string;
  destination: string;
  vehicle: string;
  capacity: number;
  provider: string;
  priceUsd: number;
  availability: string;
  status: "publicado" | "borrador" | "pausado";
}

export const adminTransfers: AdminTransfer[] = [
  { id: "tr-01", kind: "Compartido", origin: "Aeropuerto PUJ", destination: "Hoteles zona Bávaro", vehicle: "Minibús 18 pax", capacity: 18, provider: "Bávaro Hotels Group", priceUsd: 22, availability: "Todos los vuelos confirmados", status: "publicado" },
  { id: "tr-02", kind: "Privado", origin: "Aeropuerto BRC", destination: "Hoteles Av. Bustillo", vehicle: "Van Sprinter 12 pax", capacity: 12, provider: "Patagonia Receptivo SRL", priceUsd: 65, availability: "Sujeto a reserva 48 h", status: "publicado" },
  { id: "tr-03", kind: "Compartido", origin: "Hoteles Bariloche", destination: "Cerro Catedral", vehicle: "Bus 45 pax", capacity: 45, provider: "Patagonia Receptivo SRL", priceUsd: 9, availability: "Diario 8:00 y 9:30 en temporada", status: "publicado" },
  { id: "tr-04", kind: "Privado", origin: "Aeropuerto EZE", destination: "Hoteles CABA", vehicle: "Sedán ejecutivo 3 pax", capacity: 3, provider: "Andes Operador Mayorista", priceUsd: 48, availability: "24 h con reserva previa", status: "publicado" },
  { id: "tr-05", kind: "Privado", origin: "Aeropuerto GIG", destination: "Copacabana e Ipanema", vehicle: "Van 8 pax", capacity: 8, provider: "Andes Operador Mayorista", priceUsd: 55, availability: "Pendiente de tarifario 2027", status: "borrador" },
];

/* ── seguros ─────────────────────────────────────────────────────── */

export interface AdminInsurance {
  id: string;
  company: string;
  plan: string;
  coverageUsd: number;
  ageRange: string;
  maxDays: number;
  exclusions: string[];
  pricePerDayUsd: number;
  status: "publicado" | "borrador" | "pausado";
}

export const adminInsurances: AdminInsurance[] = [
  { id: "seg-01", company: "Assist Total", plan: "Regional 30K", coverageUsd: 30000, ageRange: "0 a 74 años", maxDays: 30, exclusions: ["Enfermedades preexistentes no declaradas", "Deportes profesionales"], pricePerDayUsd: 2.1, status: "publicado" },
  { id: "seg-02", company: "Assist Total", plan: "Mundial 100K (Schengen)", coverageUsd: 100000, ageRange: "0 a 74 años", maxDays: 60, exclusions: ["Preexistencias no declaradas", "Deportes extremos sin adicional"], pricePerDayUsd: 4.3, status: "publicado" },
  { id: "seg-03", company: "Assist Total", plan: "USA y Canadá 150K", coverageUsd: 150000, ageRange: "0 a 69 años", maxDays: 45, exclusions: ["Preexistencias", "Embarazo de más de 26 semanas"], pricePerDayUsd: 6.8, status: "publicado" },
  { id: "seg-04", company: "Assist Total", plan: "Invierno + cancelación 300K", coverageUsd: 300000, ageRange: "0 a 69 años", maxDays: 30, exclusions: ["Esquí fuera de pista sin guía", "Competencias"], pricePerDayUsd: 9.5, status: "pausado" },
];

/* ── vuelos manuales ─────────────────────────────────────────────── */

export interface AdminFlight {
  id: string;
  airline: string;
  flightNumber: string;
  route: string;
  depTime: string;
  arrTime: string;
  fareClass: string;
  baggage: string;
  costUsd: number;
  priceUsd: number;
  provider: string;
  status: "publicado" | "borrador" | "pausado";
}

export const adminFlightsManual: AdminFlight[] = flightResults.map((f, i) => ({
  id: f.id,
  airline: f.airline,
  flightNumber: `${f.airlineCode} ${1200 + i * 7}`,
  route: `${f.fromCode} → ${f.toCode}`,
  depTime: f.depTime,
  arrTime: f.arrTime,
  fareClass: f.fareClass,
  baggage: f.baggage.checked > 0 ? `Carry-on + ${f.baggage.checked} valija 23 kg` : "Solo carry-on",
  costUsd: Math.round(f.price.amount * 0.91),
  priceUsd: f.price.amount,
  provider: f.airline === "Aerolíneas Argentinas" ? "Aerolíneas Argentinas (agencia IATA)" : "Andes Operador Mayorista",
  status: i === 5 ? "pausado" : "publicado",
}));

/* ── disponibilidad ──────────────────────────────────────────────── */

export interface AvailabilityRow {
  packageSlug: string;
  packageName: string;
  departureId: string;
  date: string;
  total: number;
  sold: number;
  blocked: number;
  waitlist: number;
  minRequired: number;
  confirmed: boolean;
}

const soldSeed = [18, 24, 11, 8, 15, 28, 9, 13];

export const availabilityMatrix: AvailabilityRow[] = packages.flatMap((p) =>
  p.departures.map((d, i) => {
    const sold = soldSeed[(p.slug.length + i) % soldSeed.length];
    const blocked = i % 3 === 0 ? 2 : 0;
    return {
      packageSlug: p.slug,
      packageName: p.name,
      departureId: d.id,
      date: d.date,
      total: sold + blocked + d.seatsLeft,
      sold,
      blocked,
      waitlist: d.seatsLeft <= 6 ? 3 : 0,
      minRequired: p.nights >= 8 ? 10 : 6,
      confirmed: d.confirmed,
    };
  }),
);

/* ── biblioteca de inclusiones ───────────────────────────────────── */

export interface InclusionItem {
  id: string;
  label: string;
}

export const inclusionsLibrary: InclusionItem[] = [
  { id: "inc-aereo", label: "Aéreo ida y vuelta" },
  { id: "inc-equipaje", label: "Equipaje de bodega 23 kg" },
  { id: "inc-alojamiento", label: "Alojamiento según itinerario" },
  { id: "inc-regimen", label: "Régimen de comidas indicado" },
  { id: "inc-traslados", label: "Traslados aeropuerto - hotel - aeropuerto" },
  { id: "inc-excursiones", label: "Excursiones detalladas en el itinerario" },
  { id: "inc-asistencia", label: "Asistencia al viajero" },
  { id: "inc-tasas", label: "Tasas e impuestos incluidos" },
  { id: "inc-propinas", label: "Propinas a guías y choferes" },
  { id: "inc-comidas", label: "Comidas no indicadas en el itinerario" },
  { id: "inc-coordinador", label: "Coordinador acompañante" },
  { id: "inc-visado", label: "Gestión de visados" },
];

/* ── borradores para estados variados en el catálogo ─────────────── */

export interface ProductDraft {
  id: string;
  type: "Paquete" | "Excursión" | "Hotel";
  name: string;
  destination: string;
  priceFromUsd?: number;
  status: "borrador" | "pausado";
  note: string;
}

export const productDrafts: ProductDraft[] = [
  { id: "draft-01", type: "Paquete", name: "Brasil nordeste: Maceió 7 noches", destination: "Maceió", priceFromUsd: 890, status: "borrador", note: "Falta confirmar tarifario 2027 del operador." },
  { id: "draft-02", type: "Excursión", name: "Cabalgata en Estancia Fortín Chacabuco", destination: "Bariloche", priceFromUsd: 55, status: "borrador", note: "Esperando fotos del prestador." },
  { id: "draft-03", type: "Paquete", name: "Semana Santa en Cataratas", destination: "Puerto Iguazú", priceFromUsd: 420, status: "pausado", note: "Pausado hasta definir cupos aéreos." },
];

/* ── proveedores extendidos ──────────────────────────────────────── */

export interface AdminProvider extends Provider {
  id: string;
  balanceUsd: number;
  performance: number; // 1 a 5
  openIncidents: number;
  currency: "USD" | "ARS";
  paymentTerms: string;
  documents: { name: string; status: "vigente" | "vencido" | "pendiente" }[];
  incidents: { date: string; detail: string; resolved: boolean }[];
  notes: string;
}

const providerExtras: Omit<AdminProvider, keyof Provider>[] = [
  {
    id: "prov-01",
    balanceUsd: -4200,
    performance: 4,
    openIncidents: 0,
    currency: "USD",
    paymentTerms: "30 días fecha de factura",
    documents: [
      { name: "Contrato marco 2025-2027", status: "vigente" },
      { name: "Tarifario Caribe verano", status: "vigente" },
    ],
    incidents: [{ date: "2026-03-12", detail: "Demora en confirmación de cupos de Semana Santa.", resolved: true }],
    notes: "Prioridad para bloqueos de Caribe. Pedir tarifas 2027 en agosto.",
  },
  {
    id: "prov-02",
    balanceUsd: -1150,
    performance: 5,
    openIncidents: 0,
    currency: "ARS",
    paymentTerms: "15 días",
    documents: [
      { name: "Contrato receptivo 2026", status: "vigente" },
      { name: "Seguro de responsabilidad civil", status: "pendiente" },
    ],
    incidents: [],
    notes: "Excelente respuesta en temporada de nieve.",
  },
  {
    id: "prov-03",
    balanceUsd: 0,
    performance: 4,
    openIncidents: 0,
    currency: "ARS",
    paymentTerms: "Prepago BSP",
    documents: [{ name: "Acreditación IATA", status: "vigente" }],
    incidents: [],
    notes: "Emisión directa por BSP. Tarifas grupales con 10 asientos mínimo.",
  },
  {
    id: "prov-04",
    balanceUsd: -680,
    performance: 3,
    openIncidents: 1,
    currency: "USD",
    paymentTerms: "Cierre mensual",
    documents: [{ name: "Convenio de asistencia 2026", status: "vigente" }],
    incidents: [{ date: "2026-06-28", detail: "Reintegro de valija demorada (RJ enero) sin resolución.", resolved: false }],
    notes: "Reclamar seguimiento del caso Ferreyra.",
  },
  {
    id: "prov-05",
    balanceUsd: -9800,
    performance: 4,
    openIncidents: 1,
    currency: "USD",
    paymentTerms: "50% al bloqueo, 50% a 30 días",
    documents: [
      { name: "Contrato de cupos 2026-2027", status: "vigente" },
      { name: "Tarifas confidenciales Q3", status: "vencido" },
    ],
    incidents: [{ date: "2026-07-10", detail: "Sin confirmación del bloqueo de septiembre (6 habitaciones).", resolved: false }],
    notes: "Escalar con la representante si no responde antes del 18/7.",
  },
];

export const adminProviders: AdminProvider[] = providers.map((p, i) => ({ ...p, ...providerExtras[i] }));

/* ── historial de tarifas (demo) ─────────────────────────────────── */

export interface RateChange {
  id: string;
  date: string;
  user: string;
  target: string;
  before: string;
  after: string;
}

export const rateHistory: RateChange[] = [
  { id: "rc-01", date: "2026-07-14", user: "Diego Anselmi", target: "Bariloche a la nieve · salida 22/8", before: "USD 649", after: "USD 629" },
  { id: "rc-02", date: "2026-07-10", user: "Sofía Gachet", target: "Punta Cana esencial · salida 9/1", before: "USD 1.640", after: "USD 1.690" },
  { id: "rc-03", date: "2026-07-02", user: "Diego Anselmi", target: "Europa clásica · markup general", before: "16%", after: "17%" },
  { id: "rc-04", date: "2026-06-27", user: "Sofía Gachet", target: "Escapada a Iguazú · salida 9/10", before: "USD 379", after: "USD 369" },
];
