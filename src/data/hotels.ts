import type { Hotel } from "@/lib/types";
import { IMG } from "./img";

export const hotels: Hotel[] = [
  {
    slug: "vista-bavaro-resort",
    name: "Vista Bávaro Resort & Spa",
    destinationSlug: "punta-cana",
    stars: 5,
    address: "Playa Bávaro, Punta Cana, República Dominicana",
    distances: [
      { place: "Playa Bávaro", distance: "Frente al mar" },
      { place: "Aeropuerto PUJ", distance: "25 min en auto" },
      { place: "Centro comercial San Juan", distance: "10 min en auto" },
    ],
    rating: 4.7,
    reviewsCount: 312,
    image: IMG.hotelBeach,
    gallery: [IMG.hotelBeach, IMG.hotelPool, IMG.hotelRoom, IMG.puntacana],
    amenities: ["All inclusive 24 h", "5 piscinas", "Spa con circuito de aguas", "Kids club", "7 restaurantes", "Deportes náuticos sin motor", "Wi-Fi en todo el resort", "Shows nocturnos"],
    checkIn: "15:00",
    checkOut: "12:00",
    policies: ["Menores de 12 años gratis compartiendo habitación con dos adultos (máximo 2)", "Brazalete identificatorio obligatorio", "Reserva de restaurantes de especialidades con 24 h de anticipación"],
    description:
      "Resort de 420 habitaciones sobre la playa Bávaro, renovado en 2024. La zona de piscinas escalonadas termina en la arena y los siete restaurantes cubren cocina dominicana, italiana, japonesa y de mercado.",
    rooms: [
      { id: "vb-deluxe", name: "Deluxe vista jardín", capacity: 3, beds: "1 king o 2 queen", sizeM2: 38, view: "Jardín tropical", amenities: ["Balcón", "Minibar incluido", "TV 55”", "Caja de seguridad"], regime: "All inclusive", cancellation: "Sin costo hasta 21 días antes", pricePerNight: { amount: 178, currency: "USD" }, available: 9 },
      { id: "vb-oceanview", name: "Premium vista al mar", capacity: 3, beds: "1 king", sizeM2: 42, view: "Mar Caribe", amenities: ["Balcón con reposeras", "Minibar premium", "Bata y pantuflas", "Late check-out sujeto a disponibilidad"], regime: "All inclusive", cancellation: "Sin costo hasta 21 días antes", pricePerNight: { amount: 224, currency: "USD" }, available: 4 },
      { id: "vb-swimup", name: "Swim-up suite", capacity: 2, beds: "1 king", sizeM2: 46, view: "Piscina privada compartida", amenities: ["Acceso directo a piscina", "Servicio a la habitación 24 h", "Cafetera espresso"], regime: "All inclusive", cancellation: "Reembolsable con penalidad del 10%", pricePerNight: { amount: 268, currency: "USD" }, available: 2 },
    ],
  },
  {
    slug: "hosteria-luz-del-lago",
    name: "Hostería Luz del Lago",
    destinationSlug: "bariloche",
    stars: 4,
    address: "Av. Bustillo km 2,5, San Carlos de Bariloche",
    distances: [
      { place: "Centro cívico", distance: "5 min en auto" },
      { place: "Cerro Catedral", distance: "25 min en auto" },
      { place: "Playa Bonita", distance: "800 m" },
    ],
    rating: 4.6,
    reviewsCount: 187,
    image: IMG.hotelMountain,
    gallery: [IMG.hotelMountain, IMG.bariloche, IMG.hotelRoom],
    amenities: ["Vista al Nahuel Huapi", "Desayuno patagónico", "Sala de esquí con secado de botas", "Estacionamiento", "Wi-Fi", "Bar con chimenea"],
    checkIn: "14:00",
    checkOut: "10:00",
    policies: ["Habitaciones familiares hasta 4 personas", "No se admiten mascotas", "Guarda equipaje sin cargo el día de salida"],
    description:
      "Hostería de montaña con 28 habitaciones sobre la costa del Nahuel Huapi. El desayuno con productos regionales y la sala de esquí propia la vuelven una base cómoda tanto en invierno como en verano.",
    rooms: [
      { id: "ll-standard", name: "Standard vista bosque", capacity: 2, beds: "1 queen o 2 individuales", sizeM2: 24, view: "Bosque de coihues", amenities: ["Calefacción central", "TV", "Frigobar"], regime: "Desayuno", cancellation: "Sin costo hasta 10 días antes", pricePerNight: { amount: 92, currency: "USD" }, available: 7 },
      { id: "ll-lago", name: "Superior vista lago", capacity: 3, beds: "1 king", sizeM2: 30, view: "Lago Nahuel Huapi", amenities: ["Balcón", "Cafetera", "TV 50”"], regime: "Desayuno", cancellation: "Sin costo hasta 10 días antes", pricePerNight: { amount: 126, currency: "USD" }, available: 3 },
      { id: "ll-familiar", name: "Familiar con entrepiso", capacity: 4, beds: "1 queen + 2 individuales", sizeM2: 42, view: "Jardín y lago parcial", amenities: ["Entrepiso para chicos", "Bañera", "Microondas"], regime: "Desayuno", cancellation: "Sin costo hasta 15 días antes", pricePerNight: { amount: 158, currency: "USD" }, available: 2 },
    ],
  },
  {
    slug: "atlantico-praia",
    name: "Atlântico Praia Hotel",
    destinationSlug: "rio-de-janeiro",
    stars: 4,
    address: "Av. Atlântica 1500, Copacabana, Río de Janeiro",
    distances: [
      { place: "Playa de Copacabana", distance: "Cruzando la avenida" },
      { place: "Estación de metro Cardeal Arcoverde", distance: "400 m" },
      { place: "Pan de Azúcar", distance: "15 min en auto" },
    ],
    rating: 4.4,
    reviewsCount: 428,
    image: IMG.hotelPool,
    gallery: [IMG.hotelPool, IMG.rio, IMG.hotelRoom],
    amenities: ["Piscina en la terraza", "Desayuno con frutas tropicales", "Gimnasio", "Bar rooftop", "Wi-Fi", "Recepción 24 h"],
    checkIn: "14:00",
    checkOut: "12:00",
    policies: ["Documento obligatorio para todos los huéspedes (DNI o pasaporte)", "Menores de 6 años gratis", "Caja de seguridad en recepción sin cargo"],
    description:
      "Clásico de Copacabana con la terraza-piscina mirando al mar. Habitaciones renovadas, desayuno carioca y ubicación inmejorable para moverse en metro hacia Ipanema o el centro.",
    rooms: [
      { id: "ap-interna", name: "Standard interna", capacity: 2, beds: "1 queen", sizeM2: 20, view: "Interna silenciosa", amenities: ["Aire acondicionado", "TV", "Frigobar"], regime: "Desayuno", cancellation: "Sin costo hasta 7 días antes", pricePerNight: { amount: 84, currency: "USD" }, available: 11 },
      { id: "ap-lateral", name: "Superior vista lateral al mar", capacity: 3, beds: "1 queen + 1 individual", sizeM2: 26, view: "Mar lateral", amenities: ["Balcón francés", "Cafetera", "Blackout"], regime: "Desayuno", cancellation: "Sin costo hasta 7 días antes", pricePerNight: { amount: 112, currency: "USD" }, available: 5 },
      { id: "ap-frente", name: "Premium frente al mar", capacity: 2, beds: "1 king", sizeM2: 30, view: "Playa de Copacabana", amenities: ["Vista total al mar", "Bata y pantuflas", "Late check-out incluido"], regime: "Desayuno", cancellation: "Reembolsable con penalidad del 15%", pricePerNight: { amount: 149, currency: "USD" }, available: 3 },
    ],
  },
  {
    slug: "portal-de-salta",
    name: "Hotel Portal de Salta",
    destinationSlug: "salta",
    stars: 4,
    address: "Balcarce 252, Salta capital",
    distances: [
      { place: "Plaza 9 de Julio", distance: "3 cuadras" },
      { place: "Paseo Balcarce", distance: "En la misma calle" },
      { place: "Teleférico San Bernardo", distance: "15 min a pie" },
    ],
    rating: 4.5,
    reviewsCount: 156,
    image: IMG.hotelLobby,
    gallery: [IMG.hotelLobby, IMG.salta, IMG.hotelRoom],
    amenities: ["Piscina climatizada", "Desayuno regional con tortillas y quesos", "Cava de vinos salteños", "Estacionamiento", "Wi-Fi"],
    checkIn: "13:00",
    checkOut: "10:00",
    policies: ["Early check-in sujeto a disponibilidad", "Excursiones salen desde la puerta del hotel"],
    description:
      "Casona colonial reciclada en el corredor gastronómico de la calle Balcarce. Patios con galerías, piscina interna y un desayuno regional que es un motivo más para quedarse.",
    rooms: [
      { id: "ps-clasica", name: "Clásica colonial", capacity: 2, beds: "1 queen o 2 individuales", sizeM2: 22, view: "Patio interno", amenities: ["Calefacción", "TV", "Escritorio"], regime: "Desayuno", cancellation: "Sin costo hasta 5 días antes", pricePerNight: { amount: 68, currency: "USD" }, available: 8 },
      { id: "ps-balcon", name: "Superior con balcón", capacity: 3, beds: "1 king", sizeM2: 28, view: "Calle Balcarce", amenities: ["Balcón colonial", "Cafetera", "Bañera"], regime: "Desayuno", cancellation: "Sin costo hasta 5 días antes", pricePerNight: { amount: 89, currency: "USD" }, available: 4 },
    ],
  },
  {
    slug: "selva-iryapu",
    name: "Hotel Selva Iryapú",
    destinationSlug: "iguazu",
    stars: 4,
    address: "Selva Iryapú s/n, Puerto Iguazú, Misiones",
    distances: [
      { place: "Parque Nacional Iguazú", distance: "20 min en auto" },
      { place: "Centro de Puerto Iguazú", distance: "10 min en auto" },
      { place: "Hito Tres Fronteras", distance: "12 min en auto" },
    ],
    rating: 4.6,
    reviewsCount: 234,
    image: IMG.hotelPool,
    gallery: [IMG.hotelPool, IMG.iguazu, IMG.hotelRoom],
    amenities: ["Piscina en la selva", "Desayuno con frutas misioneras", "Senderos propios de avistaje", "Restaurante regional", "Wi-Fi", "Traslados al parque"],
    checkIn: "14:00",
    checkOut: "10:00",
    policies: ["Repelente disponible en recepción", "Avistaje de aves gratuito los sábados a las 7:30"],
    description:
      "Lodge rodeado por la selva misionera dentro de las 600 hectáreas de Iryapú. Piscina entre la vegetación, sonidos de la selva y tucanes desde el balcón: la antesala perfecta de las Cataratas.",
    rooms: [
      { id: "si-selva", name: "Standard vista selva", capacity: 3, beds: "1 queen + 1 individual", sizeM2: 26, view: "Selva misionera", amenities: ["Balcón", "Aire acondicionado", "Mosquiteros"], regime: "Desayuno", cancellation: "Sin costo hasta 7 días antes", pricePerNight: { amount: 76, currency: "USD" }, available: 10 },
      { id: "si-suite", name: "Suite con jacuzzi", capacity: 2, beds: "1 king", sizeM2: 36, view: "Copas de los árboles", amenities: ["Jacuzzi en el balcón", "Desayuno a la habitación", "Amenities premium"], regime: "Desayuno", cancellation: "Reembolsable con penalidad del 10%", pricePerNight: { amount: 118, currency: "USD" }, available: 3 },
    ],
  },
  {
    slug: "bodega-suites-mendoza",
    name: "Hotel Bodega & Suites",
    destinationSlug: "mendoza",
    stars: 4,
    address: "Chacras de Coria, Luján de Cuyo, Mendoza",
    distances: [
      { place: "Plaza de Chacras de Coria", distance: "5 cuadras" },
      { place: "Bodegas de Luján de Cuyo", distance: "10 a 20 min en auto" },
      { place: "Ciudad de Mendoza", distance: "25 min en auto" },
    ],
    rating: 4.8,
    reviewsCount: 98,
    image: IMG.hotelRoom,
    gallery: [IMG.hotelRoom, IMG.mendoza, IMG.relax],
    amenities: ["Viñedo propio", "Piscina con solárium", "Wine bar con etiquetas locales", "Bicicletas sin cargo", "Desayuno de campo", "Wi-Fi"],
    checkIn: "15:00",
    checkOut: "11:00",
    policies: ["Solo mayores de 14 años", "Degustación de bienvenida incluida"],
    description:
      "Doce suites entre viñedos en Chacras de Coria, el pueblo boutique de Mendoza. Atardeceres con la cordillera de fondo, wine bar con productores pequeños y bicicletas para pedalear entre bodegas.",
    rooms: [
      { id: "bs-suite", name: "Suite viñedo", capacity: 2, beds: "1 king", sizeM2: 34, view: "Viñedo y cordillera", amenities: ["Terraza privada", "Cafetera espresso", "Bata y pantuflas"], regime: "Desayuno", cancellation: "Sin costo hasta 10 días antes", pricePerNight: { amount: 132, currency: "USD" }, available: 5 },
      { id: "bs-master", name: "Master suite con estufa a leña", capacity: 2, beds: "1 king", sizeM2: 45, view: "Viñedo, cordillera y jardín", amenities: ["Estufa a leña", "Bañera exenta", "Copa de bienvenida"], regime: "Desayuno", cancellation: "Reembolsable con penalidad del 15%", pricePerNight: { amount: 189, currency: "USD" }, available: 2 },
    ],
  },
];

export function getHotel(slug: string): Hotel | undefined {
  return hotels.find((h) => h.slug === slug);
}
