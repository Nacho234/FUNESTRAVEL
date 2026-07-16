import type { AdminRoleId } from "@/lib/admin-types";
import { IMG } from "./img";

/**
 * Demo data for the marketing + system modules of the backoffice.
 * DEMO — replace with real backend data before production.
 */

/* ── cupones ─────────────────────────────────────────────────────── */

export interface AdminCoupon {
  id: string;
  code: string;
  type: "porcentual" | "fijo";
  discount: number; // % or USD according to type
  maxUses: number;
  uses: number;
  perCustomer: number;
  appliesTo: string;
  validFrom: string;
  validUntil: string;
  minAmountUsd: number;
  combinable: boolean;
  channels: string[];
  status: "activa" | "pausada" | "vencida";
  salesUsd: number;
}

export const adminCoupons: AdminCoupon[] = [
  { id: "cp-01", code: "VERANO27", type: "porcentual", discount: 10, maxUses: 40, uses: 17, perCustomer: 1, appliesTo: "Florianópolis y Búzios", validFrom: "2026-06-01", validUntil: "2026-09-15", minAmountUsd: 400, combinable: false, channels: ["web", "oficina"], status: "activa", salesUsd: 7810 },
  { id: "cp-02", code: "LUNA200", type: "fijo", discount: 200, maxUses: 20, uses: 6, perCustomer: 1, appliesTo: "Grecia y Turquía (lunas de miel)", validFrom: "2026-05-15", validUntil: "2026-10-31", minAmountUsd: 2000, combinable: false, channels: ["web", "whatsapp", "oficina"], status: "activa", salesUsd: 16340 },
  { id: "cp-03", code: "GRUPOFUNES", type: "porcentual", discount: 5, maxUses: 100, uses: 42, perCustomer: 2, appliesTo: "Salidas grupales", validFrom: "2026-01-10", validUntil: "2026-12-31", minAmountUsd: 0, combinable: true, channels: ["oficina"], status: "activa", salesUsd: 21930 },
  { id: "cp-04", code: "NIEVE26", type: "fijo", discount: 50, maxUses: 30, uses: 30, perCustomer: 1, appliesTo: "Bariloche invierno", validFrom: "2026-04-01", validUntil: "2026-06-30", minAmountUsd: 500, combinable: false, channels: ["web"], status: "vencida", salesUsd: 18560 },
  { id: "cp-05", code: "BIENVENIDA", type: "porcentual", discount: 3, maxUses: 200, uses: 12, perCustomer: 1, appliesTo: "Todos los productos", validFrom: "2026-07-01", validUntil: "2026-12-31", minAmountUsd: 300, combinable: true, channels: ["web", "instagram"], status: "pausada", salesUsd: 3120 },
];

/* ── usuarios internos ───────────────────────────────────────────── */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  role: AdminRoleId;
  status: "activo" | "invitado" | "suspendido";
  lastSession: string;
  monthSalesUsd: number;
  avatarId: number;
}

export const adminUsers: AdminUser[] = [
  { id: "u-01", name: "Sofía Gachet", email: "sofia@funestravel.com.ar", phone: "341 555-0123", branch: "Funes · Casa central", role: "superadmin", status: "activo", lastSession: "hoy, 09:12", monthSalesUsd: 21480, avatarId: 20 },
  { id: "u-02", name: "Marcela Buttini", email: "marcela@funestravel.com.ar", phone: "341 555-0124", branch: "Funes · Casa central", role: "ventas", status: "activo", lastSession: "hoy, 08:47", monthSalesUsd: 16220, avatarId: 32 },
  { id: "u-03", name: "Diego Anselmi", email: "diego@funestravel.com.ar", phone: "341 555-0125", branch: "Rosario · Punto de venta", role: "reservas", status: "activo", lastSession: "ayer, 18:35", monthSalesUsd: 10920, avatarId: 53 },
  { id: "u-04", name: "Carina Elordi", email: "carina@funestravel.com.ar", phone: "341 555-0126", branch: "Funes · Casa central", role: "finanzas", status: "activo", lastSession: "hoy, 10:02", monthSalesUsd: 0, avatarId: 44 },
  { id: "u-05", name: "Tomás Reggiardo", email: "tomas@funestravel.com.ar", phone: "341 555-0127", branch: "Funes · Casa central", role: "marketing", status: "activo", lastSession: "ayer, 16:20", monthSalesUsd: 0, avatarId: 12 },
  { id: "u-06", name: "Lucía Ferraro", email: "lucia@funestravel.com.ar", phone: "341 555-0128", branch: "Rosario · Punto de venta", role: "atencion", status: "invitado", lastSession: "nunca", monthSalesUsd: 0, avatarId: 47 },
];

/* ── auditoría ───────────────────────────────────────────────────── */

export interface AuditEntry {
  id: string;
  at: string; // "2026-07-16 10:32"
  user: string;
  action: string;
  module: string;
  record: string;
  before?: string;
  after?: string;
  ip: string;
  device: string;
}

export const auditLog: AuditEntry[] = [
  { id: "au-01", at: "2026-07-16 10:32", user: "Sofía Gachet", action: "Registró pago", module: "Pagos", record: "FT-2026-1036", before: "pendiente", after: "aprobado", ip: "192.168.0.14", device: "Mac · Chrome" },
  { id: "au-02", at: "2026-07-16 09:58", user: "Diego Anselmi", action: "Actualizó precio", module: "Tarifas", record: "Bariloche a la nieve · 22/8", before: "USD 649", after: "USD 629", ip: "192.168.0.22", device: "Windows · Edge" },
  { id: "au-03", at: "2026-07-16 09:41", user: "Marcela Buttini", action: "Envió propuesta", module: "Cotizaciones", record: "Q-8846", before: "en preparación", after: "enviada", ip: "192.168.0.17", device: "Mac · Safari" },
  { id: "au-04", at: "2026-07-15 18:22", user: "Sofía Gachet", action: "Publicó promoción", module: "Promociones", record: "Verano 2027: compra anticipada", before: "borrador", after: "publicada", ip: "192.168.0.14", device: "Mac · Chrome" },
  { id: "au-05", at: "2026-07-15 17:05", user: "Tomás Reggiardo", action: "Editó contenido", module: "Contenido", record: "Sección Historias de viajeros", ip: "192.168.0.31", device: "Windows · Chrome" },
  { id: "au-06", at: "2026-07-15 16:40", user: "Marcela Buttini", action: "Aprobó documento", module: "Documentación", record: "Pasaporte · Familia Maldonado Ruiz", before: "en revisión", after: "aprobado", ip: "192.168.0.17", device: "Mac · Safari" },
  { id: "au-07", at: "2026-07-15 15:12", user: "Diego Anselmi", action: "Confirmó reserva", module: "Reservas", record: "FT-2026-1037", before: "pendiente de pago", after: "confirmada", ip: "192.168.0.22", device: "Windows · Edge" },
  { id: "au-08", at: "2026-07-15 12:03", user: "Carina Elordi", action: "Concilió pago", module: "Pagos", record: "P-2214", before: "aprobado", after: "conciliado", ip: "192.168.0.19", device: "Windows · Chrome" },
  { id: "au-09", at: "2026-07-15 11:30", user: "Sofía Gachet", action: "Creó cupón", module: "Cupones", record: "BIENVENIDA", ip: "192.168.0.14", device: "Mac · Chrome" },
  { id: "au-10", at: "2026-07-14 19:15", user: "Tomás Reggiardo", action: "Reemplazó imagen", module: "Medios", record: "Punta Cana · playa principal", ip: "192.168.0.31", device: "Windows · Chrome" },
  { id: "au-11", at: "2026-07-14 17:44", user: "Sofía Gachet", action: "Invitó usuario", module: "Usuarios", record: "lucia@funestravel.com.ar", ip: "192.168.0.14", device: "Mac · Chrome" },
  { id: "au-12", at: "2026-07-14 16:02", user: "Marcela Buttini", action: "Creó cotización", module: "Cotizaciones", record: "Q-8846 · Turquía para dos", ip: "192.168.0.17", device: "Mac · Safari" },
  { id: "au-13", at: "2026-07-14 11:27", user: "Diego Anselmi", action: "Bloqueó cupos", module: "Disponibilidad", record: "Europa clásica · 8/9 (2 cupos)", before: "8 libres", after: "6 libres", ip: "192.168.0.22", device: "Windows · Edge" },
  { id: "au-14", at: "2026-07-13 18:50", user: "Sofía Gachet", action: "Editó plantilla", module: "Configuración", record: "Recordatorio de pago", ip: "192.168.0.14", device: "Mac · Chrome" },
  { id: "au-15", at: "2026-07-13 15:36", user: "Carina Elordi", action: "Registró devolución", module: "Pagos", record: "P-2198 · USD 180", before: "aprobado", after: "devuelto", ip: "192.168.0.19", device: "Windows · Chrome" },
  { id: "au-16", at: "2026-07-13 10:08", user: "Tomás Reggiardo", action: "Programó artículo", module: "Blog", record: "Guía de equipaje de invierno", before: "borrador", after: "programado", ip: "192.168.0.31", device: "Windows · Chrome" },
  { id: "au-17", at: "2026-07-12 17:29", user: "Sofía Gachet", action: "Cambió rol", module: "Usuarios", record: "Diego Anselmi", before: "ventas", after: "reservas", ip: "192.168.0.14", device: "Mac · Chrome" },
  { id: "au-18", at: "2026-07-12 09:14", user: "Marcela Buttini", action: "Exportó reporte", module: "Reportes", record: "Ventas por destino · junio", ip: "192.168.0.17", device: "Mac · Safari" },
];

/* ── integraciones ───────────────────────────────────────────────── */

export interface IntegrationInfo {
  id: string;
  name: string;
  category: string;
  status: "modo demo" | "conectada" | "error";
  lastSync: string;
  envVar: string;
  logs: string[];
  errorMessage?: string;
}

export const integrationsList: IntegrationInfo[] = [
  { id: "mp", name: "Mercado Pago", category: "Pagos", status: "modo demo", lastSync: "sin sincronizar", envVar: "MP_ACCESS_TOKEN", logs: ["[demo] Adaptador inicializado", "[demo] Esperando credenciales de producción"] },
  { id: "stripe", name: "Stripe", category: "Pagos internacionales", status: "modo demo", lastSync: "sin sincronizar", envVar: "STRIPE_SECRET_KEY", logs: ["[demo] Adaptador inicializado"] },
  { id: "resend", name: "Resend (correo)", category: "Comunicaciones", status: "modo demo", lastSync: "sin sincronizar", envVar: "RESEND_API_KEY", logs: ["[demo] Plantillas listas: confirmación, recordatorio, previaje"] },
  { id: "whatsapp", name: "WhatsApp Business", category: "Comunicaciones", status: "modo demo", lastSync: "sin sincronizar", envVar: "WHATSAPP_TOKEN", logs: ["[demo] Los enlaces wa.me funcionan sin API"] },
  { id: "gcal", name: "Google Calendar", category: "Agenda", status: "conectada", lastSync: "hoy, 08:00", envVar: "GOOGLE_CALENDAR_ID", logs: ["08:00 Sincronizadas 6 salidas próximas", "ayer 08:00 Sincronizadas 6 salidas próximas"] },
  { id: "gmaps", name: "Google Maps", category: "Mapas", status: "conectada", lastSync: "hoy, 07:30", envVar: "GOOGLE_MAPS_KEY", logs: ["07:30 Geocodificación de 3 hoteles"] },
  { id: "amadeus", name: "Amadeus GDS", category: "Vuelos", status: "modo demo", lastSync: "sin sincronizar", envVar: "AMADEUS_KEY", logs: ["[demo] Inventario de vuelos servido desde datos locales"] },
  { id: "ga", name: "Google Analytics", category: "Analytics", status: "conectada", lastSync: "hoy, 06:00", envVar: "GA_MEASUREMENT_ID", logs: ["06:00 Eventos del día anterior importados"] },
  { id: "bna", name: "Cotización BNA", category: "Monedas", status: "error", lastSync: "ayer, 12:00", envVar: "BNA_ENDPOINT", errorMessage: "Timeout al consultar el tipo de cambio (10 s)", logs: ["ayer 12:00 OK · 1 USD = 1.480 ARS", "hoy 12:00 ERROR timeout"] },
  { id: "blob", name: "Vercel Blob", category: "Almacenamiento", status: "modo demo", lastSync: "sin sincronizar", envVar: "BLOB_READ_WRITE_TOKEN", logs: ["[demo] Los medios se sirven desde URLs externas"] },
];

/* ── secciones de la home (CMS) ──────────────────────────────────── */

export interface ContentSection {
  id: string;
  name: string;
  active: boolean;
  order: number;
  title: string;
  description: string;
  ctaLabel?: string;
  sourceFile: string;
}

export const contentSections: ContentSection[] = [
  { id: "hero", name: "Hero + buscador", active: true, order: 1, title: "Tu próximo viaje empieza mucho antes de despegar.", description: "Paquetes, vuelos y experiencias para viajar con tranquilidad, acompañamiento real y beneficios exclusivos.", ctaLabel: "Buscar", sourceFile: "src/app/(site)/page.tsx" },
  { id: "confianza", name: "Franja de confianza", active: true, order: 2, title: "Beneficios de la agencia", description: "Atención personalizada, pago seguro, cuotas, acompañamiento y proveedores seleccionados.", sourceFile: "src/app/(site)/page.tsx" },
  { id: "promos", name: "Promociones", active: true, order: 3, title: "Una buena oportunidad también puede ser el comienzo del viaje.", description: "Fechas seleccionadas, financiación y beneficios reales para viajar con todo claro desde el principio.", ctaLabel: "Ver todas las promociones", sourceFile: "src/data/content.ts (promoShowcase)" },
  { id: "paquetes", name: "Paquetes destacados", active: true, order: 4, title: "Paquetes que están saliendo ahora", description: "Grilla de paquetes destacados del catálogo.", ctaLabel: "Ver todos los paquetes", sourceFile: "src/data/packages.ts (featured)" },
  { id: "despegue", name: "Despegue (scroll)", active: true, order: 5, title: "Todo gran viaje empieza con una decisión.", description: "Secuencia cinematográfica del despegue controlada por scroll.", ctaLabel: "Explorar destinos", sourceFile: "src/components/home/takeoff-scroll.tsx" },
  { id: "destinos", name: "Destinos elegidos", active: true, order: 6, title: "Destinos elegidos para esta temporada", description: "Seleccionamos propuestas que combinan buen momento para viajar, disponibilidad y precios competitivos.", ctaLabel: "Explorar todos los destinos", sourceFile: "src/data/curated-destinations.ts" },
  { id: "experiencias", name: "Buscador de experiencias", active: true, order: 7, title: "Encontrá un viaje hecho para vos", description: "No hace falta tener el destino decidido. Elegí cómo querés viajar y descubrí propuestas pensadas para ese momento.", sourceFile: "src/data/experiences.ts" },
  { id: "grupales", name: "Salidas grupales", active: true, order: 8, title: "Salidas grupales con coordinador", description: "Fechas confirmadas, grupos reducidos y reunión informativa antes de viajar.", ctaLabel: "Ver itinerario", sourceFile: "src/data/content.ts (groupTrips)" },
  { id: "acompanamiento", name: "Acompañamiento (parallax)", active: true, order: 9, title: "Reservás online, pero nunca viajás solo", description: "Detrás de cada propuesta hay un equipo que revisa, organiza y acompaña cada etapa del viaje.", ctaLabel: "Hablá con un asesor", sourceFile: "src/components/home/human-touch.tsx" },
  { id: "amedida", name: "Viajes a medida", active: true, order: 10, title: "¿No encontraste el viaje ideal? Lo diseñamos con vos.", description: "Contanos lo básico y te enviamos una primera propuesta real para empezar.", ctaLabel: "Diseñar mi viaje", sourceFile: "src/components/home/custom-trip-section.tsx" },
  { id: "historias", name: "Historias de viajeros", active: true, order: 11, title: "Viajes reales, contados por quienes estuvieron ahí", description: "Historias de personas que viajaron con nosotros, desde la primera consulta hasta el regreso a casa.", ctaLabel: "Ver todas las experiencias", sourceFile: "src/data/stories.ts" },
  { id: "guias", name: "Guías (blog)", active: true, order: 12, title: "Guías útiles antes de reservar", description: "Artículos editoriales del blog de inspiración.", ctaLabel: "Ver todas las guías", sourceFile: "src/data/content.ts (articles)" },
  { id: "faq", name: "Preguntas frecuentes", active: true, order: 13, title: "Las dudas de siempre, respondidas", description: "Pagos, cuotas, documentación y cancelaciones: lo que todos preguntan antes de reservar.", ctaLabel: "Ver todas las preguntas", sourceFile: "src/data/content.ts (faqs)" },
];

/* ── biblioteca de medios ────────────────────────────────────────── */

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  folder: "destinos" | "experiencias" | "hoteles" | "escenas" | "planificación";
  altText: string;
  usedIn: string[];
  sizeKb: number;
  format: string;
  date: string;
}

export const mediaLibrary: MediaItem[] = [
  { id: "m-01", name: "Punta Cana · playa principal", url: IMG.puntacana, folder: "destinos", altText: "Playa de arena blanca con palmeras en Punta Cana", usedIn: ["/", "/destinos/punta-cana", "/paquetes/punta-cana-7-noches-all-inclusive"], sizeKb: 412, format: "JPG", date: "2026-07-14" },
  { id: "m-02", name: "Bariloche · trekking", url: IMG.bariloche, folder: "destinos", altText: "Senderista frente a los lagos de Bariloche", usedIn: ["/destinos/bariloche"], sizeKb: 388, format: "JPG", date: "2026-07-14" },
  { id: "m-03", name: "Bariloche · nevada", url: IMG.barilocheWinter, folder: "destinos", altText: "Nevada sobre el bosque y el lago", usedIn: ["/", "/destinos/bariloche"], sizeKb: 356, format: "JPG", date: "2026-07-15" },
  { id: "m-04", name: "Río de Janeiro · panorámica", url: IMG.rio, folder: "destinos", altText: "Vista del Pan de Azúcar", usedIn: ["/", "/destinos/rio-de-janeiro"], sizeKb: 431, format: "JPG", date: "2026-07-14" },
  { id: "m-05", name: "París · Torre Eiffel", url: IMG.paris, folder: "destinos", altText: "Calle parisina con la Torre Eiffel", usedIn: ["/", "/destinos/paris"], sizeKb: 402, format: "JPG", date: "2026-07-14" },
  { id: "m-06", name: "Santorini · caldera", url: IMG.santorini, folder: "destinos", altText: "Casas blancas sobre la caldera", usedIn: ["/", "/experiencias", "/paquetes/grecia-luna-de-miel-9-noches"], sizeKb: 445, format: "JPG", date: "2026-07-14" },
  { id: "m-07", name: "Cancún · aérea", url: IMG.cancun, folder: "destinos", altText: "Costa turquesa de Cancún", usedIn: ["/destinos/cancun"], sizeKb: 397, format: "JPG", date: "2026-07-14" },
  { id: "m-08", name: "Madrid · palacio", url: IMG.madrid, folder: "destinos", altText: "Palacio Real de Madrid", usedIn: ["/destinos/madrid"], sizeKb: 379, format: "JPG", date: "2026-07-14" },
  { id: "m-09", name: "Venecia · góndola (pareja)", url: IMG.expCouple, folder: "experiencias", altText: "Pareja en góndola frente al puente de Rialto", usedIn: ["/?experiencia=pareja"], sizeKb: 428, format: "JPG", date: "2026-07-15" },
  { id: "m-10", name: "Familia en la playa", url: IMG.expFamily, folder: "experiencias", altText: "Familia caminando de la mano al atardecer", usedIn: ["/?experiencia=familia"], sizeKb: 402, format: "JPG", date: "2026-07-15" },
  { id: "m-11", name: "Amigos en las montañas", url: IMG.expFriends, folder: "experiencias", altText: "Grupo de amigos en caminata", usedIn: ["/?experiencia=amigos", "/experiencias"], sizeKb: 415, format: "JPG", date: "2026-07-15" },
  { id: "m-12", name: "Lago alpino · aventura", url: IMG.expAdventure, folder: "experiencias", altText: "Proa de bote en lago de montaña", usedIn: ["/?experiencia=aventura"], sizeKb: 390, format: "JPG", date: "2026-07-15" },
  { id: "m-13", name: "Mesa compartida · gastronomía", url: IMG.expFood, folder: "experiencias", altText: "Mesa al aire libre con platos regionales", usedIn: ["/?experiencia=gastronomia", "/experiencias"], sizeKb: 408, format: "JPG", date: "2026-07-15" },
  { id: "m-14", name: "Playa aérea · relax", url: IMG.expBeach, folder: "experiencias", altText: "Vista aérea de playa turquesa con botes", usedIn: ["/?experiencia=playa-relax"], sizeKb: 436, format: "JPG", date: "2026-07-15" },
  { id: "m-15", name: "Resort · piscina", url: IMG.hotelPool, folder: "hoteles", altText: "Piscina del resort al atardecer", usedIn: ["/hoteles/atlantico-praia", "/hoteles/selva-iryapu"], sizeKb: 385, format: "JPG", date: "2026-07-14" },
  { id: "m-16", name: "Habitación superior", url: IMG.hotelRoom, folder: "hoteles", altText: "Habitación de hotel con cama king", usedIn: ["/hoteles/bodega-suites-mendoza"], sizeKb: 344, format: "JPG", date: "2026-07-14" },
  { id: "m-17", name: "Despegue · aeropuerto", url: IMG.takeoffAirport, folder: "escenas", altText: "Avión en plataforma al atardecer", usedIn: ["/"], sizeKb: 366, format: "JPG", date: "2026-07-15" },
  { id: "m-18", name: "Despegue · avión en vuelo", url: IMG.takeoffFlight, folder: "escenas", altText: "Avión sobre mar de nubes doradas", usedIn: ["/"], sizeKb: 219, format: "JPG", date: "2026-07-15" },
  { id: "m-19", name: "Caminando en Europa", url: IMG.humanScene, folder: "escenas", altText: "Viajera recorriendo un callejón europeo", usedIn: ["/"], sizeKb: 421, format: "JPG", date: "2026-07-16" },
  { id: "m-20", name: "Mapa y libreta de viaje", url: IMG.planning, folder: "planificación", altText: "Mapa de ruta con libreta y cámara", usedIn: ["/", "/nosotros", "/viajes-a-medida"], sizeKb: 372, format: "JPG", date: "2026-07-14" },
];

/* ── SEO ─────────────────────────────────────────────────────────── */

export interface SeoFinding {
  id: string;
  page: string;
  finding: string;
  level: "ok" | "warning" | "error";
  recommendation: string;
}

export const seoAudit: SeoFinding[] = [
  { id: "seo-01", page: "/", finding: "Título y description correctos", level: "ok", recommendation: "Sin acción necesaria." },
  { id: "seo-02", page: "/destinos/bariloche", finding: "Description de 182 caracteres", level: "warning", recommendation: "Acortar a menos de 160 caracteres para evitar el recorte en resultados." },
  { id: "seo-03", page: "/experiencias", finding: "Imagen Open Graph faltante", level: "error", recommendation: "Definir una imagen OG de 1200x630 para compartir en redes." },
  { id: "seo-04", page: "/paquetes/punta-cana-7-noches-all-inclusive", finding: "Datos estructurados de producto presentes", level: "ok", recommendation: "Sin acción necesaria." },
  { id: "seo-05", page: "/promociones", finding: "Título duplicado con /paquetes en 2 palabras clave", level: "warning", recommendation: "Diferenciar el título para evitar canibalización." },
  { id: "seo-06", page: "/inspiracion/equipaje-de-bodega-y-de-mano", finding: "Sin enlaces internos entrantes", level: "warning", recommendation: "Enlazar desde la guía de documentación y desde el detalle de paquetes." },
  { id: "seo-07", page: "/hoteles", finding: "Página dinámica sin canonical", level: "warning", recommendation: "Definir canonical sin parámetros de búsqueda." },
  { id: "seo-08", page: "/viajes-grupales/europa-clasica-grupal-septiembre", finding: "La salida vence el 8/9: contenido por expirar", level: "warning", recommendation: "Programar redirección a /viajes-grupales al finalizar la salida." },
  { id: "seo-09", page: "/sitemap.xml", finding: "Sitemap accesible con 94 URLs", level: "ok", recommendation: "Sin acción necesaria." },
  { id: "seo-10", page: "/destinos/iguazu", finding: "Alt text faltante en 1 imagen de la galería", level: "error", recommendation: "Completar el texto alternativo descriptivo." },
];

export interface SeoRedirect {
  id: string;
  from: string;
  to: string;
  type: "301" | "302";
}

export const seoRedirects: SeoRedirect[] = [
  { id: "r-01", from: "/promos", to: "/promociones", type: "301" },
  { id: "r-02", from: "/destinos/cataratas", to: "/destinos/iguazu", type: "301" },
];

export interface SeoPageMeta {
  path: string;
  title: string;
  description: string;
  ogImage: string;
}

export const seoPages: SeoPageMeta[] = [
  { path: "/", title: "Funes Travel · Paquetes, vuelos y viajes a medida", description: "Buscá paquetes, vuelos, hoteles y excursiones con asesoramiento humano. Salidas desde Rosario y Buenos Aires, financiación en cuotas y acompañamiento durante todo el viaje.", ogImage: "/images/takeoff-flight.jpg" },
  { path: "/paquetes", title: "Paquetes de viaje · Funes Travel", description: "Paquetes a Caribe, Brasil, Europa y Argentina con aéreo, hotel y asistencia incluidos.", ogImage: "" },
  { path: "/destinos", title: "Destinos · Funes Travel", description: "Todos los destinos que operamos, con temporadas recomendadas y precios orientativos.", ogImage: "" },
  { path: "/experiencias", title: "Experiencias de viajeros · Funes Travel", description: "Historias reales de personas que viajaron con Funes Travel.", ogImage: "" },
  { path: "/promociones", title: "Promociones vigentes · Funes Travel", description: "Cuotas sin interés, descuentos por transferencia y beneficios por compra anticipada.", ogImage: "" },
];

/* ── reportes ────────────────────────────────────────────────────── */

export interface ReportRow {
  label: string;
  col1: string;
  col2: string;
  col3: string;
}

export const reportDatasets: Record<string, { columns: [string, string, string, string]; rows: ReportRow[] }> = {
  "ventas-vendedor": {
    columns: ["Vendedor", "Ventas USD", "Reservas", "Ticket promedio"],
    rows: [
      { label: "Sofía Gachet", col1: "21.480", col2: "6", col3: "3.580" },
      { label: "Marcela Buttini", col1: "16.220", col2: "5", col3: "3.244" },
      { label: "Diego Anselmi", col1: "10.920", col2: "3", col3: "3.640" },
    ],
  },
  "ventas-destino": {
    columns: ["Destino", "Ventas USD", "Reservas", "Margen %"],
    rows: [
      { label: "Bariloche", col1: "13.230", col2: "5", col3: "14,2" },
      { label: "Punta Cana", col1: "12.490", col2: "3", col3: "16,8" },
      { label: "Río de Janeiro", col1: "8.540", col2: "3", col3: "13,9" },
      { label: "Europa clásica", col1: "7.580", col2: "2", col3: "17,4" },
      { label: "Iguazú", col1: "3.890", col2: "1", col3: "12,1" },
    ],
  },
  "ventas-canal": {
    columns: ["Canal", "Ventas USD", "Reservas", "Conversión %"],
    rows: [
      { label: "Web", col1: "19.420", col2: "6", col3: "18" },
      { label: "WhatsApp", col1: "14.860", col2: "4", col3: "31" },
      { label: "Oficina", col1: "11.230", col2: "3", col3: "62" },
      { label: "Instagram", col1: "3.110", col2: "1", col3: "9" },
    ],
  },
  "cotizaciones-conversion": {
    columns: ["Asesor", "Enviadas", "Aceptadas", "Conversión %"],
    rows: [
      { label: "Sofía Gachet", col1: "9", col2: "4", col3: "44" },
      { label: "Marcela Buttini", col1: "8", col2: "3", col3: "38" },
      { label: "Diego Anselmi", col1: "6", col2: "2", col3: "33" },
    ],
  },
  cancelaciones: {
    columns: ["Motivo", "Casos", "Monto USD", "Reintegrado"],
    rows: [
      { label: "Cambio de fecha del cliente", col1: "2", col2: "1.840", col3: "1.560" },
      { label: "Problema de salud", col1: "1", col2: "1.249", col3: "1.249" },
    ],
  },
  promociones: {
    columns: ["Promoción", "Reservas", "Ventas USD", "Descuento otorgado"],
    rows: [
      { label: "Caribe en 12 cuotas", col1: "3", col2: "12.490", col3: "0 (financiación)" },
      { label: "5% por transferencia", col1: "4", col2: "9.320", col3: "466" },
      { label: "Compra anticipada verano", col1: "2", col2: "2.680", col3: "134" },
    ],
  },
  "pagos-metodo": {
    columns: ["Método", "Pagos", "Monto USD", "Participación %"],
    rows: [
      { label: "Mercado Pago", col1: "9", col2: "18.430", col3: "42" },
      { label: "Transferencia", col1: "6", col2: "14.210", col3: "32" },
      { label: "Tarjeta en oficina", col1: "4", col2: "7.980", col3: "18" },
      { label: "Efectivo", col1: "3", col2: "3.410", col3: "8" },
    ],
  },
  estacionalidad: {
    columns: ["Mes", "Consultas", "Reservas", "Ventas USD"],
    rows: [
      { label: "Febrero", col1: "71", col2: "9", col3: "31.240" },
      { label: "Marzo", col1: "84", col2: "11", col3: "39.180" },
      { label: "Abril", col1: "62", col2: "8", col3: "27.410" },
      { label: "Mayo", col1: "88", col2: "12", col3: "42.360" },
      { label: "Junio", col1: "101", col2: "15", col3: "52.190" },
      { label: "Julio (parcial)", col1: "96", col2: "14", col3: "48.620" },
    ],
  },
};

export const savedReports = [
  { id: "sr-01", name: "Ventas por vendedor · mes actual", dataset: "ventas-vendedor" },
  { id: "sr-02", name: "Destinos top · últimos 30 días", dataset: "ventas-destino" },
  { id: "sr-03", name: "Conversión de cotizaciones", dataset: "cotizaciones-conversion" },
  { id: "sr-04", name: "Pagos por método · julio", dataset: "pagos-metodo" },
];

/* ── configuración ───────────────────────────────────────────────── */

export const adminSettings = {
  company: {
    legalName: "Funes Travel EVT",
    license: "Legajo 18.432 · Disposición 2447/2023",
    address: "San José 1650, Funes, Santa Fe",
    hours: "Lun a Vie 9 a 18 h · Sáb 9 a 13 h",
    phone: "+54 9 341 555-0123",
    whatsapp: "+54 9 341 555-0123",
    email: "hola@funestravel.com.ar",
    billingEmail: "administracion@funestravel.com.ar",
  },
  currencies: {
    primary: "USD",
    secondary: "ARS",
    exchangeRate: 1480,
    exchangeSource: "BNA billete vendedor (demo)",
    lastUpdate: "2026-07-16 12:00",
  },
  taxes: {
    iva: 21,
    perceptions: "Percepciones vigentes según normativa (demo)",
    defaultCommission: 12,
  },
  paymentMethods: [
    { id: "mp", label: "Mercado Pago", enabled: true },
    { id: "transfer", label: "Transferencia bancaria (5% desc. porción terrestre)", enabled: true },
    { id: "card", label: "Tarjeta en oficina", enabled: true },
    { id: "cash", label: "Efectivo / dólares en oficina", enabled: true },
    { id: "link", label: "Link de pago", enabled: false },
  ],
  numbering: {
    bookingPrefix: "FT-2026-",
    nextBooking: 1044,
    quotePrefix: "Q-",
    nextQuote: 8847,
    paymentPrefix: "P-",
    nextPayment: 2216,
  },
  templates: [
    { id: "tpl-confirm", name: "Confirmación de reserva", body: "Hola {cliente}: tu reserva {reserva} quedó confirmada para el {fecha}. En los próximos días te enviamos la documentación y los siguientes pasos. Cualquier duda respondé este mensaje. Funes Travel." },
    { id: "tpl-payment", name: "Recordatorio de pago", body: "Hola {cliente}: te recordamos que el saldo de la reserva {reserva} vence el {fecha}. Podés pagar por Mercado Pago, transferencia o en la oficina. Gracias." },
    { id: "tpl-previaje", name: "Mensaje previo al viaje", body: "Hola {cliente}: falta poco para tu viaje ({fecha}). Te dejamos los vouchers, el itinerario y los contactos de asistencia. Buen viaje. Funes Travel." },
  ],
};

/* ── blog (borradores demo extra) ────────────────────────────────── */

export interface BlogDraft {
  slug: string;
  title: string;
  category: string;
  status: "borrador" | "programado";
  date: string;
  excerpt: string;
}

export const blogDrafts: BlogDraft[] = [
  { slug: "guia-equipaje-invierno", title: "Guía de equipaje para la nieve: qué llevar y qué alquilar", category: "Equipaje", status: "programado", date: "2026-07-22", excerpt: "Capas, guantes, antiparras y qué conviene alquilar en el cerro en lugar de comprar." },
  { slug: "cuotas-o-dolares", title: "¿Conviene pagar el viaje en cuotas o en dólares?", category: "Presupuesto", status: "borrador", date: "2026-07-16", excerpt: "Cómo decidir según el tipo de cambio, la anticipación de la compra y tu flujo mensual." },
];
