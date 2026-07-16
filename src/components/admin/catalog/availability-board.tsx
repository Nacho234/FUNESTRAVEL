"use client";

import { useMemo, useState } from "react";
import { CaretLeftIcon, CaretRightIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { availabilityMatrix, type AvailabilityRow } from "@/data/admin-catalog";
import { formatDate } from "@/lib/format";
import { AdminButton, PageHeader, SectionCard, StatusBadge, useToast } from "../ui";

/** Availability board: occupancy table by package + monthly calendar view. */

type AlertFilter = "todos" | "bajos" | "minimo" | "agotado";

function occupancyPct(r: AvailabilityRow): number {
  return Math.round((r.sold / r.total) * 100);
}

function available(r: AvailabilityRow): number {
  return Math.max(0, r.total - r.sold - r.blocked);
}

/* ── vista tabla ─────────────────────────────────────────────────── */

function TableView({ filter }: { filter: AlertFilter }) {
  const [rows, setRows] = useState<AvailabilityRow[]>(availabilityMatrix);
  const { showToast, toastNode } = useToast();

  const filtered = rows.filter((r) => {
    if (filter === "bajos") return available(r) > 0 && available(r) <= 6;
    if (filter === "minimo") return r.sold < r.minRequired;
    if (filter === "agotado") return available(r) === 0;
    return true;
  });

  const grouped = useMemo(() => {
    const map = new Map<string, AvailabilityRow[]>();
    for (const r of filtered) {
      const arr = map.get(r.packageName) ?? [];
      arr.push(r);
      map.set(r.packageName, arr);
    }
    return [...map.entries()];
  }, [filtered]);

  const setBlocked = (id: string, blocked: number) => {
    setRows((rs) => rs.map((r) => (r.departureId === id ? { ...r, blocked: Math.max(0, blocked) } : r)));
  };

  const release = (id: string) => {
    setRows((rs) => rs.map((r) => (r.departureId === id ? { ...r, blocked: 0 } : r)));
    showToast("Cupos bloqueados liberados");
  };

  if (grouped.length === 0) {
    return (
      <SectionCard>
        <p className="py-6 text-center text-sm text-graphite-500">No hay salidas que coincidan con esa alerta.</p>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-4">
      {toastNode}
      {grouped.map(([packageName, departures]) => (
        <SectionCard key={packageName} title={packageName}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-graphite-100 text-left text-xs font-bold uppercase tracking-wide text-graphite-500">
                  <th className="px-2 py-2">Salida</th>
                  <th className="px-2 py-2 text-right">Totales</th>
                  <th className="px-2 py-2 text-right">Vendidos</th>
                  <th className="px-2 py-2 text-right">Bloqueados</th>
                  <th className="px-2 py-2 text-right">Espera</th>
                  <th className="px-2 py-2 text-right">Disponibles</th>
                  <th className="px-2 py-2">Ocupación</th>
                  <th className="px-2 py-2 text-right">Mínimo</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite-100">
                {departures.map((r) => {
                  const avail = available(r);
                  const pct = occupancyPct(r);
                  return (
                    <tr key={r.departureId}>
                      <td className="px-2 py-2.5">
                        <span className="font-semibold text-graphite-800 tabular">{formatDate(r.date)}</span>
                        {r.confirmed && <StatusBadge status="confirmada" className="ml-2" />}
                      </td>
                      <td className="px-2 py-2.5 text-right tabular">{r.total}</td>
                      <td className="px-2 py-2.5 text-right tabular">{r.sold}</td>
                      <td className="px-2 py-2.5 text-right">
                        <input
                          type="number"
                          min={0}
                          value={r.blocked}
                          onChange={(e) => setBlocked(r.departureId, Number(e.target.value))}
                          className="w-16 rounded-md border border-graphite-200 px-2 py-1 text-right text-sm tabular focus:border-teal-500 focus:outline-none"
                          aria-label={`Bloqueados en salida ${formatDate(r.date)}`}
                        />
                      </td>
                      <td className="px-2 py-2.5 text-right tabular">{r.waitlist || "—"}</td>
                      <td className={`px-2 py-2.5 text-right font-bold tabular ${avail === 0 ? "text-danger-700" : avail <= 6 ? "text-coral-700" : "text-graphite-800"}`}>
                        {avail}
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-sand-100">
                            <div className="h-full rounded-full bg-teal-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-graphite-500 tabular">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        <span className={`tabular ${r.sold < r.minRequired ? "font-semibold text-warning-700" : "text-graphite-600"}`}>
                          {r.sold}/{r.minRequired}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        {r.blocked > 0 && (
                          <AdminButton size="sm" variant="secondary" onClick={() => release(r.departureId)}>
                            Liberar
                          </AdminButton>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

/* ── vista calendario ────────────────────────────────────────────── */

function CalendarView() {
  const months = useMemo(() => {
    const set = new Set(availabilityMatrix.map((r) => r.date.slice(0, 7)));
    return [...set].sort();
  }, []);
  const [monthIndex, setMonthIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState<AvailabilityRow[] | null>(null);

  const month = months[monthIndex];
  const [year, monthNum] = month.split("-").map(Number);
  const firstWeekday = new Date(Date.UTC(year, monthNum - 1, 1)).getUTCDay(); // 0=domingo
  const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getUTCDate();
  const monthLabel = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, monthNum - 1, 1)),
  );

  const byDay = useMemo(() => {
    const map = new Map<number, AvailabilityRow[]>();
    for (const r of availabilityMatrix.filter((x) => x.date.startsWith(month))) {
      const day = Number(r.date.slice(8, 10));
      map.set(day, [...(map.get(day) ?? []), r]);
    }
    return map;
  }, [month]);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <SectionCard
        title={monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
        actions={
          <div className="flex gap-1">
            <button
              onClick={() => {
                setMonthIndex((i) => Math.max(0, i - 1));
                setSelectedDay(null);
              }}
              disabled={monthIndex === 0}
              className="grid size-8 place-items-center rounded-lg border border-graphite-200 text-graphite-600 hover:text-petrol-800 disabled:opacity-30 cursor-pointer"
              aria-label="Mes anterior"
            >
              <CaretLeftIcon className="size-4" aria-hidden />
            </button>
            <button
              onClick={() => {
                setMonthIndex((i) => Math.min(months.length - 1, i + 1));
                setSelectedDay(null);
              }}
              disabled={monthIndex === months.length - 1}
              className="grid size-8 place-items-center rounded-lg border border-graphite-200 text-graphite-600 hover:text-petrol-800 disabled:opacity-30 cursor-pointer"
              aria-label="Mes siguiente"
            >
              <CaretRightIcon className="size-4" aria-hidden />
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-7 gap-1 text-center text-[0.6875rem] font-bold uppercase tracking-wide text-graphite-400">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstWeekday }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const departures = byDay.get(day);
            return (
              <button
                key={day}
                onClick={() => departures && setSelectedDay(departures)}
                disabled={!departures}
                className={`min-h-16 rounded-lg border p-1.5 text-left text-xs transition-colors ${
                  departures
                    ? "cursor-pointer border-teal-500/40 bg-teal-50/40 hover:border-teal-500"
                    : "border-graphite-100 bg-white text-graphite-400"
                }`}
                aria-label={departures ? `Día ${day}: ${departures.length} salidas` : `Día ${day}, sin salidas`}
              >
                <span className="font-semibold tabular">{day}</span>
                {departures?.map((d) => (
                  <span key={d.departureId} className="mt-0.5 flex items-center gap-1 truncate text-[0.625rem] text-graphite-600">
                    <span className={`size-1.5 shrink-0 rounded-full ${available(d) === 0 ? "bg-danger-700" : available(d) <= 6 ? "bg-coral-500" : "bg-teal-500"}`} aria-hidden />
                    {available(d)} cupos
                  </span>
                ))}
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Detalle de la salida">
        {selectedDay ? (
          <ul className="space-y-4">
            {selectedDay.map((r) => (
              <li key={r.departureId} className="rounded-lg border border-graphite-100 p-3.5 text-sm">
                <p className="font-semibold text-graphite-800">{r.packageName}</p>
                <p className="mt-0.5 text-xs text-graphite-500 tabular">{formatDate(r.date)}</p>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className="flex justify-between"><dt className="text-graphite-500">Totales</dt><dd className="tabular font-semibold">{r.total}</dd></div>
                  <div className="flex justify-between"><dt className="text-graphite-500">Vendidos</dt><dd className="tabular font-semibold">{r.sold}</dd></div>
                  <div className="flex justify-between"><dt className="text-graphite-500">Bloqueados</dt><dd className="tabular font-semibold">{r.blocked}</dd></div>
                  <div className="flex justify-between"><dt className="text-graphite-500">Disponibles</dt><dd className={`tabular font-bold ${available(r) <= 6 ? "text-coral-700" : ""}`}>{available(r)}</dd></div>
                  <div className="flex justify-between"><dt className="text-graphite-500">Lista de espera</dt><dd className="tabular font-semibold">{r.waitlist}</dd></div>
                  <div className="flex justify-between"><dt className="text-graphite-500">Mínimo</dt><dd className="tabular font-semibold">{r.minRequired}</dd></div>
                </dl>
                {r.sold < r.minRequired && (
                  <p className="mt-2 flex items-center gap-1 text-xs font-medium text-warning-700">
                    <WarningCircleIcon className="size-3.5" aria-hidden /> Mínimo de pasajeros no alcanzado
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm text-graphite-500">Elegí un día con salidas para ver el detalle.</p>
        )}
      </SectionCard>
    </div>
  );
}

/* ── página ──────────────────────────────────────────────────────── */

export function AvailabilityBoard() {
  const [view, setView] = useState<"tabla" | "calendario">("tabla");
  const [filter, setFilter] = useState<AlertFilter>("todos");

  const lowCount = availabilityMatrix.filter((r) => available(r) > 0 && available(r) <= 6).length;
  const minCount = availabilityMatrix.filter((r) => r.sold < r.minRequired).length;
  const soldOutCount = availabilityMatrix.filter((r) => available(r) === 0).length;

  const alertChips: { id: AlertFilter; label: string; count: number; tone: string }[] = [
    { id: "bajos", label: "Últimos cupos", count: lowCount, tone: "border-coral-500/40 bg-coral-50 text-coral-700" },
    { id: "minimo", label: "Mínimo no alcanzado", count: minCount, tone: "border-warning-700/30 bg-warning-100 text-warning-700" },
    { id: "agotado", label: "Sin disponibilidad", count: soldOutCount, tone: "border-danger-700/30 bg-danger-100 text-danger-700" },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Disponibilidad y cupos"
        description="Cupos por salida con bloqueos, liberaciones, listas de espera y mínimos requeridos."
        breadcrumb={[{ label: "Disponibilidad" }]}
        actions={
          <div className="flex rounded-[var(--radius-control)] border border-graphite-200 bg-white p-0.5" role="group" aria-label="Vista">
            {(["tabla", "calendario"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize cursor-pointer transition-colors ${
                  view === v ? "bg-petrol-900 text-ivory" : "text-graphite-600 hover:text-petrol-900"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        }
      />

      {view === "tabla" && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {alertChips.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter((f) => (f === c.id ? "todos" : c.id))}
              aria-pressed={filter === c.id}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all ${c.tone} ${
                filter === c.id ? "ring-2 ring-petrol-900/20" : ""
              }`}
            >
              {c.label}
              <span className="rounded-full bg-white/70 px-1.5 tabular">{c.count}</span>
            </button>
          ))}
          {filter !== "todos" && (
            <button onClick={() => setFilter("todos")} className="text-xs font-semibold text-graphite-500 hover:text-petrol-800 cursor-pointer">
              Ver todas
            </button>
          )}
        </div>
      )}

      {view === "tabla" ? <TableView filter={filter} /> : <CalendarView />}
    </div>
  );
}
