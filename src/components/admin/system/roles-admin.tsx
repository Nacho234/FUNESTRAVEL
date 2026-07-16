"use client";

import { useState } from "react";
import { CheckIcon, ShieldCheckIcon, XIcon } from "@phosphor-icons/react";
import { adminRoles } from "@/data/admin-core";
import type { AdminPermission, AdminRole } from "@/lib/admin-types";
import { Drawer, PageHeader, SectionCard, useToast } from "@/components/admin/ui";

/** Role × permission matrix with a per-role detail drawer. */

const allPermissions: { id: AdminPermission; label: string }[] = [
  { id: "ver", label: "Ver" },
  { id: "crear", label: "Crear" },
  { id: "editar", label: "Editar" },
  { id: "aprobar", label: "Aprobar" },
  { id: "publicar", label: "Publicar" },
  { id: "cancelar", label: "Cancelar" },
  { id: "eliminar", label: "Eliminar" },
  { id: "exportar", label: "Exportar" },
  { id: "ver-costos", label: "Ver costos" },
  { id: "ver-margenes", label: "Ver márgenes" },
  { id: "registrar-pagos", label: "Registrar pagos" },
  { id: "gestionar-usuarios", label: "Gestionar usuarios" },
  { id: "ver-auditoria", label: "Ver auditoría" },
];

export function RolesAdmin() {
  const [selected, setSelected] = useState<AdminRole | null>(null);
  const [overrides, setOverrides] = useState<Record<string, AdminPermission[]>>({});
  const { showToast, toastNode } = useToast();

  const permsOf = (role: AdminRole) => overrides[role.id] ?? role.permissions;

  const togglePermission = (role: AdminRole, p: AdminPermission) => {
    const current = permsOf(role);
    const next = current.includes(p) ? current.filter((x) => x !== p) : [...current, p];
    setOverrides((o) => ({ ...o, [role.id]: next }));
    showToast("En producción esto se valida en el servidor");
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Roles y permisos"
        description="Qué puede hacer cada rol dentro del panel. Los permisos granulares se aplican en cada módulo."
        breadcrumb={[{ label: "Roles y permisos" }]}
      />

      <div className="overflow-x-auto rounded-xl border border-graphite-200/70 bg-white">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-graphite-100 bg-sand-50/50 text-left">
              <th className="sticky left-0 z-10 bg-sand-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-graphite-500">
                Rol
              </th>
              {allPermissions.map((p) => (
                <th key={p.id} className="px-2 py-2.5 text-center text-[0.625rem] font-bold uppercase tracking-wide text-graphite-500">
                  {p.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-graphite-100">
            {adminRoles.map((role) => {
              const perms = permsOf(role);
              return (
                <tr key={role.id} className="hover:bg-petrol-50/30">
                  <td className="sticky left-0 z-10 bg-white px-4 py-2.5">
                    <button onClick={() => setSelected(role)} className="text-left cursor-pointer group">
                      <p className="font-semibold text-graphite-800 group-hover:text-petrol-800">{role.name}</p>
                      <p className="max-w-[180px] truncate text-[0.6875rem] text-graphite-400">{role.description}</p>
                    </button>
                  </td>
                  {allPermissions.map((p) => (
                    <td key={p.id} className="px-2 py-2.5 text-center">
                      {perms.includes(p.id) ? (
                        <CheckIcon weight="bold" className="mx-auto size-4 text-positive-700" aria-label={`${role.name}: ${p.label} permitido`} />
                      ) : (
                        <XIcon className="mx-auto size-3.5 text-graphite-300" aria-label={`${role.name}: ${p.label} no permitido`} />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <SectionCard className="mt-4" title="Seguridad">
        <p className="flex items-start gap-2 text-sm leading-relaxed text-graphite-600">
          <ShieldCheckIcon className="mt-0.5 size-4.5 shrink-0 text-teal-600" aria-hidden />
          Esta matriz es la referencia del equipo. Los permisos nunca se validan solo en el navegador: cada
          acción crítica (pagos, precios, usuarios, auditoría) se verifica también en el servidor antes de
          ejecutarse.
        </p>
      </SectionCard>

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? ""}>
        {selected && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-graphite-600">{selected.description}</p>
            <ul className="divide-y divide-graphite-100">
              {allPermissions.map((p) => {
                const on = permsOf(selected).includes(p.id);
                return (
                  <li key={p.id} className="flex items-center justify-between py-2.5">
                    <span className="text-sm font-medium text-graphite-800">{p.label}</span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" checked={on} onChange={() => togglePermission(selected, p.id)} className="peer sr-only" />
                      <span className="h-5 w-9 rounded-full bg-graphite-200 transition-colors peer-checked:bg-teal-500" />
                      <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
                    </label>
                  </li>
                );
              })}
            </ul>
            <p className="rounded-lg bg-sand-50 px-3 py-2 text-xs text-graphite-500">
              Cambios demo: en producción, editar un rol requiere permiso de superadministrador y queda
              registrado en la auditoría.
            </p>
          </div>
        )}
      </Drawer>
    </div>
  );
}
