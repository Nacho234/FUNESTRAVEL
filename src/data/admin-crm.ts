import { adminCustomers, type AdminCustomer } from "./admin";

/**
 * CRM demo data: customers 360°, travelers, omnichannel conversations,
 * support tickets and travel documents.
 * DEMO — replace with real backend data before production.
 */

/* ── Clientes ────────────────────────────────────────────────────── */

export type CustomerSegment =
  | "nuevo"
  | "frecuente"
  | "VIP"
  | "familia"
  | "pareja"
  | "grupal"
  | "inactivo"
  | "con deuda";

export interface CustomerPreferences {
  destinos: string;
  tiposDeViaje: string;
  aerolineas: string;
  presupuesto: string;
  restricciones: string;
  accesibilidad: string;
  contactoPreferido: "WhatsApp" | "Correo" | "Teléfono";
  idioma: string;
}

export interface CrmCustomer extends AdminCustomer {
  id: string;
  avatarId: number;
  segments: CustomerSegment[];
  detailedPreferences: CustomerPreferences;
  companions: string[];
  lastActivity: string;
  notes: string[];
  taxId?: string;
}

const base = Object.fromEntries(adminCustomers.map((c) => [c.name, c])) as Record<string, AdminCustomer>;

export const crmCustomers: CrmCustomer[] = [
  {
    ...base["Carolina Bertoldi"],
    id: "C-1001",
    avatarId: 44,
    segments: ["frecuente", "pareja"],
    detailedPreferences: {
      destinos: "Caribe: Punta Cana, Cancún. Quiere conocer Aruba.",
      tiposDeViaje: "Playa y relax, siempre en septiembre",
      aerolineas: "Prefiere vuelos directos, Copa o Aerolíneas",
      presupuesto: "USD 2.000 a 3.000 por persona",
      restricciones: "Sin restricciones",
      accesibilidad: "No requiere",
      contactoPreferido: "WhatsApp",
      idioma: "Español",
    },
    companions: ["Martín Bertoldi (esposo)"],
    lastActivity: "Pagó la seña de FT-2026-1042 (hace 3 días)",
    notes: ["Siempre pide habitación en piso alto.", "Le interesó la promo de 12 cuotas: avisarle si se renueva."],
    taxId: "27-28456123-4",
  },
  {
    ...base["Rubén Scaglia"],
    id: "C-1002",
    avatarId: 12,
    segments: ["frecuente"],
    detailedPreferences: {
      destinos: "Europa clásica, próxima meta: Grecia",
      tiposDeViaje: "Circuitos culturales de ritmo tranquilo",
      aerolineas: "Iberia o Air Europa, asiento de pasillo",
      presupuesto: "USD 4.000 a 5.000 por persona",
      restricciones: "Marta es hipertensa: viaja con medicación",
      accesibilidad: "Evitar hoteles sin ascensor",
      contactoPreferido: "Teléfono",
      idioma: "Español",
    },
    companions: ["Marta Scaglia (esposa)"],
    lastActivity: "Cargó 2 pasaportes para revisar (ayer)",
    notes: ["Prefiere que lo llamen después de las 18 h."],
  },
  {
    ...base["José Maldonado Ruiz"],
    id: "C-1003",
    avatarId: 15,
    segments: ["familia", "frecuente"],
    detailedPreferences: {
      destinos: "Bariloche, Florianópolis. Consultó por Disney 2027.",
      tiposDeViaje: "Vacaciones familiares con chicos (8 y 11)",
      aerolineas: "Indistinto, prioriza horarios diurnos",
      presupuesto: "USD 1.200 a 1.800 por persona",
      restricciones: "El hijo menor es alérgico al maní",
      accesibilidad: "No requiere",
      contactoPreferido: "WhatsApp",
      idioma: "Español",
    },
    companions: ["Paula Ruiz (esposa)", "Tomás Maldonado (11)", "Benjamín Maldonado (8)"],
    lastActivity: "Consultó por Disney enero 2027 (hace 5 días)",
    notes: ["Los chicos viajan con DNI: recordar autorización si viaja uno solo de los padres."],
  },
  {
    ...base["Julián Ferreyra"],
    id: "C-1004",
    avatarId: 53,
    segments: ["grupal"],
    detailedPreferences: {
      destinos: "Brasil, Caribe. Próximo objetivo: México con amigos.",
      tiposDeViaje: "Viajes de amigos, playa y noche",
      aerolineas: "La más conveniente en precio",
      presupuesto: "USD 900 a 1.500 por persona",
      restricciones: "Sin restricciones",
      accesibilidad: "No requiere",
      contactoPreferido: "WhatsApp",
      idioma: "Español",
    },
    companions: ["Grupo de 6 amigos (referente de compra)"],
    lastActivity: "Cerró el ticket del reclamo de valija (hace 1 semana)",
    notes: ["Referente del grupo: coordina pagos individuales de los 6.", "Quedó conforme con la resolución del reclamo."],
  },
  {
    ...base["Valeria Scarpetta"],
    id: "C-1005",
    avatarId: 47,
    segments: ["VIP", "pareja", "nuevo"],
    detailedPreferences: {
      destinos: "Grecia (hecho). Interesada en Maldivas y Polinesia.",
      tiposDeViaje: "Lunas de miel y aniversarios, hoteles boutique",
      aerolineas: "Emirates o Turkish si el precio acompaña",
      presupuesto: "USD 4.000+ por persona",
      restricciones: "Hernán no come mariscos",
      accesibilidad: "No requiere",
      contactoPreferido: "WhatsApp",
      idioma: "Español",
    },
    companions: ["Hernán Scarpetta (esposo)"],
    lastActivity: "Pidió cotización Maldivas + Dubái (hace 2 días)",
    notes: ["Cliente premium potencial: la luna de miel salió perfecta.", "Aniversario de casados: 20 de abril."],
  },
  {
    ...base["Graciela Bonfiglio"],
    id: "C-1006",
    avatarId: 32,
    segments: ["frecuente", "grupal"],
    detailedPreferences: {
      destinos: "Europa (hecho), Turquía (anotada para 2027)",
      tiposDeViaje: "Salidas grupales acompañadas",
      aerolineas: "Indistinto",
      presupuesto: "USD 3.500 a 4.500 por persona",
      restricciones: "Sin restricciones",
      accesibilidad: "Caminatas moderadas, sin trekking",
      contactoPreferido: "Teléfono",
      idioma: "Español",
    },
    companions: ["Viaja sola, pide compañera de cuarto"],
    lastActivity: "Se anotó en la lista de la salida grupal a Turquía (hace 1 semana)",
    notes: ["Trae amigas nuevas a cada salida: 2 referidas en 2025."],
  },
  {
    ...base["Andrea Ceccarelli"],
    id: "C-1007",
    avatarId: 26,
    segments: ["pareja"],
    detailedPreferences: {
      destinos: "Mendoza (hecho), quiere Salta y San Juan",
      tiposDeViaje: "Escapadas gastronómicas y enoturismo",
      aerolineas: "Indistinto, también viaja en auto",
      presupuesto: "USD 400 a 700 por persona",
      restricciones: "Celíaca: avisar a hoteles y restaurantes",
      accesibilidad: "No requiere",
      contactoPreferido: "Correo",
      idioma: "Español",
    },
    companions: ["Luciano Vera (pareja)"],
    lastActivity: "Reservó Mendoza entre vinos (hace 1 mes)",
    notes: ["SIEMPRE confirmar menú sin TACC antes de cerrar restaurantes."],
  },
  {
    ...base["Federico Ambrosini"],
    id: "C-1008",
    avatarId: 68,
    segments: ["nuevo", "pareja"],
    detailedPreferences: {
      destinos: "Río de Janeiro (próximo), sueña con Japón",
      tiposDeViaje: "Primeros viajes largos en pareja",
      aerolineas: "GOL o LATAM",
      presupuesto: "USD 1.000 a 1.500 por persona",
      restricciones: "Sin restricciones",
      accesibilidad: "No requiere",
      contactoPreferido: "WhatsApp",
      idioma: "Español",
    },
    companions: ["Camila Ordoñez (novia)"],
    lastActivity: "Consultó upgrade a habitación frente al mar (hace 4 días)",
    notes: ["Interesado en upgrades si el precio cierra: ofrecer al confirmar."],
  },
  {
    ...base["Norma Palavecino"],
    id: "C-1009",
    avatarId: 35,
    segments: ["VIP", "frecuente"],
    detailedPreferences: {
      destinos: "Exóticos: hizo Egipto, Marruecos, Turquía. Pendiente: India.",
      tiposDeViaje: "Circuitos largos con guía en español",
      aerolineas: "Turkish, Emirates. Business si hay tarifa conveniente.",
      presupuesto: "USD 5.000+ por persona",
      restricciones: "Vegetariana",
      accesibilidad: "No requiere",
      contactoPreferido: "Teléfono",
      idioma: "Español e inglés",
    },
    companions: ["A veces viaja con su hija Inés"],
    lastActivity: "Recibió propuesta Italia de las raíces (hace 3 días)",
    notes: ["Mejor clienta del segmento exóticos: 5 viajes, USD 15.230.", "Su hija Inés maneja parte de la decisión: copiarla en las propuestas."],
    taxId: "27-11458963-8",
  },
  {
    ...base["Milagros Depetris"],
    id: "C-1010",
    avatarId: 24,
    segments: ["inactivo", "nuevo"],
    detailedPreferences: {
      destinos: "Florianópolis (canceló por trabajo)",
      tiposDeViaje: "Playa con amigas",
      aerolineas: "Bus o low cost, prioriza precio",
      presupuesto: "Hasta USD 600 por persona",
      restricciones: "Sin restricciones",
      accesibilidad: "No requiere",
      contactoPreferido: "WhatsApp",
      idioma: "Español",
    },
    companions: ["Grupo de 3 amigas"],
    lastActivity: "Canceló su reserva de verano (hace 6 semanas)",
    notes: ["Retomar contacto en octubre para verano 2027: quedó con crédito de seña."],
  },
];

/* ── Pasajeros ───────────────────────────────────────────────────── */

export type TravelerAlert = "pasaporte vencido" | "pasaporte por vencer" | "documento incompleto" | "menor sin autorización";

export interface CrmTraveler {
  id: string;
  name: string;
  birthDate: string;
  nationality: string;
  dni: string;
  passport?: string;
  passportExpiry?: string;
  passportCountry?: string;
  specialNeeds?: string;
  relatedBookings: string[];
  alerts: TravelerAlert[];
  customer: string;
}

export const crmTravelers: CrmTraveler[] = [
  { id: "P-2001", name: "Carolina Bertoldi", birthDate: "1984-09-14", nationality: "Argentina", dni: "30.845.221", passport: "AAF204518", passportExpiry: "2031-02-11", passportCountry: "Argentina", relatedBookings: ["FT-2026-1042"], alerts: [], customer: "Carolina Bertoldi" },
  { id: "P-2002", name: "Martín Bertoldi", birthDate: "1982-03-02", nationality: "Argentina", dni: "29.556.870", passport: "AAF204519", passportExpiry: "2031-02-11", passportCountry: "Argentina", relatedBookings: ["FT-2026-1042"], alerts: [], customer: "Carolina Bertoldi" },
  { id: "P-2003", name: "Rubén Scaglia", birthDate: "1958-06-30", nationality: "Argentina", dni: "12.334.905", passport: "AAB918264", passportExpiry: "2026-11-03", passportCountry: "Argentina", specialNeeds: "Asiento de pasillo", relatedBookings: ["FT-2026-1041"], alerts: ["pasaporte por vencer"], customer: "Rubén Scaglia" },
  { id: "P-2004", name: "Marta Scaglia", birthDate: "1960-01-19", nationality: "Argentina", dni: "13.902.114", passport: "AAB918265", passportExpiry: "2026-08-22", passportCountry: "Argentina", specialNeeds: "Hipertensa, viaja con medicación", relatedBookings: ["FT-2026-1041"], alerts: ["pasaporte por vencer"], customer: "Rubén Scaglia" },
  { id: "P-2005", name: "José Maldonado Ruiz", birthDate: "1985-11-08", nationality: "Argentina", dni: "31.774.362", relatedBookings: ["FT-2026-1040"], alerts: [], customer: "José Maldonado Ruiz" },
  { id: "P-2006", name: "Paula Ruiz", birthDate: "1987-04-25", nationality: "Argentina", dni: "32.980.417", relatedBookings: ["FT-2026-1040"], alerts: [], customer: "José Maldonado Ruiz" },
  { id: "P-2007", name: "Tomás Maldonado", birthDate: "2014-10-12", nationality: "Argentina", dni: "54.120.336", relatedBookings: ["FT-2026-1040"], alerts: [], customer: "José Maldonado Ruiz" },
  { id: "P-2008", name: "Benjamín Maldonado", birthDate: "2017-07-03", nationality: "Argentina", dni: "56.443.108", specialNeeds: "Alergia al maní", relatedBookings: ["FT-2026-1040"], alerts: ["menor sin autorización"], customer: "José Maldonado Ruiz" },
  { id: "P-2009", name: "Valeria Scarpetta", birthDate: "1993-04-20", nationality: "Argentina", dni: "37.229.481", passport: "AAG550112", passportExpiry: "2033-01-15", passportCountry: "Argentina", relatedBookings: ["FT-2026-1035"], alerts: [], customer: "Valeria Scarpetta" },
  { id: "P-2010", name: "Hernán Scarpetta", birthDate: "1991-12-05", nationality: "Argentina", dni: "36.118.752", passport: "AAG550113", passportExpiry: "2033-01-15", passportCountry: "Argentina", specialNeeds: "No come mariscos", relatedBookings: ["FT-2026-1035"], alerts: [], customer: "Valeria Scarpetta" },
  { id: "P-2011", name: "Graciela Bonfiglio", birthDate: "1962-02-17", nationality: "Argentina", dni: "14.667.230", passport: "AAC112743", passportExpiry: "2026-05-30", passportCountry: "Argentina", relatedBookings: ["FT-2026-1037"], alerts: ["pasaporte vencido"], customer: "Graciela Bonfiglio" },
  { id: "P-2012", name: "Alfredo Morelli", birthDate: "1975-08-09", nationality: "Italiana", dni: "94.220.187", passport: "YB5581920", passportExpiry: "2026-08-15", passportCountry: "Italia", relatedBookings: ["FT-2026-1038"], alerts: ["pasaporte por vencer"], customer: "Norma Palavecino" },
  { id: "P-2013", name: "Federico Ambrosini", birthDate: "1994-05-27", nationality: "Argentina", dni: "38.554.906", relatedBookings: ["FT-2026-1039"], alerts: [], customer: "Federico Ambrosini" },
  { id: "P-2014", name: "Camila Ordoñez", birthDate: "1996-09-30", nationality: "Argentina", dni: "39.881.245", relatedBookings: ["FT-2026-1039"], alerts: ["documento incompleto"], customer: "Federico Ambrosini" },
];

/* ── Conversaciones omnicanal ────────────────────────────────────── */

export type ConversationChannel = "web" | "whatsapp" | "correo" | "instagram" | "facebook" | "telefono";
export type ConversationStatus =
  | "nueva"
  | "abierta"
  | "esperando cliente"
  | "esperando proveedor"
  | "cotización enviada"
  | "resuelta"
  | "cerrada";

export interface ConversationMessage {
  author: "cliente" | "asesor";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  customer: string;
  avatarId: number;
  channel: ConversationChannel;
  date: string;
  advisor: string;
  context: string;
  destination?: string;
  status: ConversationStatus;
  priority: "alta" | "media" | "baja";
  tags: string[];
  messages: ConversationMessage[];
  internalNotes: string[];
}

export const conversations: Conversation[] = [
  {
    id: "CV-3101",
    customer: "Sebastián Comelli",
    avatarId: 59,
    channel: "whatsapp",
    date: "2026-07-16",
    advisor: "Sin asignar",
    context: "Disney y Universal para enero 2027, 2 adultos y 2 niños",
    destination: "Orlando",
    status: "nueva",
    priority: "alta",
    tags: ["familia", "temporada alta"],
    messages: [
      { author: "cliente", text: "Hola! Queremos ir a Disney en enero de 2027 con los chicos (6 y 9). ¿Arman ese viaje?", time: "09:42" },
      { author: "cliente", text: "Serían unos 10 días, con parques y algo de compras.", time: "09:43" },
      { author: "cliente", text: "¿Me pasás un precio estimado para ir viendo? Gracias!", time: "09:45" },
    ],
    internalNotes: [],
  },
  {
    id: "CV-3100",
    customer: "Valeria Scarpetta",
    avatarId: 47,
    channel: "whatsapp",
    date: "2026-07-15",
    advisor: "Marcela Buttini",
    context: "Cotización Maldivas + Dubái para marzo 2027",
    destination: "Maldivas",
    status: "abierta",
    priority: "alta",
    tags: ["VIP", "luna de miel"],
    messages: [
      { author: "cliente", text: "Hola Marce! Con Hernán queremos hacer Maldivas para nuestro aniversario, ¿se puede combinar con Dubái?", time: "18:20" },
      { author: "asesor", text: "¡Hola Vale! Sí, es un combinado hermoso. Emirates los deja en Dubái y de ahí a Malé. ¿Cuántas noches piensan?", time: "18:34" },
      { author: "cliente", text: "Unas 10 en total. Queremos overwater aunque sea unas noches 🙈", time: "18:41" },
      { author: "asesor", text: "Perfecto, armo 2 opciones: una con 4 noches overwater y otra completa. Te las paso el viernes.", time: "18:50" },
    ],
    internalNotes: ["Cliente VIP: priorizar. Pedí tarifas a la operadora de Emiratos hoy."],
  },
  {
    id: "CV-3099",
    customer: "Marina Zapata",
    avatarId: 41,
    channel: "web",
    date: "2026-07-14",
    advisor: "Diego Anselmi",
    context: "Patagonia completa en noviembre, esperando confirmación de hotel en El Calafate",
    destination: "Patagonia",
    status: "esperando proveedor",
    priority: "media",
    tags: ["naturaleza"],
    messages: [
      { author: "cliente", text: "Buenas! Vi el formulario de viajes a medida y me interesa El Calafate + Ushuaia en noviembre, 2 adultos.", time: "11:02" },
      { author: "asesor", text: "¡Hola Marina! Buenísima época. Ya pedí disponibilidad al hotel que da al lago. Apenas confirme te paso propuesta.", time: "12:15" },
      { author: "cliente", text: "Genial, espero. Preferimos hoteles chicos antes que cadenas.", time: "12:30" },
    ],
    internalNotes: ["Hotel Los Notros sin respuesta hace 48 h: reclamar hoy."],
  },
  {
    id: "CV-3098",
    customer: "Familia Griguol",
    avatarId: 22,
    channel: "instagram",
    date: "2026-07-14",
    advisor: "Sofía Gachet",
    context: "Vieron el reel de Bariloche, consultan por vacaciones de invierno",
    destination: "Bariloche",
    status: "cotización enviada",
    priority: "media",
    tags: ["nieve", "familia"],
    messages: [
      { author: "cliente", text: "Hola! Vimos el video de Bariloche 😍 ¿tienen algo para la segunda quincena de agosto? Somos 4.", time: "20:11" },
      { author: "asesor", text: "¡Hola! Sí, queda lugar en la salida del 22/8. Les mando la cotización por acá y por mail. 🏔️", time: "20:40" },
      { author: "cliente", text: "Recibido, lo vemos con mi marido y te decimos!", time: "21:05" },
    ],
    internalNotes: [],
  },
  {
    id: "CV-3097",
    customer: "Hugo Casarotto",
    avatarId: 14,
    channel: "telefono",
    date: "2026-07-13",
    advisor: "Sofía Gachet",
    context: "Llamó por el crucero por el Mediterráneo, la cotización anterior venció",
    destination: "Mediterráneo",
    status: "abierta",
    priority: "media",
    tags: ["cruceros", "recotizar"],
    messages: [
      { author: "asesor", text: "Registro de llamada: Hugo pide recotizar el crucero de septiembre para 2 adultos, cabina con balcón.", time: "10:20" },
      { author: "asesor", text: "Le comenté que la tarifa anterior venció. Quedé en enviarle valores nuevos esta semana.", time: "10:22" },
    ],
    internalNotes: ["MSC subió tarifas 8% desde la cotización anterior: avisarle antes de que se sorprenda."],
  },
  {
    id: "CV-3096",
    customer: "Andrea Ceccarelli",
    avatarId: 26,
    channel: "correo",
    date: "2026-07-12",
    advisor: "Marcela Buttini",
    context: "Consulta menú sin TACC del almuerzo en bodega (reserva Mendoza)",
    destination: "Mendoza",
    status: "esperando cliente",
    priority: "baja",
    tags: ["celíaca", "post-venta"],
    messages: [
      { author: "cliente", text: "Hola Marcela, ¿pudiste confirmar si el almuerzo de 6 pasos tiene opción sin TACC completa?", time: "15:30" },
      { author: "asesor", text: "Hola Andre! Sí, la bodega confirmó menú sin TACC de los 6 pasos. ¿Querés que también avise al hotel por los desayunos?", time: "16:44" },
    ],
    internalNotes: [],
  },
  {
    id: "CV-3095",
    customer: "Lucía Ferrandiz",
    avatarId: 45,
    channel: "facebook",
    date: "2026-07-11",
    advisor: "Sin asignar",
    context: "Pregunta si hacen viajes de egresados",
    status: "nueva",
    priority: "baja",
    tags: ["egresados"],
    messages: [
      { author: "cliente", text: "Hola, ¿organizan viajes de egresados para secundaria? Somos un curso de 32 chicos de Funes.", time: "22:15" },
    ],
    internalNotes: [],
  },
  {
    id: "CV-3094",
    customer: "Federico Ambrosini",
    avatarId: 68,
    channel: "whatsapp",
    date: "2026-07-11",
    advisor: "Sofía Gachet",
    context: "Upgrade a habitación frente al mar en Río",
    destination: "Río de Janeiro",
    status: "cotización enviada",
    priority: "media",
    tags: ["upgrade", "post-venta"],
    messages: [
      { author: "cliente", text: "Sofi, ¿cuánto sale pasar a la habitación frente al mar? Es sorpresa para Cami 😁", time: "13:05" },
      { author: "asesor", text: "¡Qué lindo! La diferencia son USD 37 por noche, USD 222 total. ¿Lo sumo a la reserva?", time: "13:26" },
      { author: "cliente", text: "Dale, lo hablo con el banco y te confirmo mañana jaja", time: "13:31" },
    ],
    internalNotes: ["Bloqueé la habitación frente al mar hasta el viernes con el hotel."],
  },
  {
    id: "CV-3093",
    customer: "Colegio San Roque",
    avatarId: 8,
    channel: "correo",
    date: "2026-07-10",
    advisor: "Diego Anselmi",
    context: "Pago pendiente y autorizaciones de menores del viaje a Bariloche",
    destination: "Bariloche",
    status: "esperando cliente",
    priority: "alta",
    tags: ["grupo escolar", "pagos"],
    messages: [
      { author: "asesor", text: "Buen día. Les recuerdo que el segundo pago venció el 20/6 y faltan 3 autorizaciones de menores. ¿Cómo vienen con eso?", time: "09:00" },
      { author: "cliente", text: "Buen día Diego, la cooperadora junta los fondos esta semana. Las autorizaciones las llevamos el lunes.", time: "11:47" },
      { author: "asesor", text: "Perfecto, con eso destrabamos todo. Cualquier cosa me avisan.", time: "12:02" },
    ],
    internalNotes: ["Si el lunes no llegan las autorizaciones, escalar a dirección del colegio."],
  },
  {
    id: "CV-3092",
    customer: "Graciela Bonfiglio",
    avatarId: 32,
    channel: "telefono",
    date: "2026-07-08",
    advisor: "Marcela Buttini",
    context: "Renovación de pasaporte vencido antes de la salida grupal a Turquía",
    destination: "Turquía",
    status: "resuelta",
    priority: "media",
    tags: ["documentación", "grupal"],
    messages: [
      { author: "asesor", text: "Registro de llamada: le avisé a Graciela que su pasaporte figura vencido desde mayo.", time: "10:10" },
      { author: "cliente", text: "Ay, ni lo había mirado. Saco turno en el Correo esta semana. ¡Gracias por avisarme con tiempo!", time: "10:12" },
      { author: "asesor", text: "De nada. Con turno esta semana llega perfecto para la salida de abril.", time: "10:14" },
    ],
    internalNotes: ["Turno confirmado para el 22/7. Volver a verificar en agosto."],
  },
];

/* ── Tickets ─────────────────────────────────────────────────────── */

export type TicketCategory = "cambios" | "cancelaciones" | "reclamos" | "documentación" | "pagos" | "asistencia en viaje";
export type TicketStatus = "abierta" | "en curso" | "esperando cliente" | "resuelta";

export interface Ticket {
  id: string;
  title: string;
  category: TicketCategory;
  priority: "alta" | "media" | "baja";
  slaDate: string;
  assignee: string;
  customer: string;
  booking?: string;
  status: TicketStatus;
  messages: { author: string; text: string; time: string }[];
  resolution?: string;
  createdAt: string;
}

export const tickets: Ticket[] = [
  {
    id: "T-4021",
    title: "Reintegro por demora de valija (Río de Janeiro)",
    category: "reclamos",
    priority: "media",
    slaDate: "2026-07-20",
    assignee: "Diego Anselmi",
    customer: "Julián Ferreyra",
    booking: "FT-2026-1033",
    status: "en curso",
    createdAt: "2026-07-02",
    messages: [
      { author: "Diego Anselmi", text: "Denuncia PIR presentada en Galeão. La asistencia pide los tickets de las compras de primera necesidad.", time: "2/7 15:20" },
      { author: "Julián Ferreyra", text: "Les mandé las fotos de los tickets por WhatsApp, son USD 180 en total.", time: "3/7 10:05" },
      { author: "Diego Anselmi", text: "Recibidos y cargados en el portal de la aseguradora. Plazo de respuesta: 15 días hábiles.", time: "3/7 11:40" },
    ],
  },
  {
    id: "T-4020",
    title: "Cambio de fecha por cirugía programada",
    category: "cambios",
    priority: "alta",
    slaDate: "2026-07-17",
    assignee: "Sofía Gachet",
    customer: "Elena Brarda",
    booking: "FT-2026-1036",
    status: "abierta",
    createdAt: "2026-07-14",
    messages: [
      { author: "Elena Brarda", text: "Me operan de la rodilla el 5/8 y el viaje a Iguazú es el 14/8. Necesito pasarlo a octubre.", time: "14/7 09:30" },
      { author: "Sofía Gachet", text: "Lamento la noticia, Elena. Consulto penalidades del aéreo y disponibilidad de octubre y te confirmo hoy.", time: "14/7 10:12" },
    ],
  },
  {
    id: "T-4019",
    title: "Autorizaciones de menores incompletas (grupo escolar)",
    category: "documentación",
    priority: "alta",
    slaDate: "2026-07-18",
    assignee: "Diego Anselmi",
    customer: "Colegio San Roque",
    booking: "FT-2026-1031",
    status: "esperando cliente",
    createdAt: "2026-07-08",
    messages: [
      { author: "Diego Anselmi", text: "Faltan 3 autorizaciones ante escribano. El colegio quedó en traerlas el lunes 20.", time: "10/7 12:00" },
    ],
  },
  {
    id: "T-4018",
    title: "Pago duplicado en Mercado Pago",
    category: "pagos",
    priority: "alta",
    slaDate: "2026-07-16",
    assignee: "Sofía Gachet",
    customer: "Carolina Bertoldi",
    booking: "FT-2026-1042",
    status: "resuelta",
    createdAt: "2026-07-09",
    resolution: "Se identificó débito duplicado de la seña. Mercado Pago reversó el segundo cobro en 72 h. Clienta notificada y conforme.",
    messages: [
      { author: "Carolina Bertoldi", text: "Me llegaron dos débitos de la seña, ¿pueden revisar?", time: "9/7 08:50" },
      { author: "Sofía Gachet", text: "Sí, veo el duplicado. Ya inicié la reversa con Mercado Pago, en 72 h impacta en tu resumen.", time: "9/7 09:30" },
      { author: "Carolina Bertoldi", text: "Ya me llegó la reversa. ¡Gracias por la rapidez!", time: "12/7 16:20" },
    ],
  },
  {
    id: "T-4017",
    title: "Asistencia en viaje: turno médico en Bariloche",
    category: "asistencia en viaje",
    priority: "media",
    slaDate: "2026-07-15",
    assignee: "Marcela Buttini",
    customer: "Familia Herrera",
    booking: "FT-2026-1040",
    status: "resuelta",
    createdAt: "2026-07-12",
    resolution: "La asistencia coordinó guardia pediátrica en Sanatorio San Carlos por otitis. Atención sin costo, viaje continuó normal.",
    messages: [
      { author: "Familia Herrera", text: "Estamos en Bariloche y el nene tiene dolor de oído fuerte, ¿cómo usamos la asistencia?", time: "12/7 21:15" },
      { author: "Marcela Buttini", text: "Ya abrí el caso con la central. En 10 minutos los llama el médico coordinador. Cualquier cosa estoy acá.", time: "12/7 21:22" },
      { author: "Familia Herrera", text: "Lo atendieron bárbaro, otitis leve, ya con gotas. ¡Gracias!", time: "13/7 00:10" },
    ],
  },
  {
    id: "T-4016",
    title: "Cancelación por fallecimiento familiar",
    category: "cancelaciones",
    priority: "media",
    slaDate: "2026-07-22",
    assignee: "Sofía Gachet",
    customer: "Mario Gutiérrez",
    booking: "FT-2026-1034",
    status: "en curso",
    createdAt: "2026-07-11",
    messages: [
      { author: "Sofía Gachet", text: "Caso con certificado de defunción presentado. El seguro de cancelación cubre el 100% de la porción terrestre; gestionando reembolso del aéreo con la aerolínea.", time: "11/7 14:00" },
    ],
  },
];

/* ── Documentación ───────────────────────────────────────────────── */

export type DocumentType = "pasaporte" | "DNI" | "visa" | "autorización menor" | "voucher" | "factura" | "itinerario";
export type DocumentStatus = "pendiente" | "cargado" | "en revisión" | "aprobado" | "rechazado" | "vencido";

export interface CrmDocument {
  id: string;
  name: string;
  type: DocumentType;
  person: string;
  booking?: string;
  status: DocumentStatus;
  uploadedAt?: string;
  expiry?: string;
  reviewer?: string;
  rejectReason?: string;
}

export const crmDocuments: CrmDocument[] = [
  { id: "D-5031", name: "Pasaporte Rubén Scaglia.pdf", type: "pasaporte", person: "Rubén Scaglia", booking: "FT-2026-1041", status: "en revisión", uploadedAt: "2026-07-15", expiry: "2026-11-03", reviewer: "Marcela Buttini" },
  { id: "D-5030", name: "Pasaporte Marta Scaglia.pdf", type: "pasaporte", person: "Marta Scaglia", booking: "FT-2026-1041", status: "en revisión", uploadedAt: "2026-07-15", expiry: "2026-08-22", reviewer: "Marcela Buttini" },
  { id: "D-5029", name: "DNI Camila Ordoñez (frente).jpg", type: "DNI", person: "Camila Ordoñez", booking: "FT-2026-1039", status: "rechazado", uploadedAt: "2026-07-12", reviewer: "Sofía Gachet", rejectReason: "Falta el dorso del documento y la foto está fuera de foco." },
  { id: "D-5028", name: "Autorización menor Benjamín Maldonado", type: "autorización menor", person: "Benjamín Maldonado", booking: "FT-2026-1040", status: "pendiente" },
  { id: "D-5027", name: "Pasaporte Graciela Bonfiglio.pdf", type: "pasaporte", person: "Graciela Bonfiglio", booking: "FT-2026-1037", status: "vencido", uploadedAt: "2026-05-02", expiry: "2026-05-30", reviewer: "Marcela Buttini" },
  { id: "D-5026", name: "DNI Carolina Bertoldi.pdf", type: "DNI", person: "Carolina Bertoldi", booking: "FT-2026-1042", status: "aprobado", uploadedAt: "2026-07-10", reviewer: "Sofía Gachet" },
  { id: "D-5025", name: "DNI Martín Bertoldi.pdf", type: "DNI", person: "Martín Bertoldi", booking: "FT-2026-1042", status: "aprobado", uploadedAt: "2026-07-10", reviewer: "Sofía Gachet" },
  { id: "D-5024", name: "Visa USA Sebastián Comelli", type: "visa", person: "Sebastián Comelli", status: "pendiente" },
  { id: "D-5023", name: "Voucher hotel Atlântico Praia.pdf", type: "voucher", person: "Federico Ambrosini", booking: "FT-2026-1039", status: "cargado", uploadedAt: "2026-07-13", reviewer: "Sofía Gachet" },
  { id: "D-5022", name: "Factura A-0003-00018220.pdf", type: "factura", person: "Norma Palavecino", booking: "FT-2026-1038", status: "aprobado", uploadedAt: "2026-07-08", reviewer: "Sofía Gachet" },
  { id: "D-5021", name: "Itinerario final Bariloche 25-7.pdf", type: "itinerario", person: "Colegio San Roque", booking: "FT-2026-1031", status: "cargado", uploadedAt: "2026-07-11", reviewer: "Diego Anselmi" },
  { id: "D-5020", name: "Pasaporte Alfredo Morelli.pdf", type: "pasaporte", person: "Alfredo Morelli", booking: "FT-2026-1038", status: "aprobado", uploadedAt: "2026-06-30", expiry: "2026-08-15", reviewer: "Marcela Buttini" },
];
