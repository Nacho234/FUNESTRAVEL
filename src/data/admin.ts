// Mock operational data for the admin area. In production every list in this
// module comes from the database; the shapes below mirror the future schema.

export type AdminBookingStatus = "confirmada" | "pendiente-de-pago" | "en-revision" | "cancelada";

export interface AdminBooking {
  code: string;
  packageSlug: string;
  holderName: string;
  holderEmail: string;
  adults: number;
  children: number;
  totalUsd: number;
  status: AdminBookingStatus;
  payMethod: string;
  advisor: string;
  createdAt: string;
  departureDate: string;
  notes?: string;
}

export const adminBookings: AdminBooking[] = [
  {
    code: "FT-2026-1042",
    packageSlug: "punta-cana-7-noches-all-inclusive",
    holderName: "Carolina Bertoldi",
    holderEmail: "caro.bertoldi@gmail.com",
    adults: 2,
    children: 0,
    totalUsd: 2498,
    status: "confirmada",
    payMethod: "Mercado Pago (12 cuotas)",
    advisor: "Sofía Gachet",
    createdAt: "2026-06-28",
    departureDate: "2026-09-12",
    notes: "Piden habitación en piso alto. Aniversario de casados el 14/9: coordinar detalle con el hotel.",
  },
  {
    code: "FT-2026-1041",
    packageSlug: "europa-clasica-14-noches",
    holderName: "Rubén y Marta Scaglia",
    holderEmail: "rscaglia58@hotmail.com",
    adults: 2,
    children: 0,
    totalUsd: 7780,
    status: "pendiente-de-pago",
    payMethod: "Seña + saldo",
    advisor: "Marcela Buttini",
    createdAt: "2026-06-25",
    departureDate: "2026-09-08",
    notes: "Saldo vence el 4/8. Recordatorio enviado el 10/7.",
  },
  {
    code: "FT-2026-1040",
    packageSlug: "bariloche-invierno-5-noches",
    holderName: "Familia Maldonado Ruiz",
    holderEmail: "jmaldonado.ruiz@gmail.com",
    adults: 2,
    children: 2,
    totalUsd: 2340,
    status: "confirmada",
    payMethod: "Transferencia",
    advisor: "Diego Anselmi",
    createdAt: "2026-06-22",
    departureDate: "2026-07-25",
    notes: "Chicos de 8 y 11: reservar clase de esquí infantil.",
  },
  {
    code: "FT-2026-1039",
    packageSlug: "rio-de-janeiro-6-noches",
    holderName: "Julián Ferreyra",
    holderEmail: "julifer92@gmail.com",
    adults: 6,
    children: 0,
    totalUsd: 5694,
    status: "confirmada",
    payMethod: "Mercado Pago",
    advisor: "Sofía Gachet",
    createdAt: "2026-06-20",
    departureDate: "2026-09-19",
  },
  {
    code: "FT-2026-1038",
    packageSlug: "grecia-luna-de-miel-9-noches",
    holderName: "Valeria Scarpetta",
    holderEmail: "vale.scarpetta@gmail.com",
    adults: 2,
    children: 0,
    totalUsd: 5580,
    status: "en-revision",
    payMethod: "Transferencia",
    advisor: "Marcela Buttini",
    createdAt: "2026-07-08",
    departureDate: "2026-09-15",
    notes: "Esperando acreditación de la transferencia (aviso del banco demorado).",
  },
  {
    code: "FT-2026-1037",
    packageSlug: "salta-jujuy-5-noches",
    holderName: "Graciela Bonfiglio",
    holderEmail: "gbonfiglio@yahoo.com.ar",
    adults: 1,
    children: 0,
    totalUsd: 796,
    status: "confirmada",
    payMethod: "Pago en oficina (efectivo)",
    advisor: "Marcela Buttini",
    createdAt: "2026-07-02",
    departureDate: "2026-08-15",
  },
  {
    code: "FT-2026-1036",
    packageSlug: "iguazu-escapada-3-noches",
    holderName: "Pablo Sarraceno",
    holderEmail: "psarraceno@gmail.com",
    adults: 2,
    children: 1,
    totalUsd: 1050,
    status: "pendiente-de-pago",
    payMethod: "Transferencia",
    advisor: "Diego Anselmi",
    createdAt: "2026-07-10",
    departureDate: "2026-08-14",
    notes: "Bloqueo vence el 17/7 si no transfiere.",
  },
  {
    code: "FT-2026-1035",
    packageSlug: "mendoza-vinos-4-noches",
    holderName: "Andrea Ceccarelli",
    holderEmail: "andrea.ceccarelli@outlook.com",
    adults: 2,
    children: 0,
    totalUsd: 938,
    status: "confirmada",
    payMethod: "Mercado Pago (6 cuotas)",
    advisor: "Sofía Gachet",
    createdAt: "2026-06-15",
    departureDate: "2026-08-21",
  },
  {
    code: "FT-2026-1034",
    packageSlug: "cancun-riviera-maya-8-noches",
    holderName: "Federico y Luciana Ambrosini",
    holderEmail: "fedeambrosini@gmail.com",
    adults: 2,
    children: 0,
    totalUsd: 3380,
    status: "en-revision",
    payMethod: "Seña + saldo",
    advisor: "Sofía Gachet",
    createdAt: "2026-07-11",
    departureDate: "2026-10-10",
    notes: "Consultaron upgrade a swim-up: cotizado, esperan respuesta.",
  },
  {
    code: "FT-2026-1033",
    packageSlug: "florianopolis-7-noches-bus",
    holderName: "Milagros Depetris",
    holderEmail: "milidepetris@gmail.com",
    adults: 4,
    children: 0,
    totalUsd: 1716,
    status: "cancelada",
    payMethod: "Seña + saldo",
    advisor: "Diego Anselmi",
    createdAt: "2026-05-30",
    departureDate: "2027-01-08",
    notes: "Canceló el 20/6 por tema laboral. Seña devuelta según política (sin costo, +20 días).",
  },
  {
    code: "FT-2026-1032",
    packageSlug: "turquia-magica-8-noches",
    holderName: "Norma Palavecino",
    holderEmail: "npalavecino54@gmail.com",
    adults: 2,
    children: 0,
    totalUsd: 4780,
    status: "confirmada",
    payMethod: "Transferencia",
    advisor: "Marcela Buttini",
    createdAt: "2026-06-05",
    departureDate: "2026-09-22",
    notes: "Reservaron vuelo en globo (2 pax). Confirmar 72 h antes con el operador.",
  },
  {
    code: "FT-2026-1031",
    packageSlug: "bariloche-invierno-5-noches",
    holderName: "Colegio San Roque (grupo)",
    holderEmail: "coordinacion@sanroque.edu.ar",
    adults: 6,
    children: 24,
    totalUsd: 14820,
    status: "pendiente-de-pago",
    payMethod: "Transferencia (3 pagos)",
    advisor: "Diego Anselmi",
    createdAt: "2026-05-12",
    departureDate: "2026-08-08",
    notes: "Grupo escolar: segundo pago vence 20/7. Falta autorización de 3 menores.",
  },
];

export interface AdminCustomer {
  name: string;
  email: string;
  phone: string;
  city: "Funes" | "Rosario" | "Roldán" | "Pérez";
  trips: number;
  totalValueUsd: number;
  lastBooking: string;
  preferences: string;
}

export const adminCustomers: AdminCustomer[] = [
  { name: "Carolina Bertoldi", email: "caro.bertoldi@gmail.com", phone: "341 5223841", city: "Funes", trips: 4, totalValueUsd: 8940, lastBooking: "2026-06-28", preferences: "Caribe y playa. Viaja siempre en septiembre. Prefiere all inclusive 5★." },
  { name: "Rubén Scaglia", email: "rscaglia58@hotmail.com", phone: "341 6890122", city: "Rosario", trips: 2, totalValueUsd: 9280, lastBooking: "2026-06-25", preferences: "Circuitos culturales con ritmo tranquilo. Pide asientos de pasillo." },
  { name: "José Maldonado Ruiz", email: "jmaldonado.ruiz@gmail.com", phone: "341 5077310", city: "Rosario", trips: 3, totalValueUsd: 5120, lastBooking: "2026-06-22", preferences: "Viajes familiares con chicos. Habitaciones familiares o conectadas." },
  { name: "Julián Ferreyra", email: "julifer92@gmail.com", phone: "341 3980456", city: "Funes", trips: 2, totalValueUsd: 7100, lastBooking: "2026-06-20", preferences: "Viajes con amigos, presupuesto medio. Responde mejor por WhatsApp." },
  { name: "Valeria Scarpetta", email: "vale.scarpetta@gmail.com", phone: "341 2255873", city: "Funes", trips: 1, totalValueUsd: 5580, lastBooking: "2026-07-08", preferences: "Luna de miel Grecia. Potencial cliente premium: le interesa Maldivas 2027." },
  { name: "Graciela Bonfiglio", email: "gbonfiglio@yahoo.com.ar", phone: "341 4412098", city: "Roldán", trips: 3, totalValueUsd: 6870, lastBooking: "2026-07-02", preferences: "Salidas grupales acompañadas. Habitación individual, pide compañera de cuarto si hay." },
  { name: "Andrea Ceccarelli", email: "andrea.ceccarelli@outlook.com", phone: "341 6120345", city: "Pérez", trips: 2, totalValueUsd: 1830, lastBooking: "2026-06-15", preferences: "Escapadas gastronómicas en pareja. Celíaca: avisar a hoteles y restaurantes." },
  { name: "Federico Ambrosini", email: "fedeambrosini@gmail.com", phone: "341 7789021", city: "Funes", trips: 1, totalValueUsd: 3380, lastBooking: "2026-07-11", preferences: "Primer viaje largo en pareja. Interesados en upgrades si el precio cierra." },
  { name: "Norma Palavecino", email: "npalavecino54@gmail.com", phone: "341 5583467", city: "Rosario", trips: 5, totalValueUsd: 15230, lastBooking: "2026-06-05", preferences: "Viajera frecuente de circuitos exóticos. Ya hizo Europa, Egipto y Marruecos con la agencia." },
  { name: "Milagros Depetris", email: "milidepetris@gmail.com", phone: "341 3345690", city: "Roldán", trips: 1, totalValueUsd: 0, lastBooking: "2026-05-30", preferences: "Canceló su primer viaje por trabajo. Retomar contacto en octubre para verano 2027." },
];

export type AdminQuoteStatus = "recibida" | "en-revision" | "propuesta-enviada" | "aprobada" | "vencida";

export interface AdminQuote {
  id: string;
  destination: string;
  customer: string;
  travelers: string;
  approxDate: string;
  status: AdminQuoteStatus;
  advisor: string;
  validUntil: string;
}

export const adminQuotes: AdminQuote[] = [
  { id: "Q-2026-0218", destination: "Maldivas + Dubái", customer: "Valeria Scarpetta", travelers: "2 adultos", approxDate: "2027-03", status: "recibida", advisor: "Marcela Buttini", validUntil: "2026-07-25" },
  { id: "Q-2026-0217", destination: "Disney y Universal (Orlando)", customer: "Sebastián Comelli", travelers: "2 adultos + 2 niños", approxDate: "2027-01", status: "en-revision", advisor: "Sofía Gachet", validUntil: "2026-07-22" },
  { id: "Q-2026-0216", destination: "Patagonia completa (El Calafate + Ushuaia)", customer: "Marina Zapata", travelers: "2 adultos", approxDate: "2026-11", status: "propuesta-enviada", advisor: "Diego Anselmi", validUntil: "2026-07-18" },
  { id: "Q-2026-0215", destination: "Italia de las raíces (Calabria + Roma)", customer: "Norma Palavecino", travelers: "3 adultos", approxDate: "2027-05", status: "propuesta-enviada", advisor: "Marcela Buttini", validUntil: "2026-07-20" },
  { id: "Q-2026-0214", destination: "Cusco y Machu Picchu", customer: "Lucas Benedetti", travelers: "Grupo de amigos (5)", approxDate: "2026-10", status: "aprobada", advisor: "Diego Anselmi", validUntil: "2026-07-30" },
  { id: "Q-2026-0209", destination: "Crucero por el Mediterráneo", customer: "Hugo Casarotto", travelers: "2 adultos", approxDate: "2026-09", status: "vencida", advisor: "Sofía Gachet", validUntil: "2026-06-28" },
];

export const adminMetrics = {
  monthSalesUsd: 48620,
  newBookings: 14,
  openQuotes: 5,
  pendingPaymentsUsd: 19850,
  conversionPct: 23.4,
  avgBookingUsd: 3473,
  salesByMonth: [
    { month: "Feb", salesUsd: 31200 },
    { month: "Mar", salesUsd: 38900 },
    { month: "Abr", salesUsd: 27400 },
    { month: "May", salesUsd: 41800 },
    { month: "Jun", salesUsd: 52300 },
    { month: "Jul", salesUsd: 48620 },
  ],
  topDestinations: [
    { name: "Bariloche", bookings: 21 },
    { name: "Punta Cana", bookings: 14 },
    { name: "Río de Janeiro", bookings: 11 },
    { name: "Europa clásica", bookings: 8 },
    { name: "Cataratas del Iguazú", bookings: 7 },
  ],
};

export interface Provider {
  name: string;
  kind: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  services: string[];
  contractUntil: string;
}

export const providers: Provider[] = [
  {
    name: "Andes Operador Mayorista",
    kind: "Operador mayorista",
    contactName: "Leandro Vitale",
    contactEmail: "lvitale@andesoperador.com.ar",
    phone: "011 4327-8890",
    services: ["Paquetes Caribe", "Circuitos Europa", "Turquía y exóticos"],
    contractUntil: "2027-03-31",
  },
  {
    name: "Patagonia Receptivo SRL",
    kind: "Receptivo nacional",
    contactName: "Carla Ñanco",
    contactEmail: "reservas@patagoniareceptivo.tur.ar",
    phone: "0294 442-1156",
    services: ["Traslados Bariloche y Ushuaia", "Excursiones", "Hotelería patagónica"],
    contractUntil: "2026-09-30",
  },
  {
    name: "Aerolíneas Argentinas (agencia IATA)",
    kind: "Aérea",
    contactName: "Canal agencias",
    contactEmail: "agencias@aerolineas.com.ar",
    phone: "0810 222-86527",
    services: ["Emisión cabotaje y regional", "Tarifas grupales"],
    contractUntil: "2027-12-31",
  },
  {
    name: "Assist Total",
    kind: "Asistencia al viajero",
    contactName: "Paula Giordano",
    contactEmail: "comercial@assisttotal.com",
    phone: "011 5218-4400",
    services: ["Coberturas 30k a 300k USD", "Seguro de cancelación", "Deportes de invierno"],
    contractUntil: "2026-08-31",
  },
  {
    name: "Bávaro Hotels Group",
    kind: "Hotelería internacional",
    contactName: "Yésica Peralta (rep. Argentina)",
    contactEmail: "argentina@bavarohotels.com",
    phone: "011 4813-2277",
    services: ["Cupos Punta Cana", "Tarifas confidenciales", "Upgrades novios"],
    contractUntil: "2027-06-30",
  },
];
