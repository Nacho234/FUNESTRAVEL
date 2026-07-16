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

/** Configurable entry for the home "experience finder" section. */
export interface TravelExperience {
  id: string;
  slug: string;
  name: string;
  shortPhrase: string;
  title: string;
  description: string;
  imageDesktop: string;
  imageMobile: string;
  imageAlt: string;
  facts: string[];
  destinations: ExperienceDestination[];
  ctaLabel: string;
  ctaHref: string;
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
