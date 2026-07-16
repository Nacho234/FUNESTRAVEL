/** Shared types for the Funes Travel backoffice. */

export type TaskPriority = "alta" | "media" | "baja";

export interface AdminTask {
  id: string;
  title: string;
  detail: string;
  category:
    | "pagos"
    | "documentacion"
    | "reservas"
    | "proveedores"
    | "cotizaciones"
    | "pasajeros"
    | "mensajes"
    | "promociones"
    | "cupos"
    | "reclamos";
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  relatedHref?: string;
  done?: boolean;
}

export interface FunnelStage {
  id: string;
  label: string;
  count: number;
  valueUsd: number;
  avgDays: number;
}

export interface CommercialMetric {
  id: string;
  label: string;
  value: string;
  delta: number; // % vs previous period
  context: string;
  href: string;
}

export interface UpcomingDeparture {
  date: string;
  packageName: string;
  packageSlug: string;
  passengers: number;
  seatsLeft: number;
  coordinator: string;
  docsPending: number;
  paymentsPending: number;
  alert?: string;
}

export interface ActivityEvent {
  id: string;
  time: string; // relative label, demo
  actor: string;
  action: string;
  target: string;
  href?: string;
  kind: "reserva" | "pago" | "estado" | "promocion" | "cliente" | "archivo" | "mensaje" | "precio";
}

export interface CategoryPerformance {
  category: string;
  salesUsd: number;
  marginPct: number;
  conversionPct: number;
  inquiries: number;
  cancellations: number;
}

export interface AdminNotification {
  id: string;
  time: string;
  title: string;
  detail: string;
  kind:
    | "venta"
    | "consulta"
    | "pago"
    | "pago-rechazado"
    | "reserva"
    | "documentacion"
    | "cupos"
    | "cotizacion"
    | "proveedor"
    | "promocion"
    | "integracion"
    | "usuario";
  read: boolean;
  href?: string;
}

export interface Branch {
  id: string;
  name: string;
}

export type AdminRoleId =
  | "superadmin"
  | "admin"
  | "gerencia"
  | "ventas"
  | "reservas"
  | "finanzas"
  | "marketing"
  | "contenido"
  | "atencion"
  | "coordinador"
  | "proveedor"
  | "lectura";

export type AdminPermission =
  | "ver"
  | "crear"
  | "editar"
  | "aprobar"
  | "publicar"
  | "cancelar"
  | "eliminar"
  | "exportar"
  | "ver-costos"
  | "ver-margenes"
  | "registrar-pagos"
  | "gestionar-usuarios"
  | "ver-auditoria";

export interface AdminRole {
  id: AdminRoleId;
  name: string;
  description: string;
  permissions: AdminPermission[];
}
