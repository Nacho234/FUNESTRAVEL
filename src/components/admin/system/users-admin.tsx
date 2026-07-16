"use client";

import Image from "next/image";
import { useState } from "react";
import { adminRoles } from "@/data/admin-core";
import { adminUsers, type AdminUser } from "@/data/admin-system";
import {
  AdminButton,
  DataTable,
  Drawer,
  KVGrid,
  PageHeader,
  useToast,
  type Column,
  type FilterDef,
} from "@/components/admin/ui";
import { usePermissions } from "./use-permissions";

/** Internal users: profile, role changes and lifecycle, permission-gated. */

const statusTone: Record<AdminUser["status"], string> = {
  activo: "bg-positive-100 text-positive-700",
  invitado: "bg-teal-50 text-teal-600",
  suspendido: "bg-danger-100 text-danger-700",
};

function UserStatus({ status }: { status: AdminUser["status"] }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusTone[status]}`}>{status}</span>;
}

export function UsersAdmin() {
  const [rows, setRows] = useState<AdminUser[]>(adminUsers);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [inviting, setInviting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { can } = usePermissions();
  const { showToast, toastNode } = useToast();

  const canManage = can("gestionar-usuarios");
  const gateTitle = canManage ? undefined : "Tu rol no tiene permiso para gestionar usuarios";

  const update = (id: string, p: Partial<AdminUser>) => {
    setRows((rs) => rs.map((u) => (u.id === id ? { ...u, ...p } : u)));
    setSelected((s) => (s && s.id === id ? { ...s, ...p } : s));
  };

  const roleName = (id: AdminUser["role"]) => adminRoles.find((r) => r.id === id)?.name ?? id;

  const columns: Column<AdminUser>[] = [
    {
      id: "name",
      header: "Usuario",
      essential: true,
      cell: (u) => (
        <div className="flex items-center gap-2.5">
          <Image src={`https://i.pravatar.cc/64?img=${u.avatarId}`} alt="" width={28} height={28} className="rounded-full" />
          <div>
            <p className="font-semibold text-graphite-800">{u.name}</p>
            <p className="text-xs text-graphite-500">{u.email}</p>
          </div>
        </div>
      ),
      sortValue: (u) => u.name,
    },
    { id: "role", header: "Rol", essential: true, cell: (u) => roleName(u.role), sortValue: (u) => u.role },
    { id: "branch", header: "Sucursal", cell: (u) => <span className="text-xs text-graphite-600">{u.branch}</span>, sortValue: (u) => u.branch },
    { id: "status", header: "Estado", essential: true, cell: (u) => <UserStatus status={u.status} />, sortValue: (u) => u.status },
    { id: "last", header: "Última sesión", cell: (u) => <span className="text-xs tabular">{u.lastSession}</span> },
    {
      id: "sales",
      header: "Ventas mes",
      align: "right",
      cell: (u) => <span className="tabular">{u.monthSalesUsd > 0 ? `USD ${u.monthSalesUsd.toLocaleString("es-AR")}` : "—"}</span>,
      sortValue: (u) => u.monthSalesUsd,
    },
  ];

  const filters: FilterDef<AdminUser>[] = [
    { id: "estado", label: "Estado", options: ["activo", "invitado", "suspendido"], matches: (u, v) => u.status === v },
    { id: "rol", label: "Rol", options: adminRoles.map((r) => r.name), matches: (u, v) => roleName(u.role) === v },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Usuarios internos"
        description="El equipo con acceso al panel, sus roles y su actividad."
        breadcrumb={[{ label: "Usuarios" }]}
        actions={
          <AdminButton onClick={() => setInviting(true)} disabled={!canManage} title={gateTitle}>
            Invitar usuario
          </AdminButton>
        }
      />

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(u) => u.id}
        searchKeys={(u) => `${u.name} ${u.email} ${u.branch}`}
        searchPlaceholder="Buscar usuarios…"
        filters={filters}
        exportName="usuarios"
        onRowClick={(u) => {
          setSelected({ ...u });
          setConfirming(false);
        }}
        emptyTitle="Sin usuarios"
        emptyDetail="Invitá a alguien del equipo para empezar."
      />

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? ""}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Image src={`https://i.pravatar.cc/96?img=${selected.avatarId}`} alt="" width={52} height={52} className="rounded-full" />
              <div>
                <p className="font-display text-lg font-bold text-petrol-900">{selected.name}</p>
                <UserStatus status={selected.status} />
              </div>
            </div>
            <KVGrid
              items={[
                { label: "Correo", value: selected.email },
                { label: "Teléfono", value: selected.phone },
                { label: "Sucursal", value: selected.branch },
                { label: "Última sesión", value: selected.lastSession },
                { label: "Ventas del mes", value: selected.monthSalesUsd > 0 ? `USD ${selected.monthSalesUsd.toLocaleString("es-AR")}` : "Sin ventas" },
                { label: "Tareas asignadas", value: selected.name === "Sofía Gachet" ? 4 : selected.name === "Marcela Buttini" ? 3 : 2 },
              ]}
            />
            <div>
              <label htmlFor="user-role" className="mb-1 block text-sm font-semibold text-graphite-800">
                Rol
              </label>
              <select
                id="user-role"
                value={selected.role}
                disabled={!canManage}
                title={gateTitle}
                onChange={(e) => {
                  update(selected.id, { role: e.target.value as AdminUser["role"] });
                  showToast("Rol actualizado");
                }}
                className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none disabled:opacity-50"
              >
                {adminRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs leading-snug text-graphite-500">
                {adminRoles.find((r) => r.id === selected.role)?.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-dashed border-sand-200 pt-4">
              {selected.status === "invitado" && (
                <AdminButton variant="secondary" disabled={!canManage} title={gateTitle} onClick={() => showToast("Invitación reenviada")}>
                  Reenviar invitación
                </AdminButton>
              )}
              {selected.status !== "suspendido" ? (
                !confirming ? (
                  <AdminButton variant="danger" disabled={!canManage} title={gateTitle} onClick={() => setConfirming(true)}>
                    Suspender
                  </AdminButton>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg bg-danger-100/60 px-3 py-2 text-xs text-danger-700">
                    ¿Suspender el acceso de {selected.name}?
                    <AdminButton
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        update(selected.id, { status: "suspendido" });
                        setConfirming(false);
                        showToast("Usuario suspendido");
                      }}
                    >
                      Sí
                    </AdminButton>
                    <AdminButton size="sm" variant="ghost" onClick={() => setConfirming(false)}>
                      No
                    </AdminButton>
                  </div>
                )
              ) : (
                <AdminButton
                  variant="secondary"
                  disabled={!canManage}
                  title={gateTitle}
                  onClick={() => {
                    update(selected.id, { status: "activo" });
                    showToast("Usuario reactivado");
                  }}
                >
                  Reactivar
                </AdminButton>
              )}
            </div>
            {!canManage && (
              <p className="rounded-lg bg-sand-50 px-3 py-2 text-xs text-graphite-500">
                Tu rol actual no tiene el permiso “gestionar usuarios”. Los permisos reales se validan en el
                servidor.
              </p>
            )}
          </div>
        )}
      </Drawer>

      {/* Invite drawer */}
      <Drawer open={inviting} onClose={() => setInviting(false)} title="Invitar usuario">
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-graphite-800">Correo</span>
            <input id="invite-email" type="email" placeholder="nombre@funestravel.com.ar" className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-graphite-800">Rol</span>
            <select id="invite-role" className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none">
              {adminRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <AdminButton
            onClick={() => {
              const email = (document.getElementById("invite-email") as HTMLInputElement)?.value.trim();
              const role = (document.getElementById("invite-role") as HTMLSelectElement)?.value as AdminUser["role"];
              if (!email.includes("@")) {
                showToast("Ingresá un correo válido");
                return;
              }
              setRows((rs) => [
                { id: `u-${Date.now().toString(36)}`, name: email.split("@")[0], email, phone: "", branch: "Funes · Casa central", role, status: "invitado", lastSession: "nunca", monthSalesUsd: 0, avatarId: 5 },
                ...rs,
              ]);
              setInviting(false);
              showToast("Invitación enviada (demo)");
            }}
          >
            Enviar invitación
          </AdminButton>
        </div>
      </Drawer>
    </div>
  );
}
