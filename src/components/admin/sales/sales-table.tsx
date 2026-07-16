"use client";

import { useState } from "react";
import { adminSales, type AdminSale } from "@/data/admin-sales";
import { formatDate, formatMoney } from "@/lib/format";
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
} from "../ui";
import { usePermissions } from "./permissions";

/** Sales module: filterable ledger + detail drawer with cost breakdown. */

const usd = (n: number) => formatMoney({ amount: n, currency: "USD" });

export function SalesTable() {
  const { can } = usePermissions();
  const canMargins = can("ver-margenes");
  const canCosts = can("ver-costos");
  const [selected, setSelected] = useState<AdminSale | null>(null);
  const [note, setNote] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { showToast, toastNode } = useToast();

  const columns: Column<AdminSale>[] = [
    { id: "id", header: "Número", essential: true, cell: (s) => <span className="font-semibold text-petrol-900 tabular">{s.id}</span>, sortValue: (s) => s.id },
    { id: "customer", header: "Cliente", essential: true, cell: (s) => s.customer, sortValue: (s) => s.customer },
    {
      id: "product",
      header: "Producto",
      cell: (s) => (
        <div>
          <p className="font-medium text-graphite-800">{s.product}</p>
          <p className="text-xs text-graphite-500">{s.destination}</p>
        </div>
      ),
      sortValue: (s) => s.product,
    },
    { id: "seller", header: "Vendedor", cell: (s) => s.seller, sortValue: (s) => s.seller },
    { id: "date", header: "Fecha", cell: (s) => <span className="tabular">{formatDate(s.date)}</span>, sortValue: (s) => s.date },
    { id: "total", header: "Total", essential: true, align: "right", cell: (s) => <span className="font-semibold tabular">{usd(s.totalUsd)}</span>, sortValue: (s) => s.totalUsd },
    ...(canMargins
      ? [
          {
            id: "margin",
            header: "Margen",
            align: "right" as const,
            cell: (s: AdminSale) => (
              <span className="tabular">
                {usd(s.marginUsd)} <span className="text-xs text-graphite-500">({s.marginPct.toLocaleString("es-AR")}%)</span>
              </span>
            ),
            sortValue: (s: AdminSale) => s.marginUsd,
          },
        ]
      : []),
    { id: "status", header: "Estado", essential: true, cell: (s) => <StatusBadge status={s.status} />, sortValue: (s) => s.status },
    { id: "pay", header: "Pago", cell: (s) => <StatusBadge status={s.payStatus} />, sortValue: (s) => s.payStatus },
    { id: "channel", header: "Canal", cell: (s) => <span className="capitalize text-graphite-600">{s.channel}</span>, sortValue: (s) => s.channel },
  ];

  const filters: FilterDef<AdminSale>[] = [
    { id: "seller", label: "Vendedor", options: [...new Set(adminSales.map((s) => s.seller))], matches: (s, v) => s.seller === v },
    { id: "status", label: "Estado", options: ["confirmada", "pendiente", "completada", "cancelada"], matches: (s, v) => s.status === v },
    { id: "channel", label: "Canal", options: ["web", "whatsapp", "oficina", "instagram"], matches: (s, v) => s.channel === v },
    { id: "pay", label: "Pago", options: ["pagado", "pago parcial", "pendiente", "reembolsado"], matches: (s, v) => s.payStatus === v },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Ventas"
        description="Todas las operaciones comerciales, con su estado de pago y su reserva vinculada."
        breadcrumb={[{ label: "Ventas" }]}
      />

      <DataTable
        rows={adminSales}
        columns={columns}
        rowKey={(s) => s.id}
        searchKeys={(s) => `${s.id} ${s.customer} ${s.product} ${s.destination} ${s.seller} ${s.bookingCode ?? ""}`}
        searchPlaceholder="Buscar por número, cliente o producto…"
        filters={filters}
        exportName="ventas"
        onRowClick={(s) => {
          setSelected(s);
          setConfirmCancel(false);
        }}
        bulkActions={[{ label: "Exportar seleccionadas", onApply: (rows) => showToast(`${rows.length} ventas exportadas (demo)`) }]}
        emptyTitle="No hay ventas con esos criterios"
        emptyDetail="Ajustá los filtros o registrá una venta desde “Nueva acción”."
      />

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `Venta ${selected.id}` : ""}>
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={selected.status} />
              <StatusBadge status={selected.payStatus} />
              <span className="text-xs capitalize text-graphite-500">Canal: {selected.channel}</span>
            </div>

            <KVGrid
              items={[
                { label: "Cliente", value: selected.customer },
                { label: "Vendedor", value: selected.seller },
                { label: "Producto", value: selected.product },
                { label: "Destino", value: selected.destination },
                { label: "Fecha", value: formatDate(selected.date) },
                { label: "Reserva vinculada", value: selected.bookingCode ?? "Sin reserva (servicio suelto)" },
              ]}
            />

            <section>
              <h3 className="mb-2 text-sm font-bold text-petrol-900">Desglose</h3>
              <dl className="space-y-1.5 rounded-xl border border-graphite-200/70 bg-sand-50/50 p-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-graphite-600">Precio de venta</dt>
                  <dd className="font-semibold tabular">{usd(selected.totalUsd)}</dd>
                </div>
                {canCosts && (
                  <div className="flex justify-between">
                    <dt className="text-graphite-600">Costo</dt>
                    <dd className="tabular">{usd(selected.costUsd)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-graphite-600">Impuestos</dt>
                  <dd className="tabular">{usd(selected.taxesUsd)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-graphite-600">Descuento</dt>
                  <dd className="tabular">{selected.discountUsd ? `- ${usd(selected.discountUsd)}` : "Sin descuento"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-graphite-600">Comisión vendedor</dt>
                  <dd className="tabular">{usd(selected.commissionUsd)}</dd>
                </div>
                {canMargins ? (
                  <div className="flex justify-between border-t border-graphite-200/70 pt-1.5">
                    <dt className="font-semibold text-graphite-800">Margen</dt>
                    <dd className="font-bold text-petrol-900 tabular">
                      {usd(selected.marginUsd)} ({selected.marginPct.toLocaleString("es-AR")}%)
                    </dd>
                  </div>
                ) : (
                  <p className="border-t border-graphite-200/70 pt-1.5 text-xs text-graphite-500">
                    Costos y margen visibles solo para roles con permiso financiero.
                  </p>
                )}
              </dl>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-bold text-petrol-900">Última actividad</h3>
              <p className="text-sm text-graphite-600">{selected.lastActivity}</p>
            </section>

            <section>
              <label htmlFor="sale-note" className="mb-1 block text-sm font-bold text-petrol-900">
                Notas internas
              </label>
              <textarea
                id="sale-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Visible solo para el equipo."
                className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
              <AdminButton
                variant="ghost"
                size="sm"
                className="mt-1.5"
                onClick={() => {
                  if (note.trim()) {
                    showToast("Nota guardada");
                    setNote("");
                  }
                }}
              >
                Guardar nota
              </AdminButton>
            </section>

            <section className="space-y-2 border-t border-graphite-100 pt-4">
              <div className="flex flex-wrap gap-2">
                <AdminButton onClick={() => showToast("Pago registrado (demo)")}>Registrar pago</AdminButton>
                <AdminButton variant="secondary" onClick={() => showToast("Convertida en reserva (demo)")}>
                  Convertir en reserva
                </AdminButton>
                <AdminButton variant="secondary" onClick={() => showToast("Comprobante enviado por correo (demo)")}>
                  Enviar comprobante
                </AdminButton>
              </div>
              {selected.status !== "cancelada" &&
                (confirmCancel ? (
                  <div className="rounded-xl border border-danger-100 bg-danger-100/40 p-3">
                    <p className="text-sm font-semibold text-danger-700">¿Cancelar la venta {selected.id}?</p>
                    <p className="mt-0.5 text-xs text-graphite-600">Se aplicará la política de cancelación vigente.</p>
                    <div className="mt-2 flex gap-2">
                      <AdminButton
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          showToast("Venta cancelada (demo)");
                          setConfirmCancel(false);
                          setSelected(null);
                        }}
                      >
                        Sí, cancelar
                      </AdminButton>
                      <AdminButton variant="ghost" size="sm" onClick={() => setConfirmCancel(false)}>
                        Volver
                      </AdminButton>
                    </div>
                  </div>
                ) : (
                  <AdminButton variant="danger" size="sm" onClick={() => setConfirmCancel(true)}>
                    Cancelar venta
                  </AdminButton>
                ))}
            </section>
          </div>
        )}
      </Drawer>
    </div>
  );
}
