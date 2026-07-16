import type { TravelExperience } from "@/lib/types";
import { IMG } from "./img";

/**
 * Content for the home "experience finder". The section renders whatever is
 * active here, ordered by `order`. `defaultExperienceSlug` decides the initial
 * selection and can be overridden with ?experiencia=<slug> in the URL.
 */

export const defaultExperienceSlug = "pareja";

export const travelExperiences: TravelExperience[] = [
  {
    id: "exp-pareja",
    slug: "pareja",
    name: "Viajes en pareja",
    shortPhrase: "Escapadas, playas y ciudades para compartir sin apuro.",
    title: "Escapadas para disfrutar de a dos",
    description:
      "Destinos con buenos hoteles, gastronomía y experiencias para compartir sin itinerarios apresurados.",
    imageDesktop: IMG.expCouple,
    imageMobile: IMG.expCouple,
    imageAlt: "Pareja recorriendo los canales de Venecia en góndola, con el puente de Rialto de fondo",
    facts: ["Escapadas desde 3 noches", "Opciones nacionales e internacionales", "Hoteles y experiencias seleccionadas", "Financiación disponible"],
    destinations: [
      { name: "Búzios", tag: "Playa y descanso", href: "/destinos/buzios", image: IMG.buzios, priceFrom: { amount: 599, currency: "USD" } },
      { name: "París", tag: "Ciudad y gastronomía", href: "/destinos/paris", image: IMG.paris, priceFrom: { amount: 1549, currency: "USD" } },
      { name: "Mendoza", tag: "Vino y montaña", href: "/destinos/mendoza", image: IMG.mendoza, priceFrom: { amount: 299, currency: "USD" } },
    ],
    ctaLabel: "Ver viajes en pareja",
    ctaHref: "/paquetes?estilo=Pareja",
    order: 1,
    active: true,
  },
  {
    id: "exp-familia",
    slug: "familia",
    name: "En familia",
    shortPhrase: "Planes que funcionan para grandes y chicos.",
    title: "Viajes pensados para grandes y chicos",
    description:
      "Alojamientos cómodos, actividades para diferentes edades y recorridos organizados para viajar con tranquilidad.",
    imageDesktop: IMG.expFamily,
    imageMobile: IMG.expFamily,
    imageAlt: "Familia numerosa caminando de la mano por la orilla del mar al atardecer",
    facts: ["Menores con descuento en la mayoría de las salidas", "Habitaciones familiares", "Actividades por edad", "Coordinación en destino"],
    destinations: [
      { name: "Orlando", tag: "Parques y compras", href: "/destinos/miami", image: IMG.miami, priceFrom: { amount: 1499, currency: "USD" } },
      { name: "Florianópolis", tag: "Playa tranquila", href: "/destinos/florianopolis", image: IMG.florianopolis, priceFrom: { amount: 429, currency: "USD" } },
      { name: "Bariloche", tag: "Nieve y naturaleza", href: "/destinos/bariloche", image: IMG.bariloche, priceFrom: { amount: 389, currency: "USD" } },
    ],
    ctaLabel: "Ver viajes en familia",
    ctaHref: "/paquetes?estilo=Familia",
    order: 2,
    active: true,
  },
  {
    id: "exp-amigos",
    slug: "amigos",
    name: "Con amigos",
    shortPhrase: "Grupos que se organizan una vez y lo disfrutan todos.",
    title: "Viajes para compartir desde el primer día",
    description:
      "Playa, ciudades y experiencias grupales con opciones flexibles para organizarse entre todos.",
    imageDesktop: IMG.expFriends,
    imageMobile: IMG.expFriends,
    imageAlt: "Grupo de amigos riéndose durante una caminata entre montañas",
    facts: ["Tarifas por grupo", "Pagos individuales por pasajero", "Salidas coordinadas", "Asesor único para todo el grupo"],
    destinations: [
      { name: "Río de Janeiro", tag: "Playa y noche", href: "/destinos/rio-de-janeiro", image: IMG.rio, priceFrom: { amount: 549, currency: "USD" } },
      { name: "Cancún", tag: "Caribe grupal", href: "/destinos/cancun", image: IMG.cancun, priceFrom: { amount: 1399, currency: "USD" } },
      { name: "Ibiza", tag: "Mediterráneo a medida", href: "/viajes-a-medida", image: IMG.expBeach },
    ],
    ctaLabel: "Ver viajes con amigos",
    ctaHref: "/paquetes?estilo=Amigos",
    order: 3,
    active: true,
  },
  {
    id: "exp-aventura",
    slug: "aventura",
    name: "Aventura",
    shortPhrase: "Naturaleza, trekking y paisajes fuera de lo común.",
    title: "Destinos que se recorren en movimiento",
    description:
      "Trekking, naturaleza, navegación y paisajes que vale la pena descubrir fuera de los recorridos tradicionales.",
    imageDesktop: IMG.expAdventure,
    imageMobile: IMG.expAdventure,
    imageAlt: "Proa de un bote de madera navegando un lago de montaña de aguas turquesas",
    facts: ["Guías habilitados", "Equipo y seguros incluidos", "Grupos reducidos", "Niveles para cada experiencia"],
    destinations: [
      { name: "Ushuaia", tag: "Fin del mundo", href: "/destinos/ushuaia", image: IMG.ushuaia, priceFrom: { amount: 449, currency: "USD" } },
      { name: "Patagonia", tag: "Glaciares y montaña", href: "/destinos/bariloche", image: IMG.trek },
      { name: "Costa Rica", tag: "Selva y volcanes", href: "/viajes-a-medida", image: IMG.iguazu },
    ],
    ctaLabel: "Ver viajes de aventura",
    ctaHref: "/paquetes?estilo=Aventura",
    order: 4,
    active: true,
  },
  {
    id: "exp-gastronomia",
    slug: "gastronomia",
    name: "Gastronomía",
    shortPhrase: "Mercados, bodegas y mesas que cuentan el destino.",
    title: "Viajar también es descubrir nuevos sabores",
    description:
      "Circuitos que combinan cocina local, mercados, vinos y experiencias gastronómicas en cada destino.",
    imageDesktop: IMG.expFood,
    imageMobile: IMG.expFood,
    imageAlt: "Mesa al aire libre compartida entre varias personas, con platos regionales y copas de vino",
    facts: ["Reservas en restaurantes gestionadas", "Visitas a bodegas y mercados", "Menús para dietas especiales", "Guías locales gastronómicos"],
    destinations: [
      { name: "Mendoza", tag: "Bodegas y maridaje", href: "/destinos/mendoza", image: IMG.mendoza, priceFrom: { amount: 449, currency: "USD" } },
      { name: "Italia", tag: "Cocina y cultura", href: "/destinos/roma", image: IMG.roma, priceFrom: { amount: 1449, currency: "USD" } },
      { name: "Perú", tag: "Alta cocina andina", href: "/viajes-a-medida", image: IMG.culture },
    ],
    ctaLabel: "Ver viajes gastronómicos",
    ctaHref: "/paquetes?estilo=Gastronomía",
    order: 5,
    active: true,
  },
  {
    id: "exp-nieve",
    slug: "nieve",
    name: "Nieve",
    shortPhrase: "Montaña, esquí y días de invierno bien organizados.",
    title: "Montaña, nieve y días de invierno",
    description:
      "Paquetes con alojamiento, traslados y opciones para esquiar o simplemente disfrutar del paisaje.",
    imageDesktop: IMG.ski,
    imageMobile: IMG.ski,
    imageAlt: "Esquiador bajando una pendiente de nieve polvo en alta montaña",
    facts: ["Pases y clases con tarifa de agencia", "Traslados diarios al cerro", "Equipos en destino", "Opciones para no esquiadores"],
    destinations: [
      { name: "Bariloche", tag: "El clásico argentino", href: "/destinos/bariloche", image: IMG.bariloche, priceFrom: { amount: 589, currency: "USD" } },
      { name: "Ushuaia", tag: "Nieve austral", href: "/destinos/ushuaia", image: IMG.ushuaia, priceFrom: { amount: 449, currency: "USD" } },
      { name: "Valle Nevado", tag: "Andes chilenos", href: "/viajes-a-medida", image: IMG.hotelMountain },
    ],
    ctaLabel: "Ver viajes a la nieve",
    ctaHref: "/paquetes?estilo=Nieve",
    order: 6,
    active: true,
  },
  {
    id: "exp-playa",
    slug: "playa-relax",
    name: "Playa y relax",
    shortPhrase: "Mar, resorts y descanso sin logística encima.",
    title: "Días para bajar el ritmo",
    description:
      "Playas, resorts y destinos costeros para descansar con servicios organizados desde antes de salir.",
    imageDesktop: IMG.expBeach,
    imageMobile: IMG.expBeach,
    imageAlt: "Vista aérea de una playa de aguas turquesas con botes fondeados junto a la orilla",
    facts: ["All inclusive disponibles", "Traslados incluidos", "Asistencia 24 h en destino", "Financiación en cuotas"],
    destinations: [
      { name: "Punta Cana", tag: "Caribe all inclusive", href: "/destinos/punta-cana", image: IMG.puntacana, priceFrom: { amount: 1249, currency: "USD" } },
      { name: "Búzios", tag: "Playas de península", href: "/destinos/buzios", image: IMG.buzios, priceFrom: { amount: 599, currency: "USD" } },
      { name: "Riviera Maya", tag: "Mar y cenotes", href: "/destinos/cancun", image: IMG.cancun, priceFrom: { amount: 1399, currency: "USD" } },
    ],
    ctaLabel: "Ver viajes de playa",
    ctaHref: "/paquetes?estilo=Playa",
    order: 7,
    active: true,
  },
];
