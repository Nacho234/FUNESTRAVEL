"use client";

import { useState } from "react";
import { adminCoupons, type AdminCoupon } from "@/data/admin-system";
import {
  AdminButton,
  DataTable,
  Drawer,
  KVGrid,
  PageHeader,
  StatusBadge,
  useToast,
  type Column,
  type FilterDef,
} from "@/components/admin/ui";

/** Coupon manager with per-coupon stats and a full editor drawer. */

export function CouponsAdmin() {
  const [rows, setRows] = useState<AdminCoupon[]>(adminCoupons);
  const [selected, setSelected] = useState<AdminCoupon | null>(null);
  const { showToast, toastNode } = useToast();

  const patch = (p: Partial<AdminCoupon>) => setSelected((s) => (s ? { ...s, ...p } : s));

  const save = () => {
    if (!selected) return;
    setRows((rs) => (rs.some((r) => r.id === selected.id) ? rs.map((r) => (r.id === selected.id ? selected : r)) : [selected, ...rs]));
    showToast("Cupón guardado");
    setSelected(null);
  };

  const columns: Column<AdminCoupon>[] = [
    {
      id: "code",
      header: "Código",
      essential: true,
      cell: (r) => <span className="rounded bg-graphite-100 px-2 py-0.5 font-mono text-xs font-bold text-petrol-900">{r.code}</span>,
      sortValue: (r) => r.code,
    },
    {
      id: "disc",
      header: "Descuento",
      essential: true,
      cell: (r) => (
        <span className="font-semibold tabular">{r.type === "porcentual" ? `${r.discount}%` : `USD ${r.discount}`}</span>
      ),
      sortValue: (r) => r.discount,
    },
    {
      id: "uses",
      header: "Usos",
      cell: (r) => (
        <div className="w-28">
          <div className="flex justify-between text-xs tabular">
            <span>{r.uses}</span>
            <span className="text-graphite-400">/ {r.maxUses}</span>
          </div>
          <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-graphite-100">
            <div className="h-full rounded-full bg-teal-500" style={{ width: `${Math.min(100, (r.uses / r.maxUses) * 100)}%` }} />
          </div>
        </div>
      ),
      sortValue: (r) => r.uses / r.maxUses,
    },
    { id: "applies", header: "Aplica a", cell: (r) => <span className="text-xs text-graphite-600">{r.appliesTo}</span> },
    {
      id: "validez",
      header: "Vigencia",
      cell: (r) => <span className="text-xs tabular">{r.validUntil.split("-").reverse().join("/")}</span>,
      sortValue: (r) => r.validUntil,
    },
    { id: "status", header: "Estado", essential: true, cell: (r) => <StatusBadge status={r.status} />, sortValue: (r) => r.status },
    {
      id: "sales",
      header: "Ventas",
      align: "right",
      cell: (r) => <span className="font-semibold tabular">USD {r.salesUsd.toLocaleString("es-AR")}</span>,
      sortValue: (r) => r.salesUsd,
    },
  ];

  const filters: FilterDef<AdminCoupon>[] = [
    { id: "estado", label: "Estado", options: ["activa", "pausada", "vencida"], matches: (r, v) => r.status === v },
    { id: "tipo", label: "Tipo", options: ["porcentual", "fijo"], matches: (r, v) => r.type === v },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Cupones"
        description="Códigos promocionales con límites de uso, vigencia y seguimiento de ventas."
        breadcrumb={[{ label: "Cupones" }]}
        actions={
          <AdminButton
            onClick={() =>
              setSelected({
                id: `cp-${Date.now().toString(36)}`,
                code: "",
                type: "porcentual",
                discount: 5,
                maxUses: 50,
                uses: 0,
                perCustomer: 1,
                appliesTo: "Todos los productos",
                validFrom: "2026-07-16",
                validUntil: "2026-12-31",
                minAmountUsd: 0,
                combinable: false,
                channels: ["web"],
                status: "activa",
                salesUsd: 0,
              })
            }
          >
            Nuevo cupón
          </AdminButton>
        }
      />

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(r) => r.id}
        searchKeys={(r) => `${r.code} ${r.appliesTo}`}
        searchPlaceholder="Buscar cupones…"
        filters={filters}
        exportName="cupones"
        onRowClick={(r) => setSelected({ ...r })}
        emptyTitle="No hay cupones con esos criterios"
        emptyDetail="Creá un cupón nuevo o ajustá los filtros."
      />

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.code ? `Cupón ${selected.code}` : "Nuevo cupón"}>
        {selected && (
          <div className="space-y-5">
            {/* Stats */}
            {selected.uses > 0 && (
              <KVGrid
                cols={2}
                items={[
                  { label: "Usos", value: `${selected.uses} de ${selected.maxUses}` },
                  { label: "Conversión estimada", value: `${Math.min(96, Math.round((selected.uses / selected.maxUses) * 100) + 22)}%` },
                  { label: "Ingresos generados", value: `USD ${selected.salesUsd.toLocaleString("es-AR")}` },
                  {
                    label: "Costo del descuento",
                    value: `USD ${Math.round(selected.type === "porcentual" ? (selected.salesUsd * selected.discount) / 100 : selected.uses * selected.discount).toLocaleString("es-AR")}`,
                  },
                ]}
              />
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-graphite-800">Código</span>
                <input value={selected.code} onChange={(e) => patch({ code: e.target.value.toUpperCase() })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 font-mono text-sm uppercase focus:border-teal-500 focus:outline-none" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-graphite-800">Tipo</span>
                <select value={selected.type} onChange={(e) => patch({ type: e.target.value as AdminCoupon["type"] })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none">
                  <option value="porcentual">Porcentual</option>
                  <option value="fijo">Monto fijo (USD)</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-graphite-800">Descuento</span>
                <input type="number" value={selected.discount} onChange={(e) => patch({ discount: Number(e.target.value) })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm tabular focus:border-teal-500 focus:outline-none" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-graphite-800">Uso máximo</span>
                <input type="number" value={selected.maxUses} onChange={(e) => patch({ maxUses: Number(e.target.value) })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm tabular focus:border-teal-500 focus:outline-none" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-graphite-800">Usos por cliente</span>
                <input type="number" value={selected.perCustomer} onChange={(e) => patch({ perCustomer: Number(e.target.value) })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm tabular focus:border-teal-500 focus:outline-none" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-graphite-800">Monto mínimo (USD)</span>
                <input type="number" value={selected.minAmountUsd} onChange={(e) => patch({ minAmountUsd: Number(e.target.value) })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm tabular focus:border-teal-500 focus:outline-none" />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block font-semibold text-graphite-800">Productos / destinos aplicables</span>
                <input value={selected.appliesTo} onChange={(e) => patch({ appliesTo: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-graphite-800">Vigencia desde</span>
                <input type="date" value={selected.validFrom} onChange={(e) => patch({ validFrom: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-graphite-800">Vigencia hasta</span>
                <input type="date" value={selected.validUntil} onChange={(e) => patch({ validUntil: e.target.value })} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={selected.combinable} onChange={(e) => patch({ combinable: e.target.checked })} className="size-4 accent-teal-600" />
                Combinable con promociones
              </label>
              <label className="flex items-center gap-2">
                <span className="font-semibold text-graphite-800">Estado</span>
                <select value={selected.status} onChange={(e) => patch({ status: e.target.value as AdminCoupon["status"] })} className="rounded-[var(--radius-control)] border border-graphite-200 px-2.5 py-1.5 text-sm cursor-pointer focus:border-teal-500 focus:outline-none">
                  <option value="activa">Activa</option>
                  <option value="pausada">Pausada</option>
                  <option value="vencida">Vencida</option>
                </select>
              </label>
            </div>

            <div>
              <p className="mb-1.5 text-sm font-semibold text-graphite-800">Canales</p>
              <div className="flex flex-wrap gap-1.5">
                {["web", "whatsapp", "oficina", "instagram"].map((c) => {
                  const on = selected.channels.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => patch({ channels: on ? selected.channels.filter((x) => x !== c) : [...selected.channels, c] })}
                      aria-pressed={on}
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize cursor-pointer transition-colors ${
                        on ? "bg-petrol-900 text-ivory" : "bg-graphite-100 text-graphite-600 hover:bg-petrol-50"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 border-t border-dashed border-sand-200 pt-4">
              <AdminButton onClick={save}>Guardar cupón</AdminButton>
              <AdminButton variant="ghost" onClick={() => setSelected(null)}>
                Cancelar
              </AdminButton>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
