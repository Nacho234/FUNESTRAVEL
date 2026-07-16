// Demo data for the commercial modules (sales, payments, quote editor,
// finance). In production these come from the database / payment gateway.

export type SaleStatus = "confirmada" | "pendiente" | "completada" | "cancelada";
export type SalePayStatus = "pagado" | "pago parcial" | "pendiente" | "reembolsado";
export type SaleChannel = "web" | "whatsapp" | "oficina" | "instagram";

export interface AdminSale {
  id: string;
  customer: string;
  product: string;
  destination: string;
  seller: string;
  date: string;
  totalUsd: number;
  costUsd: number;
  taxesUsd: number;
  discountUsd: number;
  commissionUsd: number;
  marginUsd: number;
  marginPct: number;
  status: SaleStatus;
  payStatus: SalePayStatus;
  channel: SaleChannel;
  bookingCode?: string;
  lastActivity: string;
}

export const adminSales: AdminSale[] = [
  { id: "V-2026-0341", customer: "Carolina Bertoldi", product: "Punta Cana esencial", destination: "Punta Cana", seller: "Sofía Gachet", date: "2026-06-28", totalUsd: 2498, costUsd: 2010, taxesUsd: 180, discountUsd: 0, commissionUsd: 62, marginUsd: 246, marginPct: 9.8, status: "confirmada", payStatus: "pagado", channel: "web", bookingCode: "FT-2026-1042", lastActivity: "Voucher enviado el 10/7" },
  { id: "V-2026-0340", customer: "Rubén y Marta Scaglia", product: "Europa clásica", destination: "Madrid, París, Ámsterdam y Roma", seller: "Marcela Buttini", date: "2026-06-25", totalUsd: 7780, costUsd: 6420, taxesUsd: 520, discountUsd: 0, commissionUsd: 194, marginUsd: 646, marginPct: 8.3, status: "confirmada", payStatus: "pago parcial", channel: "oficina", bookingCode: "FT-2026-1041", lastActivity: "Recordatorio de saldo enviado el 10/7" },
  { id: "V-2026-0339", customer: "Familia Maldonado Ruiz", product: "Bariloche a la nieve", destination: "Bariloche", seller: "Diego Anselmi", date: "2026-06-22", totalUsd: 2340, costUsd: 1880, taxesUsd: 140, discountUsd: 117, commissionUsd: 58, marginUsd: 262, marginPct: 11.2, status: "confirmada", payStatus: "pagado", channel: "whatsapp", bookingCode: "FT-2026-1040", lastActivity: "Clase de esquí infantil reservada" },
  { id: "V-2026-0338", customer: "Julián Ferreyra", product: "Río de Janeiro completo", destination: "Río de Janeiro", seller: "Sofía Gachet", date: "2026-06-20", totalUsd: 5694, costUsd: 4720, taxesUsd: 390, discountUsd: 0, commissionUsd: 142, marginUsd: 442, marginPct: 7.8, status: "confirmada", payStatus: "pagado", channel: "web", bookingCode: "FT-2026-1039", lastActivity: "Grupo completo, 6 pax confirmados" },
  { id: "V-2026-0337", customer: "Valeria Scarpetta", product: "Grecia para dos", destination: "Atenas, Santorini y Mykonos", seller: "Marcela Buttini", date: "2026-07-08", totalUsd: 5580, costUsd: 4610, taxesUsd: 350, discountUsd: 0, commissionUsd: 139, marginUsd: 481, marginPct: 8.6, status: "pendiente", payStatus: "pendiente", channel: "instagram", bookingCode: "FT-2026-1038", lastActivity: "Esperando acreditación de transferencia" },
  { id: "V-2026-0336", customer: "Graciela Bonfiglio", product: "Norte argentino esencial", destination: "Salta y Jujuy", seller: "Marcela Buttini", date: "2026-07-02", totalUsd: 796, costUsd: 640, taxesUsd: 52, discountUsd: 0, commissionUsd: 19, marginUsd: 85, marginPct: 10.7, status: "confirmada", payStatus: "pagado", channel: "oficina", bookingCode: "FT-2026-1037", lastActivity: "Pago en efectivo registrado" },
  { id: "V-2026-0335", customer: "Pablo Sarraceno", product: "Escapada a Iguazú", destination: "Puerto Iguazú", seller: "Diego Anselmi", date: "2026-07-10", totalUsd: 1050, costUsd: 850, taxesUsd: 70, discountUsd: 0, commissionUsd: 26, marginUsd: 104, marginPct: 9.9, status: "pendiente", payStatus: "pendiente", channel: "whatsapp", bookingCode: "FT-2026-1036", lastActivity: "Bloqueo vence el 17/7" },
  { id: "V-2026-0334", customer: "Andrea Ceccarelli", product: "Mendoza entre vinos", destination: "Mendoza", seller: "Sofía Gachet", date: "2026-06-15", totalUsd: 938, costUsd: 745, taxesUsd: 62, discountUsd: 0, commissionUsd: 23, marginUsd: 108, marginPct: 11.5, status: "confirmada", payStatus: "pagado", channel: "web", bookingCode: "FT-2026-1035", lastActivity: "Aviso de celiaquía enviado a la bodega" },
  { id: "V-2026-0333", customer: "Federico y Luciana Ambrosini", product: "Cancún y Riviera Maya", destination: "Cancún", seller: "Sofía Gachet", date: "2026-07-11", totalUsd: 3380, costUsd: 2790, taxesUsd: 240, discountUsd: 0, commissionUsd: 84, marginUsd: 266, marginPct: 7.9, status: "pendiente", payStatus: "pago parcial", channel: "web", bookingCode: "FT-2026-1034", lastActivity: "Upgrade swim-up cotizado, esperan respuesta" },
  { id: "V-2026-0332", customer: "Milagros Depetris", product: "Florianópolis en bus", destination: "Florianópolis", seller: "Diego Anselmi", date: "2026-05-30", totalUsd: 1716, costUsd: 1420, taxesUsd: 110, discountUsd: 0, commissionUsd: 42, marginUsd: 144, marginPct: 8.4, status: "cancelada", payStatus: "reembolsado", channel: "instagram", bookingCode: "FT-2026-1033", lastActivity: "Seña devuelta según política" },
  { id: "V-2026-0331", customer: "Norma Palavecino", product: "Turquía mágica", destination: "Estambul y Capadocia", seller: "Marcela Buttini", date: "2026-06-05", totalUsd: 4780, costUsd: 3920, taxesUsd: 330, discountUsd: 239, commissionUsd: 119, marginUsd: 412, marginPct: 8.6, status: "confirmada", payStatus: "pagado", channel: "oficina", bookingCode: "FT-2026-1032", lastActivity: "Vuelo en globo confirmado con operador" },
  { id: "V-2026-0330", customer: "Colegio San Roque", product: "Bariloche a la nieve (grupo)", destination: "Bariloche", seller: "Diego Anselmi", date: "2026-05-12", totalUsd: 14820, costUsd: 12480, taxesUsd: 940, discountUsd: 741, commissionUsd: 370, marginUsd: 1030, marginPct: 7.0, status: "confirmada", payStatus: "pago parcial", channel: "oficina", bookingCode: "FT-2026-1031", lastActivity: "Segundo pago vence el 20/7" },
  { id: "V-2026-0329", customer: "Graciela Bonfiglio", product: "Asistencia premium 300k (upgrade)", destination: "Salta y Jujuy", seller: "Marcela Buttini", date: "2026-07-03", totalUsd: 65, costUsd: 41, taxesUsd: 5, discountUsd: 0, commissionUsd: 2, marginUsd: 17, marginPct: 26.2, status: "completada", payStatus: "pagado", channel: "oficina", lastActivity: "Póliza emitida y enviada" },
  { id: "V-2026-0328", customer: "Lucas Benedetti", product: "Aéreo Rosario - Salta (5 pax)", destination: "Salta", seller: "Sofía Gachet", date: "2026-07-05", totalUsd: 610, costUsd: 560, taxesUsd: 45, discountUsd: 0, commissionUsd: 0, marginUsd: 50, marginPct: 8.2, status: "completada", payStatus: "pagado", channel: "whatsapp", lastActivity: "Tickets emitidos" },
];

export type PaymentStatus =
  | "pendiente"
  | "iniciado"
  | "aprobado"
  | "rechazado"
  | "vencido"
  | "conciliado"
  | "devuelto";

export interface AdminPayment {
  id: string;
  bookingCode: string;
  customer: string;
  amount: number;
  currency: "USD" | "ARS";
  method: "Mercado Pago" | "Tarjeta" | "Transferencia" | "Efectivo" | "Link de pago";
  date: string;
  reference: string;
  responsible: string;
  status: PaymentStatus;
  concept: string;
}

export const adminPayments: AdminPayment[] = [
  { id: "P-2026-0872", bookingCode: "FT-2026-1042", customer: "Carolina Bertoldi", amount: 2498, currency: "USD", method: "Mercado Pago", date: "2026-06-28", reference: "MP-83921144", responsible: "Sofía Gachet", status: "conciliado", concept: "Pago total (12 cuotas)" },
  { id: "P-2026-0871", bookingCode: "FT-2026-1041", customer: "Rubén y Marta Scaglia", amount: 1556, currency: "USD", method: "Transferencia", date: "2026-06-26", reference: "TRF-30291", responsible: "Marcela Buttini", status: "conciliado", concept: "Seña 20%" },
  { id: "P-2026-0870", bookingCode: "FT-2026-1041", customer: "Rubén y Marta Scaglia", amount: 6224, currency: "USD", method: "Transferencia", date: "2026-08-04", reference: "pendiente", responsible: "Marcela Buttini", status: "pendiente", concept: "Saldo (vence 4/8)" },
  { id: "P-2026-0869", bookingCode: "FT-2026-1040", customer: "Familia Maldonado Ruiz", amount: 2808000, currency: "ARS", method: "Transferencia", date: "2026-06-23", reference: "TRF-29984", responsible: "Diego Anselmi", status: "conciliado", concept: "Pago total en pesos (TC día)" },
  { id: "P-2026-0868", bookingCode: "FT-2026-1039", customer: "Julián Ferreyra", amount: 5694, currency: "USD", method: "Mercado Pago", date: "2026-06-20", reference: "MP-83779021", responsible: "Sofía Gachet", status: "aprobado", concept: "Pago total del grupo" },
  { id: "P-2026-0867", bookingCode: "FT-2026-1038", customer: "Valeria Scarpetta", amount: 5580, currency: "USD", method: "Transferencia", date: "2026-07-08", reference: "TRF-30412", responsible: "Marcela Buttini", status: "iniciado", concept: "Pago total (aviso bancario demorado)" },
  { id: "P-2026-0866", bookingCode: "FT-2026-1037", customer: "Graciela Bonfiglio", amount: 955200, currency: "ARS", method: "Efectivo", date: "2026-07-02", reference: "REC-1187", responsible: "Marcela Buttini", status: "conciliado", concept: "Pago total en oficina" },
  { id: "P-2026-0865", bookingCode: "FT-2026-1036", customer: "Pablo Sarraceno", amount: 1050, currency: "USD", method: "Transferencia", date: "2026-07-17", reference: "pendiente", responsible: "Diego Anselmi", status: "vencido", concept: "Pago total (bloqueo vence 17/7)" },
  { id: "P-2026-0864", bookingCode: "FT-2026-1035", customer: "Andrea Ceccarelli", amount: 938, currency: "USD", method: "Mercado Pago", date: "2026-06-15", reference: "MP-83455870", responsible: "Sofía Gachet", status: "conciliado", concept: "Pago total (6 cuotas)" },
  { id: "P-2026-0863", bookingCode: "FT-2026-1034", customer: "Federico Ambrosini", amount: 676, currency: "USD", method: "Link de pago", date: "2026-07-11", reference: "LNK-4471", responsible: "Sofía Gachet", status: "aprobado", concept: "Seña 20%" },
  { id: "P-2026-0862", bookingCode: "FT-2026-1034", customer: "Federico Ambrosini", amount: 2704, currency: "USD", method: "Tarjeta", date: "2026-07-12", reference: "VISA-0921", responsible: "Sofía Gachet", status: "rechazado", concept: "Saldo (tarjeta rechazada, reintentar)" },
  { id: "P-2026-0861", bookingCode: "FT-2026-1033", customer: "Milagros Depetris", amount: 343, currency: "USD", method: "Transferencia", date: "2026-06-21", reference: "DEV-0090", responsible: "Diego Anselmi", status: "devuelto", concept: "Devolución de seña (cancelación sin costo)" },
  { id: "P-2026-0860", bookingCode: "FT-2026-1032", customer: "Norma Palavecino", amount: 4780, currency: "USD", method: "Transferencia", date: "2026-06-06", reference: "TRF-29761", responsible: "Marcela Buttini", status: "conciliado", concept: "Pago total" },
  { id: "P-2026-0859", bookingCode: "FT-2026-1031", customer: "Colegio San Roque", amount: 4940, currency: "USD", method: "Transferencia", date: "2026-06-10", reference: "TRF-29810", responsible: "Diego Anselmi", status: "conciliado", concept: "Primer pago de 3 (grupo escolar)" },
];

/* ── Quote editor drafts (opciones económica / recomendada / premium) ── */

export interface QuoteOptionDraft {
  tier: "económica" | "recomendada" | "premium";
  flight: string;
  hotel: string;
  regime: string;
  transfers: string;
  insurance: string;
  priceUsd: number;
  installments: string;
  included: boolean;
}

export interface QuoteDraft {
  quoteId: string;
  marginPct: number;
  validUntil: string;
  conditions: string;
  options: QuoteOptionDraft[];
  tracking?: { sentAt: string; opens: number; clicks: number; nextAction: string };
}

export const quoteDrafts: QuoteDraft[] = [
  {
    quoteId: "Q-2026-0216",
    marginPct: 12,
    validUntil: "2026-07-18",
    conditions: "Precios por persona en base doble, sujetos a disponibilidad al confirmar. Tarifa aérea garantizada por 48 h.",
    options: [
      { tier: "económica", flight: "AR 1870 Rosario - El Calafate (1 escala)", hotel: "Hostería Los Ñires 3★", regime: "Desayuno", transfers: "Regulares compartidos", insurance: "Cobertura USD 60.000", priceUsd: 1490, installments: "6 cuotas", included: true },
      { tier: "recomendada", flight: "AR 1854 directo Rosario - El Calafate", hotel: "Hotel Mirador del Lago 4★", regime: "Media pensión", transfers: "Regulares compartidos", insurance: "Cobertura USD 150.000", priceUsd: 1890, installments: "6 cuotas", included: true },
      { tier: "premium", flight: "AR 1854 directo + AR 1880 a Ushuaia", hotel: "Los Cauquenes Resort & Spa 5★", regime: "Media pensión", transfers: "Privados", insurance: "Premium USD 300.000 + cancelación", priceUsd: 2740, installments: "3 cuotas", included: true },
    ],
    tracking: { sentAt: "2026-07-11", opens: 4, clicks: 2, nextAction: "Llamar el 17/7 si no responde (vence el 18/7)" },
  },
  {
    quoteId: "Q-2026-0217",
    marginPct: 10,
    validUntil: "2026-07-22",
    conditions: "Entradas a parques con precio de temporada alta enero. Requiere visa americana vigente para los 4 pasajeros.",
    options: [
      { tier: "económica", flight: "CM 280 vía Panamá", hotel: "Hotel zona Disney Springs 3★", regime: "Solo alojamiento", transfers: "Shuttle del hotel", insurance: "Cobertura USD 150.000", priceUsd: 2290, installments: "12 cuotas", included: true },
      { tier: "recomendada", flight: "AA 900 vía Miami", hotel: "Disney All-Star Resort", regime: "Desayuno", transfers: "Disney transport incluido", insurance: "Cobertura USD 150.000", priceUsd: 2980, installments: "12 cuotas", included: true },
      { tier: "premium", flight: "AA 900 vía Miami (Premium Economy)", hotel: "Disney Caribbean Beach", regime: "Plan de comidas Disney", transfers: "Privados + Disney transport", insurance: "Premium USD 300.000", priceUsd: 3890, installments: "6 cuotas", included: false },
    ],
    tracking: { sentAt: "2026-07-13", opens: 2, clicks: 1, nextAction: "Cliente pidió ajustar fechas a la segunda quincena de enero" },
  },
  {
    quoteId: "Q-2026-0215",
    marginPct: 11,
    validUntil: "2026-07-20",
    conditions: "Incluye gestión de turnos para trámite de ciudadanía en Calabria (2 medias jornadas libres en el itinerario).",
    options: [
      { tier: "económica", flight: "ITA vía Roma (equipaje 23 kg)", hotel: "Hoteles 3★ céntricos", regime: "Desayuno", transfers: "Tren regional + regulares", insurance: "Cobertura USD 150.000", priceUsd: 2680, installments: "6 cuotas", included: true },
      { tier: "recomendada", flight: "ITA vía Roma (equipaje 23 kg)", hotel: "Hoteles 4★ céntricos", regime: "Desayuno", transfers: "Privados en Calabria", insurance: "Cobertura USD 150.000", priceUsd: 3240, installments: "6 cuotas", included: true },
      { tier: "premium", flight: "ITA Business vía Roma", hotel: "Boutique 4★ sup. + agriturismo", regime: "Media pensión", transfers: "Privados todo el circuito", insurance: "Premium USD 300.000 + cancelación", priceUsd: 5150, installments: "3 cuotas", included: false },
    ],
  },
];

/* ── Finance ─────────────────────────────────────────────────────── */

export interface CashMovement {
  id: string;
  date: string;
  concept: string;
  kind: "ingreso" | "egreso";
  amount: number;
  currency: "USD" | "ARS";
  category: "cobranza" | "proveedores" | "comisiones" | "impuestos" | "devoluciones" | "gastos";
}

export const financeSummary = {
  month: "Julio 2026",
  usd: { income: 21850, expenses: 14320, costs: 12480, margin: 3390, commissions: 546, refunds: 343, taxes: 1180 },
  ars: { income: 3763200, expenses: 1240000, costs: 980000, margin: 610000, commissions: 94000, refunds: 0, taxes: 402000 },
  providerBalances: [
    { provider: "Andes Operador Mayorista", balanceUsd: -8420, due: "2026-07-28", note: "Caribe septiembre (2 reservas)" },
    { provider: "Patagonia Receptivo SRL", balanceUsd: -1960, due: "2026-07-20", note: "Bariloche julio y agosto" },
    { provider: "Bávaro Hotels Group", balanceUsd: -3150, due: "2026-08-05", note: "Cupos Punta Cana" },
    { provider: "Assist Total", balanceUsd: -410, due: "2026-07-31", note: "Pólizas junio y julio" },
    { provider: "Aerolíneas Argentinas", balanceUsd: 0, due: "", note: "BSP al día" },
  ],
};

export const cashMovements: CashMovement[] = [
  { id: "M-118", date: "2026-07-12", concept: "Seña Ambrosini (link de pago)", kind: "ingreso", amount: 676, currency: "USD", category: "cobranza" },
  { id: "M-117", date: "2026-07-11", concept: "Pago Assist Total pólizas junio", kind: "egreso", amount: 410, currency: "USD", category: "proveedores" },
  { id: "M-116", date: "2026-07-10", concept: "Comisión Mercado Pago junio", kind: "egreso", amount: 187, currency: "USD", category: "comisiones" },
  { id: "M-115", date: "2026-07-08", concept: "Transferencia Scarpetta (en verificación)", kind: "ingreso", amount: 5580, currency: "USD", category: "cobranza" },
  { id: "M-114", date: "2026-07-05", concept: "Emisión aéreos Benedetti (BSP)", kind: "egreso", amount: 560, currency: "USD", category: "proveedores" },
  { id: "M-113", date: "2026-07-03", concept: "Pago en oficina Bonfiglio", kind: "ingreso", amount: 955200, currency: "ARS", category: "cobranza" },
  { id: "M-112", date: "2026-07-02", concept: "Percepciones AFIP junio", kind: "egreso", amount: 402000, currency: "ARS", category: "impuestos" },
  { id: "M-111", date: "2026-06-30", concept: "Anticipo Patagonia Receptivo (Bariloche agosto)", kind: "egreso", amount: 1960, currency: "USD", category: "proveedores" },
  { id: "M-110", date: "2026-06-28", concept: "Pago total Bertoldi (Mercado Pago)", kind: "ingreso", amount: 2498, currency: "USD", category: "cobranza" },
  { id: "M-109", date: "2026-06-26", concept: "Seña Scaglia (transferencia)", kind: "ingreso", amount: 1556, currency: "USD", category: "cobranza" },
  { id: "M-108", date: "2026-06-23", concept: "Alquiler y servicios oficina Funes", kind: "egreso", amount: 838000, currency: "ARS", category: "gastos" },
  { id: "M-107", date: "2026-06-21", concept: "Devolución seña Depetris", kind: "egreso", amount: 343, currency: "USD", category: "devoluciones" },
];
