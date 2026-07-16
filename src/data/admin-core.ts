import type {
  ActivityEvent,
  AdminNotification,
  AdminRole,
  AdminTask,
  Branch,
  CategoryPerformance,
  CommercialMetric,
  FunnelStage,
  UpcomingDeparture,
} from "@/lib/admin-types";

/**
 * Core demo data for the backoffice shell and dashboard.
 * DEMO — replace with real backend data before production.
 */

export const branches: Branch[] = [
  { id: "funes", name: "Funes · Casa central" },
  { id: "rosario", name: "Rosario · Punto de venta" },
];

export const adminTasks: AdminTask[] = [
  { id: "t-01", title: "Pago vencido de la reserva FT-2026-1031", detail: "Colegio San Roque: el segundo pago venció el 20/7. Falta autorización de 3 menores.", category: "pagos", priority: "alta", assignee: "Sofía Gachet", dueDate: "2026-07-16", relatedHref: "/admin/reservas" },
  { id: "t-02", title: "Documentación pendiente de la familia Scaglia", detail: "Rubén y Marta viajan a Punta Cana el 12/9 y falta el escaneo de pasaportes.", category: "documentacion", priority: "alta", assignee: "Marcela Buttini", dueDate: "2026-07-17", relatedHref: "/admin/documentacion" },
  { id: "t-03", title: "Confirmar bloqueo con Vista Bávaro Resort", detail: "El operador aún no confirmó las 6 habitaciones de la salida del 12/9.", category: "proveedores", priority: "alta", assignee: "Diego Anselmi", dueDate: "2026-07-16", relatedHref: "/admin/proveedores" },
  { id: "t-04", title: "Cotización Q-8841 vence mañana", detail: "Europa clásica para 4 pasajeros. La clienta pidió extender la vigencia.", category: "cotizaciones", priority: "media", assignee: "Sofía Gachet", dueDate: "2026-07-17", relatedHref: "/admin/cotizaciones" },
  { id: "t-05", title: "3 consultas de WhatsApp sin responder", detail: "Dos por Bariloche agosto y una por luna de miel en Grecia, llegaron ayer.", category: "mensajes", priority: "alta", assignee: "Marcela Buttini", dueDate: "2026-07-16", relatedHref: "/admin/consultas" },
  { id: "t-06", title: "Cupos bajos: Europa clásica 8/9", detail: "Quedan 6 lugares y hay 9 cotizaciones abiertas sobre esa salida.", category: "cupos", priority: "media", assignee: "Diego Anselmi", dueDate: "2026-07-18", relatedHref: "/admin/disponibilidad" },
  { id: "t-07", title: "Promoción 'Caribe en cuotas' termina el 31/8", detail: "Definir si se extiende o se reemplaza por la promo de compra anticipada de verano.", category: "promociones", priority: "baja", assignee: "Sofía Gachet", dueDate: "2026-07-22", relatedHref: "/admin/promociones" },
  { id: "t-08", title: "Pasajero con pasaporte vencido en reserva FT-2026-1038", detail: "El pasaporte de A. Morelli vence en agosto y el viaje a Cancún es en octubre.", category: "pasajeros", priority: "alta", assignee: "Marcela Buttini", dueDate: "2026-07-17", relatedHref: "/admin/pasajeros" },
  { id: "t-09", title: "Reclamo abierto: demora de valija (RJ enero)", detail: "Seguimiento del reintegro de la asistencia para Julián Ferreyra.", category: "reclamos", priority: "media", assignee: "Diego Anselmi", dueDate: "2026-07-20", relatedHref: "/admin/tickets" },
  { id: "t-10", title: "Reserva sin confirmar hace 5 días", detail: "FT-2026-1042 (Mendoza sept.) espera confirmación de bodega para el almuerzo.", category: "reservas", priority: "media", assignee: "Sofía Gachet", dueDate: "2026-07-18", relatedHref: "/admin/reservas" },
];

export const commercialMetrics: CommercialMetric[] = [
  { id: "ventas-hoy", label: "Ventas de hoy", value: "USD 4.320", delta: 12, context: "3 reservas nuevas", href: "/admin/ventas" },
  { id: "ventas-mes", label: "Ventas del mes", value: "USD 48.620", delta: 9, context: "vs. junio", href: "/admin/ventas" },
  { id: "margen", label: "Margen estimado", value: "USD 7.480", delta: 6, context: "15,4% promedio", href: "/admin/finanzas" },
  { id: "reservas", label: "Reservas nuevas", value: "14", delta: 17, context: "en los últimos 30 días", href: "/admin/reservas" },
  { id: "cotizaciones", label: "Cotizaciones enviadas", value: "23", delta: -8, context: "9 siguen abiertas", href: "/admin/cotizaciones" },
  { id: "pagos", label: "Pagos pendientes", value: "USD 19.850", delta: 0, context: "3 reservas esperan pago", href: "/admin/pagos" },
  { id: "conversion", label: "Conversión", value: "23,4%", delta: 3, context: "consulta → reserva", href: "/admin/reportes" },
  { id: "ticket", label: "Ticket promedio", value: "USD 3.473", delta: 5, context: "por reserva", href: "/admin/reportes" },
];

export const funnel: FunnelStage[] = [
  { id: "consulta", label: "Consultas", count: 96, valueUsd: 0, avgDays: 0 },
  { id: "cotizacion", label: "Cotizaciones", count: 41, valueUsd: 148000, avgDays: 1.2 },
  { id: "enviada", label: "Propuestas enviadas", count: 23, valueUsd: 97000, avgDays: 2.4 },
  { id: "aceptada", label: "Aceptadas", count: 17, valueUsd: 63400, avgDays: 3.8 },
  { id: "pago", label: "Pago iniciado", count: 15, valueUsd: 55900, avgDays: 1.1 },
  { id: "confirmada", label: "Confirmadas", count: 14, valueUsd: 48620, avgDays: 0.8 },
];

export const upcomingDepartures: UpcomingDeparture[] = [
  { date: "2026-07-25", packageName: "Bariloche a la nieve", packageSlug: "bariloche-invierno-5-noches", passengers: 36, seatsLeft: 4, coordinator: "Diego Anselmi", docsPending: 2, paymentsPending: 1, alert: "1 pago vence el 18/7" },
  { date: "2026-08-08", packageName: "Bariloche a la nieve", packageSlug: "bariloche-invierno-5-noches", passengers: 30, seatsLeft: 10, coordinator: "Diego Anselmi", docsPending: 5, paymentsPending: 2 },
  { date: "2026-08-14", packageName: "Escapada a Iguazú", packageSlug: "iguazu-escapada-3-noches", passengers: 10, seatsLeft: 6, coordinator: "Sin asignar", docsPending: 0, paymentsPending: 1 },
  { date: "2026-08-15", packageName: "Norte argentino esencial", packageSlug: "salta-jujuy-5-noches", passengers: 8, seatsLeft: 8, coordinator: "Marcela Buttini", docsPending: 1, paymentsPending: 0 },
  { date: "2026-09-08", packageName: "Europa clásica (grupal)", packageSlug: "europa-clasica-14-noches", passengers: 22, seatsLeft: 6, coordinator: "Marcela Buttini", docsPending: 7, paymentsPending: 3, alert: "Cupos bajos con 9 cotizaciones abiertas" },
  { date: "2026-09-12", packageName: "Punta Cana esencial", packageSlug: "punta-cana-7-noches-all-inclusive", passengers: 12, seatsLeft: 8, coordinator: "Sin asignar", docsPending: 3, paymentsPending: 1 },
];

export const recentActivity: ActivityEvent[] = [
  { id: "a-01", time: "hace 20 min", actor: "Web", action: "creó la reserva", target: "FT-2026-1043 · Río de Janeiro", kind: "reserva", href: "/admin/reservas" },
  { id: "a-02", time: "hace 1 h", actor: "Sofía Gachet", action: "registró un pago de USD 1.200 en", target: "FT-2026-1036", kind: "pago", href: "/admin/pagos" },
  { id: "a-03", time: "hace 2 h", actor: "Marcela Buttini", action: "envió la propuesta", target: "Q-8846 · Turquía para dos", kind: "estado", href: "/admin/cotizaciones" },
  { id: "a-04", time: "hace 3 h", actor: "Diego Anselmi", action: "actualizó el precio de", target: "Bariloche a la nieve · salida 22/8", kind: "precio", href: "/admin/tarifas" },
  { id: "a-05", time: "ayer", actor: "Web", action: "recibió una consulta por", target: "Luna de miel en Grecia", kind: "mensaje", href: "/admin/consultas" },
  { id: "a-06", time: "ayer", actor: "Sofía Gachet", action: "publicó la promoción", target: "Verano 2027: compra anticipada", kind: "promocion", href: "/admin/promociones" },
  { id: "a-07", time: "ayer", actor: "Marcela Buttini", action: "aprobó la documentación de", target: "Familia Maldonado Ruiz", kind: "archivo", href: "/admin/documentacion" },
  { id: "a-08", time: "hace 2 días", actor: "Web", action: "creó el cliente", target: "Andrea Ceccarelli", kind: "cliente", href: "/admin/clientes" },
];

export const categoryPerformance: CategoryPerformance[] = [
  { category: "Paquetes", salesUsd: 38200, marginPct: 15.8, conversionPct: 26, inquiries: 64, cancellations: 2 },
  { category: "Hoteles", salesUsd: 4600, marginPct: 12.1, conversionPct: 18, inquiries: 21, cancellations: 1 },
  { category: "Vuelos", salesUsd: 3100, marginPct: 6.4, conversionPct: 31, inquiries: 18, cancellations: 0 },
  { category: "Excursiones", salesUsd: 1500, marginPct: 22.0, conversionPct: 40, inquiries: 9, cancellations: 0 },
  { category: "Seguros", salesUsd: 820, marginPct: 35.0, conversionPct: 55, inquiries: 6, cancellations: 0 },
  { category: "Traslados", salesUsd: 400, marginPct: 18.0, conversionPct: 44, inquiries: 4, cancellations: 0 },
];

export const adminNotifications: AdminNotification[] = [
  { id: "n-01", time: "hace 15 min", title: "Nueva consulta web", detail: "Familia busca Disney para enero de 2027.", kind: "consulta", read: false, href: "/admin/consultas" },
  { id: "n-02", time: "hace 40 min", title: "Pago aprobado", detail: "USD 1.200 de Pablo Sarraceno (FT-2026-1036).", kind: "pago", read: false, href: "/admin/pagos" },
  { id: "n-03", time: "hace 2 h", title: "Pago rechazado", detail: "Tarjeta rechazada en FT-2026-1040. El cliente fue notificado.", kind: "pago-rechazado", read: false, href: "/admin/pagos" },
  { id: "n-04", time: "hace 3 h", title: "Cupos bajos", detail: "Europa clásica 8/9: quedan 6 lugares.", kind: "cupos", read: true, href: "/admin/disponibilidad" },
  { id: "n-05", time: "ayer", title: "Cotización por vencer", detail: "Q-8841 vence mañana sin respuesta del cliente.", kind: "cotizacion", read: true, href: "/admin/cotizaciones" },
  { id: "n-06", time: "ayer", title: "Documentación cargada", detail: "La familia Scaglia subió 2 pasaportes para revisar.", kind: "documentacion", read: true, href: "/admin/documentacion" },
  { id: "n-07", time: "hace 2 días", title: "Proveedor sin respuesta", detail: "Vista Bávaro no confirmó el bloqueo de septiembre.", kind: "proveedor", read: true, href: "/admin/proveedores" },
];

export const adminRoles: AdminRole[] = [
  { id: "superadmin", name: "Superadministrador", description: "Acceso completo, incluida la auditoría y la gestión de usuarios.", permissions: ["ver", "crear", "editar", "aprobar", "publicar", "cancelar", "eliminar", "exportar", "ver-costos", "ver-margenes", "registrar-pagos", "gestionar-usuarios", "ver-auditoria"] },
  { id: "admin", name: "Administrador", description: "Gestión total de la operación sin administración de usuarios.", permissions: ["ver", "crear", "editar", "aprobar", "publicar", "cancelar", "exportar", "ver-costos", "ver-margenes", "registrar-pagos", "ver-auditoria"] },
  { id: "gerencia", name: "Gerencia", description: "Visión completa del negocio con foco en reportes y aprobaciones.", permissions: ["ver", "aprobar", "exportar", "ver-costos", "ver-margenes", "ver-auditoria"] },
  { id: "ventas", name: "Ventas", description: "Cotizaciones, clientes y reservas. No ve costos ni márgenes.", permissions: ["ver", "crear", "editar", "exportar"] },
  { id: "reservas", name: "Reservas", description: "Operación de reservas, pasajeros y documentación.", permissions: ["ver", "crear", "editar", "cancelar"] },
  { id: "finanzas", name: "Finanzas", description: "Pagos, devoluciones, conciliación y reportes financieros.", permissions: ["ver", "exportar", "ver-costos", "ver-margenes", "registrar-pagos"] },
  { id: "marketing", name: "Marketing", description: "Promociones, cupones, contenido y SEO.", permissions: ["ver", "crear", "editar", "publicar"] },
  { id: "contenido", name: "Editor de contenido", description: "Textos, medios, blog y editor de la home.", permissions: ["ver", "crear", "editar", "publicar"] },
  { id: "atencion", name: "Atención al cliente", description: "Consultas, mensajes, tickets y seguimiento.", permissions: ["ver", "crear", "editar"] },
  { id: "coordinador", name: "Coordinador", description: "Salidas asignadas, pasajeros y documentación de sus grupos.", permissions: ["ver", "editar"] },
  { id: "proveedor", name: "Proveedor externo", description: "Solo sus productos, tarifas y confirmaciones.", permissions: ["ver"] },
  { id: "lectura", name: "Solo lectura", description: "Consulta de información sin ninguna acción de escritura.", permissions: ["ver"] },
];

export const salesByMonth = [
  { month: "Feb", valueK: 31 },
  { month: "Mar", valueK: 39 },
  { month: "Abr", valueK: 27 },
  { month: "May", valueK: 42 },
  { month: "Jun", valueK: 52 },
  { month: "Jul", valueK: 49 },
];

export const topDestinations = [
  { name: "Bariloche", bookings: 21, trend: "estable" as const },
  { name: "Punta Cana", bookings: 14, trend: "sube" as const },
  { name: "Río de Janeiro", bookings: 11, trend: "sube" as const },
  { name: "Europa clásica", bookings: 8, trend: "estable" as const },
  { name: "Cataratas del Iguazú", bookings: 7, trend: "baja" as const },
];
