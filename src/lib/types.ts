export type Currency = "USD" | "ARS";

export interface Money {
  amount: number;
  currency: Currency;
}

export type TravelStyle =
  | "Playa"
  | "Nieve"
  | "Aventura"
  | "Familia"
  | "Pareja"
  | "Luna de miel"
  | "Gastronomía"
  | "Cultura"
  | "Escapadas"
  | "Cruceros"
  | "Relax"
  | "Lujo"
  | "Amigos"
  | "Bajo presupuesto";

export type Regime =
  | "Solo alojamiento"
  | "Desayuno"
  | "Media pensión"
  | "Pensión completa"
  | "All inclusive";

export interface Destination {
  slug: string;
  name: string;
  country: string;
  region: "Argentina" | "Brasil" | "Caribe" | "Estados Unidos" | "Europa" | "Sudamérica" | "Exóticos";
  image: string;
  tagline: string;
  idealFor: TravelStyle[];
  season: string;
  suggestedNights: string;
  priceFrom: Money;
  trending?: boolean;
  description: string;
  highlights: string[];
}

export interface ItineraryDay {
  day: number;
  city: string;
  title: string;
  description: string;
  meals: string[];
  hotelName?: string;
}

export interface Departure {
  id: string;
  date: string; // ISO
  pricePerPerson: Money;
  seatsLeft: number;
  confirmed: boolean;
}

export interface PackagePromo {
  label: string;
  detail: string;
  validUntil: string;
}

export interface TravelPackage {
  slug: string;
  name: string;
  destinationSlug: string;
  cities: string[];
  nights: number;
  image: string;
  gallery: string[];
  summary: string;
  description: string;
  regime: Regime;
  hotelName: string;
  hotelStars: number;
  transport: "Aéreo" | "Bus" | "Aéreo + Bus" | "Crucero";
  departureCity: string;
  includes: string[];
  notIncludes: string[];
  itinerary: ItineraryDay[];
  departures: Departure[];
  priceFrom: Money;
  installments?: { count: number; approxArs: number };
  taxesIncluded: boolean;
  travelStyles: TravelStyle[];
  rating: number;
  reviewsCount: number;
  cancellationPolicy: string;
  requirements: string[];
  featured?: boolean;
  promo?: PackagePromo;
  hasExcursions: boolean;
  hasTransfers: boolean;
  hasInsurance: boolean;
  singleSupplementPct: number;
  childDiscountPct: number;
}

export interface RoomType {
  id: string;
  name: string;
  capacity: number;
  beds: string;
  sizeM2: number;
  view: string;
  amenities: string[];
  regime: Regime;
  cancellation: string;
  pricePerNight: Money;
  available: number;
}

export interface Hotel {
  slug: string;
  name: string;
  destinationSlug: string;
  stars: number;
  address: string;
  distances: { place: string; distance: string }[];
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  amenities: string[];
  checkIn: string;
  checkOut: string;
  policies: string[];
  rooms: RoomType[];
  description: string;
}

export interface Excursion {
  slug: string;
  name: string;
  destinationSlug: string;
  duration: string;
  language: string;
  meetingPoint: string;
  schedule: string;
  difficulty: "Baja" | "Moderada" | "Alta";
  minAge: number;
  includes: string[];
  bring: string[];
  weatherPolicy: string;
  price: Money;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  category: "Naturaleza" | "Cultura" | "Aventura" | "Gastronomía" | "Náutica";
}

export interface FlightOption {
  id: string;
  airline: string;
  airlineCode: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  depTime: string;
  arrTime: string;
  duration: string;
  stops: number;
  stopDetail?: string;
  baggage: { carryOn: boolean; checked: number };
  fareClass: "Economy" | "Economy Flex" | "Premium Economy" | "Business";
  changes: string;
  refundable: boolean;
  price: Money;
}

export interface GroupTrip {
  slug: string;
  name: string;
  image: string;
  coordinator: string;
  confirmedDate: string;
  days: number;
  seatsLeft: number;
  totalSeats: number;
  departureCity: string;
  profile: string;
  itinerarySummary: string[];
  infoMeeting: string;
  price: Money;
  installments?: { count: number; approxArs: number };
}

export interface Promotion {
  id: string;
  title: string;
  detail: string;
  includes: string;
  validUntil: string;
  priceFrom?: Money;
  tag: "Cuotas" | "Descuento" | "Cupos limitados" | "Salida confirmada" | "Compra anticipada" | "Grupos";
  conditions: string;
  image?: string;
  href: string;
}

/** Configurable entry for the home promotions showcase (hero + secondary pieces). */
export interface ShowcasePromo {
  id: string;
  layout: "hero" | "secondary-photo" | "secondary-typographic";
  priority: number;
  active: boolean;
  badge: string;
  title: string;
  destination: string;
  description: string;
  image?: string;
  includes: string;
  facts?: string[];
  priceFrom?: Money;
  previousPrice?: Money;
  discountPct?: number;
  installmentsCount?: number;
  departureCity?: string;
  availabilityNote?: string;
  validUntil: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  conditions: string;
}

/** Curated destination entry for the home "destinos elegidos" section. */
export interface CuratedDestination {
  id: string;
  slug: string;
  name: string;
  country: string;
  imageDesktop: string;
  imageMobile: string;
  imageAlt: string;
  /** Why the team picked it right now, e.g. "Temporada de invierno". */
  reason: string;
  description: string;
  priceFrom: Money;
  priceBase: string;
  taxesIncluded: boolean;
  flightIncluded: boolean;
  installmentsNote?: string;
  nightsMin: number;
  nightsMax: number;
  departureCities: string[];
  bestSeason?: string;
  experienceType: string;
  ctaLabel: string;
  ctaHref: string;
  coordinates?: string;
  priority: number;
  featured: boolean;
  updatedAt: string;
  active: boolean;
  variant: "hero" | "panel" | "plaque" | "editorial";
}

/** Related destination reference shown inside the experience finder panel. */
export interface ExperienceDestination {
  name: string;
  tag: string;
  href: string;
  image: string;
  priceFrom?: Money;
}

/**
 * Configurable entry for the home "experience finder" section. Each entry owns
 * everything the visual panel renders, so swapping a background or a CTA is a
 * data edit, never a layout edit.
 */
export interface TravelExperience {
  id: string;
  slug: string;
  /** Label shown in the numbered selector. */
  name: string;
  /** One-line subtitle revealed under the active selector item. */
  shortPhrase: string;
  /** Small label above the panel title. */
  eyebrow: string;
  title: string;
  description: string;
  /** Panel background, wide crop. */
  imageDesktop: string;
  /** Panel background, tall crop for mobile. */
  imageMobile: string;
  imageAlt: string;
  /** Short bullet points listed under the panel description. */
  facts: string[];
  destinations: ExperienceDestination[];
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  accent?: string;
  order: number;
  active: boolean;
}

export interface CommercialBenefit {
  id: string;
  title: string;
  detail: string;
  linkLabel: string;
  linkHref: string;
}

/** A real traveler story for the home testimonials section and /experiencias. */
export interface TravelStory {
  id: string;
  travelerName: string;
  city: string;
  avatar?: string;
  tripImages: string[];
  tripImageAlt: string;
  destination: string;
  country: string;
  tripType: string;
  date: string;
  rating: number;
  storyTitle: string;
  highlight: string;
  fullText: string;
  verified: boolean;
  relatedPackageSlug?: string;
  ctaLabel: string;
  ctaHref: string;
  publishPermission: boolean;
  active: boolean;
  order: number;
  layout: "featured" | "secondary" | "incident";
}

export interface TravelerPhoto {
  id: string;
  image: string;
  alt: string;
  destination: string;
  travelers: string;
  date: string;
  description: string;
  relatedPackageSlug?: string;
}

export interface Testimonial {
  name: string;
  location: string;
  destination: string;
  date: string;
  rating: number;
  text: string;
  tripType: TravelStyle;
  avatar: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  date: string;
  image: string;
  body: string[];
}

export interface FAQItem {
  q: string;
  a: string;
  category: "Reservas" | "Pagos" | "Cancelaciones" | "Documentación" | "Equipaje" | "Asistencia";
}

/* ── Sección "Vuelos con respaldo" (/vuelos) ─────────────────────────── */

/** Una línea del desglose de precio de la tarjeta de embarque. */
export interface PriceBreakdownItem {
  label: string;
  amount: string;
  /** Marca el extra que suele quedar fuera del precio publicado. */
  highlight?: boolean;
}

export interface FlightAssuranceRoute {
  /** Código del aeropuerto de origen; también rotula la pestaña. */
  code: string;
  city: string;
  to: { code: string; city: string };
  stopsLabel: string;
  duration: string;
  date: string;
  depTime: string;
  arrTime: string;
  airline: string;
  fareName: string;
  fareTag?: string;
  priceBreakdown: PriceBreakdownItem[];
  /** Total con los extras incluidos: lo que realmente se paga. */
  realCost: string;
  includes: string[];
  conditions: { label: string; value: string }[];
  href: string;
}

export type FlightAssuranceIcon =
  | "search"
  | "ticket"
  | "headset"
  | "shield"
  | "clipboard"
  | "person";

export interface FlightAssuranceStep {
  title: string;
  text: string;
  icon: FlightAssuranceIcon;
}

export interface FlightAssuranceTrust {
  title: string;
  text: string;
  icon: FlightAssuranceIcon;
}

/* ── Rutas destacadas (/vuelos) ──────────────────────────────────────── */

export type RouteCategory = "recomendadas" | "nacionales" | "internacionales" | "larga-distancia";

/** Dato suelto de la franja inferior de la tarjeta: ícono, rótulo y valor. */
export interface RouteFact {
  icon: "plane" | "calendar" | "clock" | "moon" | "bag";
  label?: string;
  value: string;
}

export interface FeaturedRoute {
  id: string;
  origin: { city: string; code: string };
  destination: { city: string; code: string };
  /** Rótulo corto para lectores de pantalla y para el panel. */
  shortLabel: string;
  flightType: string;
  duration: string;
  priceFrom: number;
  currency: "USD" | "ARS";
  /** Distintivo sobre la foto, p. ej. "Temporada de invierno". */
  badge?: { text: string; tone: "petrol" | "positive" | "night" };
  image: string;
  imageAlt: string;
  facts: RouteFact[];
  highlights: string[];
  notes?: string;
  categories: RouteCategory[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface RouteCommitment {
  icon: "tag" | "shield" | "headset";
  tone: "petrol" | "positive" | "coral";
  title: string;
  text: string;
}

/* ── Sección editorial de hoteles (/hoteles) ─────────────────────────── */

export interface FeaturedHotel {
  id: string;
  location: string;
  name: string;
  nights: string;
  mealPlan: string;
  cancellation: string;
  href: string;
}

export type HotelStageIcon = "bed" | "view" | "experience";

export interface HotelStage {
  number: string;
  title: string;
  text: string;
  icon: HotelStageIcon;
  /** Qué foto de la composición enfatiza esta etapa. */
  target: "room" | "terrace" | "pool";
}

/* ── Promoción destacada (/promociones) ──────────────────────────────── */

export interface FeaturedPromotionFact {
  icon: "capitals" | "nights" | "guided" | "coordination";
  text: string;
}

export interface FeaturedPromotionTerm {
  icon: "shield" | "lock" | "seats" | "check";
  title: string;
  text: string;
}

export interface FeaturedPromotion {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  facts: FeaturedPromotionFact[];
  priceFrom: string;
  priceSuffix: string;
  priceBasis: string;
  /** Se muestra en el sello circular sobre la foto. */
  validUntil: { label: string; day: string; year: string };
  terms: FeaturedPromotionTerm[];
  imageDesktop: string;
  /** Recorte alternativo para pantalla angosta; si falta, se usa el de escritorio. */
  imageMobile?: string;
  imageAlt: string;
  /** Valor CSS de object-position, p. ej. "60% center". */
  imagePositionDesktop?: string;
  imagePositionMobile?: string;
  ctaLabel: string;
  href: string;
}
