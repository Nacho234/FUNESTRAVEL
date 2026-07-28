import type { FeaturedHotel, HotelStage } from "@/lib/types";

/**
 * Contenido de la sección editorial de /hoteles.
 *
 * Las tres fotos se cambian acá y nada más: la composición se arma con
 * clip-path sobre los contenedores, no sobre las imágenes.
 */

export const editorialPhotos = {
  /** Suite frente al mar: cama, puertas abiertas, terraza. Manda la composición. */
  room: "/images/hotel-suite-ocean.webp",
  roomAlt: "Suite con cama amplia y puertas abiertas a una terraza frente al mar",
  /** Terraza con desayuno: mesa servida, vegetación y mar de fondo. */
  terrace: "/images/hotel-terrace-breakfast.webp",
  terraceAlt: "Terraza con desayuno servido y vista al mar entre vegetación tropical",
  /** Piscina infinity: reposeras, arquitectura y horizonte. */
  pool: "/images/hotel-infinity-pool.webp",
  poolAlt: "Piscina infinity con reposeras frente al océano",
};

export const hotelStages: HotelStage[] = [
  {
    number: "01",
    title: "Habitación",
    text: "Confort y diseño frente al mar.",
    icon: "bed",
    target: "room",
  },
  {
    number: "02",
    title: "Vista",
    text: "Despertá con el Caribe a tus pies.",
    icon: "view",
    target: "terrace",
  },
  {
    number: "03",
    title: "Experiencia",
    text: "Momentos que se quedan para siempre.",
    icon: "experience",
    target: "pool",
  },
];

/** DEMO: reemplazar por el hotel destacado real antes de producción. */
export const featuredHotel: FeaturedHotel = {
  id: "marea-resort-spa",
  location: "Riviera Maya, México",
  name: "Maréa Resort & Spa",
  nights: "7 noches",
  mealPlan: "Desayuno incluido",
  cancellation: "Cancelación flexible",
  href: "/hoteles",
};
