"use client";

import { LockKeyIcon } from "@phosphor-icons/react";
import { cashMovements, financeSummary, type CashMovement } from "@/data/admin-sales";
import { formatDate, formatMoney } from "@/lib/format";
import { DataTable, EmptyState, PageHeader, SectionCard, type Column, type FilterDef } from "../ui";
import { usePermissions } from "./permissions";

/** Finance overview: gated by the "ver-costos" permission. */

const usd = (n: number) => formatMoney({ amount: n, currency: "USD" });
const ars = (n: number) => formatMoney({ amount: n, currency: "ARS" });

export function FinanceView() {
  const { can, roleName } = usePermissions();

  if (!can("ver-costos")) {
    return (
      <div className="mx-auto max-w-[1400px]">
        <PageHeader title="Finanzas" breadcrumb={[{ label: "Finanzas" }]} />
        <EmptyState
          icon={<LockKeyIcon className="size-5" aria-hidden />}
          title="Sin permisos para ver finanzas"
          detail={`Tu rol${roleName ? ` (${roleName})` : ""} no incluye el permiso “ver costos”. Pedile acceso a un administrador. En producción este control se valida también en el servidor.`}
        />
      </div>
    );
  }

  const tiles = [
    { label: "Ingresos USD", value: usd(financeSummary.usd.income), tone: "text-positive-700" },
    { label: "Egresos USD", value: usd(financeSummary.usd.expenses), tone: "text-danger-700" },
    { label: "Margen USD", value: usd(financeSummary.usd.margin), tone: "text-petrol-900" },
    { label: "Comisiones", value: usd(financeSummary.usd.commissions), tone: "text-graphite-700" },
    { label: "Saldo proveedores", value: usd(financeSummary.providerBalances.reduce((s, p) => s + p.balanceUsd, 0)), tone: "text-danger-700" },
    { label: "Devoluciones", value: usd(financeSummary.usd.refunds), tone: "text-graphite-700" },
  ];

  const columns: Column<CashMovement>[] = [
    { id: "date", header: "Fecha", essential: true, cell: (m) => <span className="tabular">{formatDate(m.date)}</span>, sortValue: (m) => m.date },
    { id: "concept", header: "Concepto", essential: true, cell: (m) => <span className="font-medium text-graphite-800">{m.concept}</span>, sortValue: (m) => m.concept },
    {
      id: "kind",
      header: "Tipo",
      cell: (m) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
            m.kind === "ingreso" ? "bg-positive-100 text-positive-700" : "bg-graphite-100 text-graphite-600"
          }`}
        >
          {m.kind}
        </span>
      ),
      sortValue: (m) => m.kind,
    },
    { id: "cat", header: "Categoría", cell: (m) => <span className="capitalize text-graphite-600">{m.category}</span>, sortValue: (m) => m.category },
    {
      id: "amount",
      header: "Monto",
      essential: true,
      align: "right",
      cell: (m) => (
        <span className={`font-semibold tabular ${m.kind === "ingreso" ? "text-positive-700" : "text-danger-700"}`}>
          {m.kind === "ingreso" ? "+" : "-"} {formatMoney({ amount: m.amount, currency: m.currency })}
        </span>
      ),
      sortValue: (m) => (m.kind === "ingreso" ? 1 : -1) * (m.currency === "ARS" ? m.amount / 1200 : m.amount),
    },
  ];

  const filters: FilterDef<CashMovement>[] = [
    { id: "kind", label: "Tipo", options: ["ingreso", "egreso"], matches: (m, v) => m.kind === v },
    { id: "cat", label: "Categoría", options: ["cobranza", "proveedores", "comisiones", "impuestos", "devoluciones", "gastos"], matches: (m, v) => m.category === v },
    { id: "cur", label: "Moneda", options: ["USD", "ARS"], matches: (m, v) => m.currency === v },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Finanzas"
        description={`Resumen de ${financeSummary.month}. Entorno de demostración: los valores se reemplazan por datos contables reales al conectar el backend.`}
        breadcrumb={[{ label: "Finanzas" }]}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl border border-graphite-200/70 bg-white px-4 py-3.5">
            <p className="text-xs text-graphite-500">{t.label}</p>
            <p className={`mt-1 font-display text-base font-bold tabular ${t.tone}`}>{t.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <SectionCard title="Movimientos de caja" description="Ingresos y egresos registrados en el período.">
          <DataTable
            rows={cashMovements}
            columns={columns}
            rowKey={(m) => m.id}
            searchKeys={(m) => `${m.concept} ${m.category}`}
            searchPlaceholder="Buscar movimiento…"
            filters={filters}
            exportName="movimientos-caja"
            pageSize={8}
          />
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Saldos por proveedor" description="Deuda pendiente de pago a operadores.">
            <ul className="divide-y divide-graphite-100">
              {financeSummary.providerBalances.map((p) => (
                <li key={p.provider} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-graphite-800">{p.provider}</p>
                    <p className="truncate text-xs text-graphite-500">
                      {p.note}
                      {p.due && ` · vence ${formatDate(p.due)}`}
                    </p>
                  </div>
                  <span className={`shrink-0 font-semibold tabular ${p.balanceUsd < 0 ? "text-danger-700" : "text-positive-700"}`}>
                    {p.balanceUsd === 0 ? "Al día" : usd(Math.abs(p.balanceUsd))}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-graphite-500">
              Los contratos y condiciones están en{" "}
              <a href="/admin/proveedores" className="font-semibold text-teal-600 hover:underline">
                Proveedores
              </a>
              .
            </p>
          </SectionCard>

          <SectionCard title="Impuestos estimados" description="Estimación del período, sujeta a liquidación contable.">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-graphite-600">IVA y percepciones (USD)</dt>
                <dd className="font-semibold tabular">{usd(financeSummary.usd.taxes)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-graphite-600">Percepciones AFIP (ARS)</dt>
                <dd className="font-semibold tabular">{ars(financeSummary.ars.taxes)}</dd>
              </div>
              <div className="flex justify-between border-t border-graphite-100 pt-2">
                <dt className="text-graphite-600">Ingresos en pesos</dt>
                <dd className="font-semibold tabular">{ars(financeSummary.ars.income)}</dd>
              </div>
            </dl>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
