"use client";

import { useMemo, useState } from "react";
import { adminBookings } from "@/data/admin";
import { adminPayments, type AdminPayment } from "@/data/admin-sales";
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

/** Payments module: summary tiles, ledger, detail drawer and quick register. */

const usd = (n: number) => formatMoney({ amount: n, currency: "USD" });

export function PaymentsManager({ openNew = false }: { openNew?: boolean }) {
  const [payments, setPayments] = useState<AdminPayment[]>(adminPayments);
  const [selected, setSelected] = useState<AdminPayment | null>(null);
  const [newOpen, setNewOpen] = useState(openNew);
  const [form, setForm] = useState({ bookingCode: adminBookings[0].code, amount: "", currency: "USD" as "USD" | "ARS", method: "Transferencia" as AdminPayment["method"], reference: "" });
  const { showToast, toastNode } = useToast();
  const { can } = usePermissions();
  const canRegister = can("registrar-pagos");

  const tiles = useMemo(() => {
    const usdOnly = payments.filter((p) => p.currency === "USD");
    const sum = (statuses: AdminPayment["status"][]) =>
      usdOnly.filter((p) => statuses.includes(p.status)).reduce((s, p) => s + p.amount, 0);
    return [
      { label: "Cobrado este mes", value: usd(sum(["aprobado", "conciliado"])), tone: "text-positive-700" },
      { label: "Pendiente", value: usd(sum(["pendiente", "iniciado"])), tone: "text-warning-700" },
      { label: "Vencido", value: usd(sum(["vencido", "rechazado"])), tone: "text-danger-700" },
      { label: "Devuelto", value: usd(sum(["devuelto"])), tone: "text-graphite-600" },
    ];
  }, [payments]);

  const columns: Column<AdminPayment>[] = [
    { id: "id", header: "Pago", essential: true, cell: (p) => <span className="font-semibold text-petrol-900 tabular">{p.id}</span>, sortValue: (p) => p.id },
    { id: "booking", header: "Reserva", essential: true, cell: (p) => <span className="tabular">{p.bookingCode}</span>, sortValue: (p) => p.bookingCode },
    { id: "customer", header: "Cliente", cell: (p) => p.customer, sortValue: (p) => p.customer },
    {
      id: "amount",
      header: "Monto",
      essential: true,
      align: "right",
      cell: (p) => <span className="font-semibold tabular">{formatMoney({ amount: p.amount, currency: p.currency })}</span>,
      sortValue: (p) => (p.currency === "ARS" ? p.amount / 1200 : p.amount),
    },
    { id: "method", header: "Método", cell: (p) => p.method, sortValue: (p) => p.method },
    { id: "date", header: "Fecha", cell: (p) => <span className="tabular">{formatDate(p.date)}</span>, sortValue: (p) => p.date },
    { id: "resp", header: "Responsable", cell: (p) => p.responsible, sortValue: (p) => p.responsible },
    { id: "status", header: "Estado", essential: true, cell: (p) => <StatusBadge status={p.status} />, sortValue: (p) => p.status },
  ];

  const filters: FilterDef<AdminPayment>[] = [
    { id: "method", label: "Método", options: ["Mercado Pago", "Tarjeta", "Transferencia", "Efectivo", "Link de pago"], matches: (p, v) => p.method === v },
    { id: "status", label: "Estado", options: ["pendiente", "iniciado", "aprobado", "rechazado", "vencido", "conciliado", "devuelto"], matches: (p, v) => p.status === v },
    { id: "currency", label: "Moneda", options: ["USD", "ARS"], matches: (p, v) => p.currency === v },
  ];

  const gate = (fn: () => void) => () => {
    if (!canRegister) return;
    fn();
  };

  const gatedTitle = canRegister ? undefined : "Tu rol no tiene el permiso de registrar pagos";

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Pagos"
        description="Cobranzas, señas, saldos, devoluciones y conciliación."
        breadcrumb={[{ label: "Pagos" }]}
        actions={
          <AdminButton onClick={() => setNewOpen(true)} disabled={!canRegister} title={gatedTitle}>
            Registrar pago
          </AdminButton>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl border border-graphite-200/70 bg-white px-4 py-3.5">
            <p className="text-xs text-graphite-500">{t.label}</p>
            <p className={`mt-1 font-display text-lg font-bold tabular ${t.tone}`}>{t.value}</p>
          </div>
        ))}
      </div>

      <DataTable
        rows={payments}
        columns={columns}
        rowKey={(p) => p.id}
        searchKeys={(p) => `${p.id} ${p.bookingCode} ${p.customer} ${p.reference} ${p.method}`}
        searchPlaceholder="Buscar por pago, reserva o cliente…"
        filters={filters}
        exportName="pagos"
        onRowClick={setSelected}
        emptyTitle="No hay pagos con esos criterios"
        emptyDetail="Ajustá los filtros o registrá un pago nuevo."
      />

      {/* Detail */}
      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `Pago ${selected.id}` : ""}>
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <StatusBadge status={selected.status} />
              <span className="text-xs text-graphite-500">{selected.concept}</span>
            </div>
            <KVGrid
              items={[
                { label: "Reserva", value: <span className="tabular">{selected.bookingCode}</span> },
                { label: "Cliente", value: selected.customer },
                { label: "Monto", value: <span className="tabular">{formatMoney({ amount: selected.amount, currency: selected.currency })}</span> },
                { label: "Método", value: selected.method },
                { label: "Fecha", value: formatDate(selected.date) },
                { label: "Referencia", value: <span className="tabular">{selected.reference}</span> },
                { label: "Responsable", value: selected.responsible },
                { label: "Moneda", value: selected.currency },
              ]}
            />
            <section>
              <h3 className="mb-2 text-sm font-bold text-petrol-900">Historial de intentos</h3>
              <ol className="space-y-1.5 text-xs text-graphite-500">
                <li>· {formatDate(selected.date)}: {selected.status === "rechazado" ? "intento rechazado por la entidad emisora" : "registro creado"} ({selected.method}).</li>
                {selected.status === "conciliado" && <li>· Conciliado contra el extracto bancario.</li>}
                {selected.status === "iniciado" && <li>· Esperando confirmación del banco (24 a 48 h hábiles).</li>}
                {selected.status === "vencido" && <li>· Venció sin acreditarse: el bloqueo de la reserva queda en revisión.</li>}
              </ol>
            </section>
            {!canRegister && (
              <p className="rounded-lg bg-sand-50 px-3 py-2 text-xs text-graphite-500">
                Tu rol no tiene el permiso “registrar pagos”: las acciones están deshabilitadas. Los permisos reales se validan en el servidor.
              </p>
            )}
            <div className="flex flex-wrap gap-2 border-t border-graphite-100 pt-4">
              <AdminButton
                disabled={!canRegister || selected.status === "conciliado"}
                title={gatedTitle}
                onClick={gate(() => {
                  setPayments((ps) => ps.map((p) => (p.id === selected.id ? { ...p, status: "conciliado" } : p)));
                  setSelected((s) => (s ? { ...s, status: "conciliado" } : s));
                  showToast("Pago conciliado");
                })}
              >
                Conciliar
              </AdminButton>
              <AdminButton
                variant="secondary"
                disabled={!canRegister || !["rechazado", "vencido"].includes(selected.status)}
                title={gatedTitle}
                onClick={gate(() => showToast("Reintento enviado al cliente (demo)"))}
              >
                Reintentar
              </AdminButton>
              <AdminButton
                variant="danger"
                size="sm"
                disabled={!canRegister || selected.status === "devuelto"}
                title={gatedTitle}
                onClick={gate(() => {
                  setPayments((ps) => ps.map((p) => (p.id === selected.id ? { ...p, status: "devuelto" } : p)));
                  setSelected((s) => (s ? { ...s, status: "devuelto" } : s));
                  showToast("Devolución registrada");
                })}
              >
                Devolver
              </AdminButton>
            </div>
          </div>
        )}
      </Drawer>

      {/* Register new */}
      <Drawer open={newOpen} onClose={() => setNewOpen(false)} title="Registrar pago">
        <div className="space-y-4">
          <div>
            <label htmlFor="np-booking" className="mb-1 block text-sm font-semibold text-graphite-800">
              Reserva
            </label>
            <select
              id="np-booking"
              value={form.bookingCode}
              onChange={(e) => setForm((f) => ({ ...f, bookingCode: e.target.value }))}
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none"
            >
              {adminBookings.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.code} · {b.holderName}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-[1fr_110px] gap-3">
            <div>
              <label htmlFor="np-amount" className="mb-1 block text-sm font-semibold text-graphite-800">
                Monto
              </label>
              <input
                id="np-amount"
                type="number"
                min={1}
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm tabular focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="np-currency" className="mb-1 block text-sm font-semibold text-graphite-800">
                Moneda
              </label>
              <select
                id="np-currency"
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value as "USD" | "ARS" }))}
                className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none"
              >
                <option>USD</option>
                <option>ARS</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="np-method" className="mb-1 block text-sm font-semibold text-graphite-800">
              Método
            </label>
            <select
              id="np-method"
              value={form.method}
              onChange={(e) => setForm((f) => ({ ...f, method: e.target.value as AdminPayment["method"] }))}
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none"
            >
              {["Mercado Pago", "Tarjeta", "Transferencia", "Efectivo", "Link de pago"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="np-ref" className="mb-1 block text-sm font-semibold text-graphite-800">
              Referencia
            </label>
            <input
              id="np-ref"
              value={form.reference}
              onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
              placeholder="Nro. de operación, recibo…"
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <AdminButton
            disabled={!canRegister}
            title={gatedTitle}
            onClick={() => {
              const amount = Number(form.amount);
              if (!amount || amount <= 0) {
                showToast("Ingresá un monto válido");
                return;
              }
              const booking = adminBookings.find((b) => b.code === form.bookingCode);
              const id = `P-2026-0${873 + payments.length - adminPayments.length}`;
              setPayments((ps) => [
                {
                  id,
                  bookingCode: form.bookingCode,
                  customer: booking?.holderName ?? "",
                  amount,
                  currency: form.currency,
                  method: form.method,
                  date: new Date().toISOString().slice(0, 10),
                  reference: form.reference || "manual",
                  responsible: "Sofía Gachet",
                  status: form.method === "Efectivo" ? "conciliado" : "aprobado",
                  concept: "Pago registrado manualmente",
                },
                ...ps,
              ]);
              setNewOpen(false);
              setForm((f) => ({ ...f, amount: "", reference: "" }));
              showToast(`Pago ${id} registrado`);
            }}
          >
            Registrar
          </AdminButton>
          {!canRegister && (
            <p className="text-xs text-graphite-500">Tu rol no tiene el permiso “registrar pagos”.</p>
          )}
        </div>
      </Drawer>
    </div>
  );
}
