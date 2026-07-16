"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowDownRightIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  TrendDownIcon,
  TrendUpIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import {
  adminTasks,
  categoryPerformance,
  commercialMetrics,
  funnel,
  recentActivity,
  salesByMonth,
  topDestinations,
  upcomingDepartures,
} from "@/data/admin-core";
import type { AdminTask, TaskPriority } from "@/lib/admin-types";
import { formatDate } from "@/lib/format";
import { AdminButton, SectionCard, useToast } from "./ui";
import { useAdminSession } from "./admin-shell";

/** Operational dashboard: actionable first — tasks, funnel, departures. */

const priorityTone: Record<TaskPriority, string> = {
  alta: "bg-danger-100 text-danger-700",
  media: "bg-warning-100 text-warning-700",
  baja: "bg-graphite-100 text-graphite-600",
};

function Delta({ value }: { value: number }) {
  if (value === 0) return <span className="text-xs font-semibold text-graphite-400">=</span>;
  const up = value > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold tabular ${up ? "text-positive-700" : "text-danger-700"}`}>
      {up ? <ArrowUpRightIcon className="size-3" aria-hidden /> : <ArrowDownRightIcon className="size-3" aria-hidden />}
      {Math.abs(value)}%
    </span>
  );
}

function TaskInbox() {
  const [tasks, setTasks] = useState<AdminTask[]>(adminTasks);
  const { showToast, toastNode } = useToast();
  const pending = tasks.filter((t) => !t.done);

  const resolve = (id: string) => {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: true } : t)));
    showToast("Tarea marcada como resuelta");
  };

  const cyclePriority = (id: string) => {
    const order: TaskPriority[] = ["alta", "media", "baja"];
    setTasks((ts) =>
      ts.map((t) => (t.id === id ? { ...t, priority: order[(order.indexOf(t.priority) + 1) % 3] } : t)),
    );
  };

  return (
    <SectionCard
      title={`Tareas prioritarias (${pending.length})`}
      description="La bandeja operativa del día: resolvé, reasigná o abrí el registro relacionado."
      actions={
        <Link href="/admin/tareas" className="text-xs font-semibold text-teal-600 hover:text-teal-500">
          Ver todas
        </Link>
      }
    >
      {toastNode}
      {pending.length === 0 ? (
        <p className="py-6 text-center text-sm text-graphite-500">Sin tareas pendientes. Buen trabajo.</p>
      ) : (
        <ul className="divide-y divide-graphite-100">
          {pending.slice(0, 6).map((t) => (
            <li key={t.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <button
                onClick={() => resolve(t.id)}
                className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border border-graphite-300 text-transparent transition-colors hover:border-positive-700 hover:text-positive-700 cursor-pointer"
                aria-label={`Marcar resuelta: ${t.title}`}
              >
                <CheckIcon weight="bold" className="size-3" aria-hidden />
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-graphite-800">{t.title}</p>
                  <button
                    onClick={() => cyclePriority(t.id)}
                    className={`rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase cursor-pointer ${priorityTone[t.priority]}`}
                    title="Cambiar prioridad"
                  >
                    {t.priority}
                  </button>
                </div>
                <p className="mt-0.5 text-xs leading-snug text-graphite-500">{t.detail}</p>
                <p className="mt-1 text-[0.6875rem] text-graphite-400">
                  {t.assignee} · vence {formatDate(t.dueDate)}
                </p>
              </div>
              {t.relatedHref && (
                <Link
                  href={t.relatedHref}
                  className="mt-0.5 shrink-0 rounded-lg border border-graphite-200 px-2.5 py-1.5 text-xs font-semibold text-graphite-600 hover:border-petrol-600 hover:text-petrol-800"
                >
                  Abrir
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

function Funnel() {
  const max = funnel[0].count;
  return (
    <SectionCard title="Embudo comercial" description="De la consulta a la reserva confirmada (últimos 30 días).">
      <ol className="space-y-2.5">
        {funnel.map((stage, i) => {
          const pct = Math.round((stage.count / max) * 100);
          const prev = i > 0 ? funnel[i - 1].count : stage.count;
          const conv = i > 0 ? Math.round((stage.count / prev) * 100) : 100;
          return (
            <li key={stage.id}>
              <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className="font-semibold text-graphite-700">{stage.label}</span>
                <span className="text-graphite-500 tabular">
                  {stage.count}
                  {i > 0 && <span className="ml-1.5 text-graphite-400">({conv}%)</span>}
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-sand-100" role="img" aria-label={`${stage.label}: ${stage.count}`}>
                <div className="h-full rounded-full bg-teal-500/85" style={{ width: `${Math.max(pct, 4)}%` }} />
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-xs text-graphite-500">
        Mayor pérdida: cotización → propuesta enviada. Tiempo promedio del ciclo: 9,3 días.
      </p>
    </SectionCard>
  );
}

function SalesChart() {
  const max = Math.max(...salesByMonth.map((m) => m.valueK));
  return (
    <SectionCard title="Ventas últimos 6 meses" description="En miles de USD.">
      <div className="flex items-end gap-2" role="img" aria-label={`Ventas por mes: ${salesByMonth.map((m) => `${m.month} ${m.valueK} mil`).join(", ")}`}>
        {salesByMonth.map((m) => (
          <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[0.6875rem] font-semibold text-graphite-600 tabular">{m.valueK}k</span>
            <div className="w-full rounded-t bg-teal-500/85" style={{ height: `${(m.valueK / max) * 90}px` }} />
            <span className="text-[0.6875rem] text-graphite-500">{m.month}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function AdminDashboard() {
  const session = useAdminSession();
  const firstName = session?.name.split(" ")[0] ?? "equipo";
  const pendingCount = adminTasks.filter((t) => !t.done).length;
  const todayLabel = useMemo(
    () => new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long" }).format(new Date()),
    [],
  );

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* Greeting */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs capitalize text-graphite-500">{todayLabel} · Funes, casa central</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-petrol-900">
            Buen día, {firstName}. Hay {pendingCount} tareas que requieren atención.
          </h1>
        </div>
        <div className="flex gap-2">
          <AdminButton variant="secondary" onClick={() => document.getElementById("proximas-salidas")?.scrollIntoView({ behavior: "smooth" })}>
            Próximas salidas
          </AdminButton>
          <Link href="/admin/consultas" className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-coral-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-coral-600 transition-colors">
            Responder consultas
            <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Commercial summary */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {commercialMetrics.map((m) => (
          <Link
            key={m.id}
            href={m.href}
            className="group rounded-xl border border-graphite-200/70 bg-white px-4 py-3.5 transition-colors hover:border-teal-500/60"
          >
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-xs text-graphite-500">{m.label}</p>
              <Delta value={m.delta} />
            </div>
            <p className="mt-1 font-display text-xl font-bold text-petrol-900 tabular">{m.value}</p>
            <p className="mt-0.5 text-[0.6875rem] text-graphite-400">{m.context}</p>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <div className="min-w-0 space-y-4">
          <TaskInbox />

          {/* Upcoming departures */}
          <SectionCard
            title="Próximas salidas"
            description="Grupos y paquetes con salida en los próximos 60 días."
            actions={
              <Link href="/admin/disponibilidad" className="text-xs font-semibold text-teal-600 hover:text-teal-500">
                Ver disponibilidad
              </Link>
            }
          >
            <div id="proximas-salidas" className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-graphite-100 text-left text-xs font-bold uppercase tracking-wide text-graphite-500">
                    <th className="px-2 py-2">Salida</th>
                    <th className="px-2 py-2">Paquete</th>
                    <th className="px-2 py-2 text-right">Pax</th>
                    <th className="px-2 py-2 text-right">Cupos</th>
                    <th className="px-2 py-2">Coordinador</th>
                    <th className="px-2 py-2 text-right">Docs</th>
                    <th className="px-2 py-2 text-right">Pagos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-graphite-100">
                  {upcomingDepartures.map((d) => (
                    <tr key={`${d.date}-${d.packageSlug}`} className="align-top">
                      <td className="px-2 py-2.5 font-semibold text-graphite-800 whitespace-nowrap tabular">{formatDate(d.date)}</td>
                      <td className="px-2 py-2.5">
                        <p className="font-medium text-graphite-800">{d.packageName}</p>
                        {d.alert && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-coral-700">
                            <WarningCircleIcon className="size-3.5 shrink-0" aria-hidden />
                            {d.alert}
                          </p>
                        )}
                      </td>
                      <td className="px-2 py-2.5 text-right tabular">{d.passengers}</td>
                      <td className={`px-2 py-2.5 text-right font-semibold tabular ${d.seatsLeft <= 6 ? "text-coral-700" : "text-graphite-700"}`}>
                        {d.seatsLeft}
                      </td>
                      <td className="px-2 py-2.5 text-graphite-600">{d.coordinator}</td>
                      <td className="px-2 py-2.5 text-right tabular">{d.docsPending > 0 ? <span className="font-semibold text-warning-700">{d.docsPending}</span> : "—"}</td>
                      <td className="px-2 py-2.5 text-right tabular">{d.paymentsPending > 0 ? <span className="font-semibold text-warning-700">{d.paymentsPending}</span> : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Category performance */}
          <SectionCard title="Rendimiento por categoría" description="Ventas, margen y conversión de los últimos 30 días.">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-graphite-100 text-left text-xs font-bold uppercase tracking-wide text-graphite-500">
                    <th className="px-2 py-2">Categoría</th>
                    <th className="px-2 py-2 text-right">Ventas</th>
                    <th className="px-2 py-2 text-right">Margen</th>
                    <th className="px-2 py-2 text-right">Conversión</th>
                    <th className="px-2 py-2 text-right">Consultas</th>
                    <th className="px-2 py-2 text-right">Cancel.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-graphite-100">
                  {categoryPerformance.map((c) => (
                    <tr key={c.category}>
                      <td className="px-2 py-2.5 font-semibold text-graphite-800">{c.category}</td>
                      <td className="px-2 py-2.5 text-right tabular">USD {c.salesUsd.toLocaleString("es-AR")}</td>
                      <td className="px-2 py-2.5 text-right tabular">{c.marginPct.toLocaleString("es-AR")}%</td>
                      <td className="px-2 py-2.5 text-right tabular">{c.conversionPct}%</td>
                      <td className="px-2 py-2.5 text-right tabular">{c.inquiries}</td>
                      <td className="px-2 py-2.5 text-right tabular">{c.cancellations || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* Right rail */}
        <div className="min-w-0 space-y-4">
          <Funnel />
          <SalesChart />

          <SectionCard title="Destinos destacados" description="Reservas de los últimos 30 días.">
            <ol className="space-y-2">
              {topDestinations.map((d, i) => (
                <li key={d.name} className="flex items-center gap-3 text-sm">
                  <span className="w-4 text-xs font-bold text-graphite-400 tabular">{i + 1}</span>
                  <span className="flex-1 font-medium text-graphite-800">{d.name}</span>
                  {d.trend === "sube" && <TrendUpIcon className="size-4 text-positive-700" aria-label="En alza" />}
                  {d.trend === "baja" && <TrendDownIcon className="size-4 text-danger-700" aria-label="En baja" />}
                  <span className="text-xs text-graphite-500 tabular">{d.bookings} reservas</span>
                </li>
              ))}
            </ol>
          </SectionCard>

          <SectionCard title="Actividad reciente">
            <ol className="space-y-3">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex gap-2.5 text-sm">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-500/70" aria-hidden />
                  <div className="min-w-0">
                    <p className="leading-snug text-graphite-700">
                      <span className="font-semibold text-graphite-800">{a.actor}</span> {a.action}{" "}
                      {a.href ? (
                        <Link href={a.href} className="font-semibold text-teal-600 hover:underline">
                          {a.target}
                        </Link>
                      ) : (
                        <span className="font-semibold">{a.target}</span>
                      )}
                    </p>
                    <p className="text-[0.6875rem] text-graphite-400">{a.time}</p>
                  </div>
                </li>
              ))}
            </ol>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
