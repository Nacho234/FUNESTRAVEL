"use client";

import { ArrowRightIcon, LockKeyIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import { auditLog, type AuditEntry } from "@/data/admin-system";
import { DataTable, EmptyState, PageHeader, type Column, type FilterDef } from "@/components/admin/ui";
import { usePermissions } from "./use-permissions";

/** Immutable audit trail, gated by the ver-auditoria permission. */

export function AuditAdmin() {
  const { can, role } = usePermissions();

  if (!can("ver-auditoria")) {
    return (
      <div className="mx-auto max-w-[900px]">
        <PageHeader title="Auditoría" breadcrumb={[{ label: "Auditoría" }]} />
        <EmptyState
          icon={<LockKeyIcon className="size-5" aria-hidden />}
          title="Sin permisos para ver la auditoría"
          detail={`Tu rol actual (${role?.name ?? "sin rol"}) no incluye el permiso “ver auditoría”. Pedile acceso a un superadministrador. Los permisos reales se validan en el servidor.`}
        />
      </div>
    );
  }

  const columns: Column<AuditEntry>[] = [
    { id: "at", header: "Fecha y hora", essential: true, cell: (e) => <span className="whitespace-nowrap text-xs tabular">{e.at}</span>, sortValue: (e) => e.at },
    { id: "user", header: "Usuario", essential: true, cell: (e) => <span className="font-semibold text-graphite-800">{e.user}</span>, sortValue: (e) => e.user },
    { id: "action", header: "Acción", essential: true, cell: (e) => e.action, sortValue: (e) => e.action },
    { id: "module", header: "Módulo", cell: (e) => e.module, sortValue: (e) => e.module },
    { id: "record", header: "Registro", cell: (e) => <span className="text-xs text-graphite-600">{e.record}</span> },
    {
      id: "change",
      header: "Cambio",
      cell: (e) =>
        e.before && e.after ? (
          <span className="inline-flex items-center gap-1 text-xs">
            <span className="text-graphite-500">{e.before}</span>
            <ArrowRightIcon className="size-3 text-graphite-400" aria-hidden />
            <span className="font-semibold text-graphite-800">{e.after}</span>
          </span>
        ) : (
          <span className="text-xs text-graphite-400">—</span>
        ),
    },
    { id: "ip", header: "IP", cell: (e) => <span className="font-mono text-[0.6875rem] text-graphite-500">{e.ip}</span> },
    { id: "device", header: "Dispositivo", cell: (e) => <span className="text-xs text-graphite-500">{e.device}</span> },
  ];

  const filters: FilterDef<AuditEntry>[] = [
    { id: "user", label: "Usuario", options: [...new Set(auditLog.map((e) => e.user))], matches: (e, v) => e.user === v },
    { id: "module", label: "Módulo", options: [...new Set(auditLog.map((e) => e.module))], matches: (e, v) => e.module === v },
    {
      id: "range",
      label: "Rango",
      options: ["hoy", "últimos 3 días", "últimos 7 días"],
      matches: (e, v) => {
        const day = e.at.slice(0, 10);
        if (v === "hoy") return day === "2026-07-16";
        if (v === "últimos 3 días") return day >= "2026-07-14";
        return day >= "2026-07-10";
      },
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Auditoría"
        description="Historial completo de acciones del equipo sobre registros del sistema."
        breadcrumb={[{ label: "Auditoría" }]}
      />

      <div className="mb-4 flex items-start gap-2 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3 text-sm text-graphite-700">
        <ShieldCheckIcon className="mt-0.5 size-4.5 shrink-0 text-teal-600" aria-hidden />
        <p>Los registros de auditoría no pueden eliminarse ni editarse desde la interfaz.</p>
      </div>

      <DataTable
        rows={auditLog}
        columns={columns}
        rowKey={(e) => e.id}
        searchKeys={(e) => `${e.user} ${e.action} ${e.module} ${e.record}`}
        searchPlaceholder="Buscar en la auditoría…"
        filters={filters}
        exportName="auditoria"
        pageSize={12}
        emptyTitle="Sin registros"
        emptyDetail="No hay actividad con esos criterios."
      />
    </div>
  );
}
