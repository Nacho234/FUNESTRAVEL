"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CaretDownIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  NotePencilIcon,
  ProhibitIcon,
  WalletIcon,
} from "@phosphor-icons/react";
import { adminBookings, type AdminBooking, type AdminBookingStatus } from "@/data/admin";
import { getPackage } from "@/data/packages";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

const usd = (n: number) => `USD ${n.toLocaleString("es-AR")}`;

interface Row extends AdminBooking {
  fromWeb?: boolean;
}

function statusBadge(status: AdminBookingStatus) {
  switch (status) {
    case "confirmada":
      return <Badge tone="positive">Confirmada</Badge>;
    case "pendiente-de-pago":
      return <Badge tone="warning">Pendiente de pago</Badge>;
    case "en-revision":
      return <Badge tone="teal">En revisión</Badge>;
    case "cancelada":
      return <Badge tone="danger">Cancelada</Badge>;
  }
}

export function BookingsTable() {
  const [rows, setRows] = useState<Row[]>(adminBookings);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"todas" | AdminBookingStatus>("todas");
  const [openCode, setOpenCode] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  // Merge demo bookings created from the public site (localStorage) on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("ft-bookings");
      if (!raw) return;
      const webBookings = JSON.parse(raw) as {
        code: string;
        packageSlug: string;
        departureId?: string;
        adults?: number;
        children?: number;
        totalUsd: number;
        payMethod?: string;
        status: string;
        createdAt: string;
        holderName: string;
        holderEmail: string;
      }[];
      if (!Array.isArray(webBookings) || webBookings.length === 0) return;
      const mapped: Row[] = webBookings.map((w) => {
        const pkg = getPackage(w.packageSlug);
        const dep = pkg?.departures.find((d) => d.id === w.departureId);
        return {
          code: w.code,
          packageSlug: w.packageSlug,
          holderName: w.holderName || "Cliente web",
          holderEmail: w.holderEmail || "",
          adults: w.adults ?? 1,
          children: w.children ?? 0,
          totalUsd: w.totalUsd,
          status: (["confirmada", "pendiente-de-pago", "en-revision", "cancelada"].includes(w.status)
            ? w.status
            : "en-revision") as AdminBookingStatus,
          payMethod: w.payMethod ?? "Web",
          advisor: "Sin asignar",
          createdAt: w.createdAt.slice(0, 10),
          departureDate: dep?.date ?? "",
          fromWeb: true,
        };
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRows((prev) => {
        const known = new Set(prev.map((r) => r.code));
        return [...mapped.filter((m) => !known.has(m.code)), ...prev];
      });
    } catch {
      // corrupted storage: show only the mock list
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== "todas" && r.status !== status) return false;
      if (q && !`${r.code} ${r.holderName} ${r.holderEmail}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, query, status]);

  const act = (code: string, next: AdminBookingStatus, message: string) => {
    setRows((prev) => prev.map((r) => (r.code === code ? { ...r, status: next } : r)));
    setFeedback(message);
    setTimeout(() => setFeedback(null), 2500);
  };

  const addNote = (code: string) => {
    const draft = (noteDrafts[code] ?? "").trim();
    if (!draft) return;
    setRows((prev) =>
      prev.map((r) => (r.code === code ? { ...r, notes: r.notes ? `${r.notes} · ${draft}` : draft } : r)),
    );
    setNoteDrafts((d) => ({ ...d, [code]: "" }));
    setFeedback("Nota agregada.");
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-graphite-400" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por código o titular…"
            aria-label="Buscar reservas"
            className="w-full rounded-[var(--radius-control)] border border-graphite-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/25"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-graphite-600">
          Estado
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="rounded-[var(--radius-control)] border border-graphite-200 bg-white px-3 py-2 text-sm font-semibold text-graphite-800 cursor-pointer focus:border-teal-500 focus:outline-none"
          >
            <option value="todas">Todas</option>
            <option value="confirmada">Confirmadas</option>
            <option value="pendiente-de-pago">Pendientes de pago</option>
            <option value="en-revision">En revisión</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </label>
        <p className="text-sm text-graphite-500 tabular" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "reserva" : "reservas"}
        </p>
      </div>

      {feedback && (
        <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-positive-100 px-3 py-2 text-sm font-medium text-positive-700" role="status">
          <CheckCircleIcon weight="fill" className="size-4" aria-hidden /> {feedback}
        </p>
      )}

      <div className="mt-4 overflow-x-auto rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)]">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-graphite-500 border-b border-graphite-100">
              <th className="px-4 py-3 font-semibold">Reserva</th>
              <th className="px-4 py-3 font-semibold">Titular</th>
              <th className="px-4 py-3 font-semibold">Salida</th>
              <th className="px-4 py-3 font-semibold text-right">Total</th>
              <th className="px-4 py-3 font-semibold text-right">Estado</th>
              <th className="px-4 py-3" aria-label="Expandir" />
            </tr>
          </thead>
          <tbody className="divide-y divide-graphite-100">
            {filtered.map((r) => {
              const open = openCode === r.code;
              const pkg = getPackage(r.packageSlug);
              return (
                <BookingRowGroup key={r.code} open={open}>
                  <tr className={open ? "bg-petrol-50/40" : "hover:bg-sand-50/60"}>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 font-semibold text-graphite-800 tabular">
                        {r.code}
                        {r.fromWeb && <Badge tone="teal">Web</Badge>}
                      </span>
                      <span className="block text-xs text-graphite-500">{pkg?.name ?? r.packageSlug}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-graphite-800">{r.holderName}</span>
                      <span className="block text-xs text-graphite-500">{r.holderEmail}</span>
                    </td>
                    <td className="px-4 py-3 text-graphite-700 tabular">{r.departureDate ? formatDate(r.departureDate) : "A definir"}</td>
                    <td className="px-4 py-3 text-right font-semibold text-graphite-800 tabular">{usd(r.totalUsd)}</td>
                    <td className="px-4 py-3 text-right">{statusBadge(r.status)}</td>
                    <td className="px-2 py-3">
                      <button
                        onClick={() => setOpenCode(open ? null : r.code)}
                        className="grid size-8 place-items-center rounded-lg text-graphite-500 hover:bg-petrol-50 hover:text-petrol-800 cursor-pointer"
                        aria-expanded={open}
                        aria-label={`${open ? "Cerrar" : "Ver"} detalle de ${r.code}`}
                      >
                        <CaretDownIcon className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
                      </button>
                    </td>
                  </tr>
                  {open && (
                    <tr className="bg-petrol-50/40">
                      <td colSpan={6} className="px-4 pb-4">
                        <div className="rounded-xl bg-white p-4 shadow-[var(--shadow-lift)]">
                          <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                              <dt className="text-graphite-500">Pasajeros</dt>
                              <dd className="font-semibold text-graphite-800">
                                {r.adults} {r.adults === 1 ? "adulto" : "adultos"}
                                {r.children > 0 && ` + ${r.children} ${r.children === 1 ? "menor" : "menores"}`}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-graphite-500">Método de pago</dt>
                              <dd className="font-semibold text-graphite-800">{r.payMethod}</dd>
                            </div>
                            <div>
                              <dt className="text-graphite-500">Asesor asignado</dt>
                              <dd className="font-semibold text-graphite-800">{r.advisor}</dd>
                            </div>
                            <div>
                              <dt className="text-graphite-500">Creada</dt>
                              <dd className="font-semibold text-graphite-800 tabular">{formatDate(r.createdAt)}</dd>
                            </div>
                          </dl>
                          {r.notes && (
                            <p className="mt-3 rounded-lg bg-sand-50 px-3 py-2 text-sm text-graphite-700">
                              <span className="font-semibold">Notas internas:</span> {r.notes}
                            </p>
                          )}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {r.status !== "confirmada" && r.status !== "cancelada" && (
                              <button
                                onClick={() => act(r.code, "confirmada", `Reserva ${r.code} confirmada.`)}
                                className="flex items-center gap-1.5 rounded-[var(--radius-control)] bg-positive-700 px-3.5 py-2 text-sm font-semibold text-white hover:opacity-90 cursor-pointer"
                              >
                                <CheckCircleIcon className="size-4" aria-hidden /> Confirmar
                              </button>
                            )}
                            {r.status === "pendiente-de-pago" && (
                              <button
                                onClick={() => act(r.code, "confirmada", `Pago registrado en ${r.code}.`)}
                                className="flex items-center gap-1.5 rounded-[var(--radius-control)] bg-petrol-900 px-3.5 py-2 text-sm font-semibold text-ivory hover:bg-petrol-800 cursor-pointer"
                              >
                                <WalletIcon className="size-4" aria-hidden /> Registrar pago
                              </button>
                            )}
                            {r.status !== "cancelada" && (
                              <button
                                onClick={() => act(r.code, "cancelada", `Reserva ${r.code} cancelada.`)}
                                className="flex items-center gap-1.5 rounded-[var(--radius-control)] border border-danger-700/30 px-3.5 py-2 text-sm font-semibold text-danger-700 hover:bg-danger-100/50 cursor-pointer"
                              >
                                <ProhibitIcon className="size-4" aria-hidden /> Cancelar
                              </button>
                            )}
                            <div className="ml-auto flex items-center gap-2">
                              <label htmlFor={`note-${r.code}`} className="sr-only">
                                Agregar nota a {r.code}
                              </label>
                              <input
                                id={`note-${r.code}`}
                                value={noteDrafts[r.code] ?? ""}
                                onChange={(e) => setNoteDrafts((d) => ({ ...d, [r.code]: e.target.value }))}
                                placeholder="Agregar nota interna…"
                                className="w-56 rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                              />
                              <button
                                onClick={() => addNote(r.code)}
                                className="flex items-center gap-1.5 rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm font-semibold text-graphite-700 hover:border-petrol-600 cursor-pointer"
                              >
                                <NotePencilIcon className="size-4" aria-hidden /> Guardar
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </BookingRowGroup>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-graphite-500">
            No hay reservas que coincidan con la búsqueda. Probá con otro código o cambiá el filtro de estado.
          </p>
        )}
      </div>
    </div>
  );
}

// Fragment wrapper so each logical row group can hold two <tr> elements.
function BookingRowGroup({ children }: { children: React.ReactNode; open: boolean }) {
  return <>{children}</>;
}
