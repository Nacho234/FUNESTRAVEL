"use client";

import { useState } from "react";
import { CheckSquareIcon } from "@phosphor-icons/react";
import { adminTasks } from "@/data/admin-core";
import type { AdminTask, TaskPriority } from "@/lib/admin-types";
import { formatDate } from "@/lib/format";
import { AdminButton, DataTable, Drawer, KVGrid, PageHeader, StatusBadge, useToast, type Column, type FilterDef } from "./ui";

/** Full tasks view: filterable table, bulk resolve, detail drawer. */

const assignees = ["Sofía Gachet", "Marcela Buttini", "Diego Anselmi"];

export function TasksBoard() {
  const [tasks, setTasks] = useState<AdminTask[]>(adminTasks);
  const [selected, setSelected] = useState<AdminTask | null>(null);
  const [comment, setComment] = useState("");
  const { showToast, toastNode } = useToast();

  const resolve = (ids: string[]) => {
    setTasks((ts) => ts.map((t) => (ids.includes(t.id) ? { ...t, done: true } : t)));
    showToast(ids.length > 1 ? `${ids.length} tareas resueltas` : "Tarea resuelta");
    setSelected(null);
  };

  const reassign = (id: string, assignee: string) => {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, assignee } : t)));
    setSelected((s) => (s && s.id === id ? { ...s, assignee } : s));
    showToast(`Asignada a ${assignee}`);
  };

  const setPriority = (id: string, priority: TaskPriority) => {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, priority } : t)));
    setSelected((s) => (s && s.id === id ? { ...s, priority } : s));
  };

  const columns: Column<AdminTask>[] = [
    {
      id: "title",
      header: "Tarea",
      essential: true,
      cell: (t) => (
        <div>
          <p className={`font-semibold ${t.done ? "text-graphite-400 line-through" : "text-graphite-800"}`}>{t.title}</p>
          <p className="mt-0.5 max-w-md truncate text-xs text-graphite-500">{t.detail}</p>
        </div>
      ),
      sortValue: (t) => t.title,
    },
    { id: "cat", header: "Categoría", cell: (t) => <span className="capitalize text-graphite-600">{t.category}</span>, sortValue: (t) => t.category },
    {
      id: "prio",
      header: "Prioridad",
      essential: true,
      cell: (t) => <StatusBadge status={t.priority === "alta" ? "vencida" : t.priority === "media" ? "pendiente" : "borrador"} className="capitalize" />,
      sortValue: (t) => ({ alta: 0, media: 1, baja: 2 })[t.priority],
    },
    { id: "assignee", header: "Asignada a", cell: (t) => t.assignee, sortValue: (t) => t.assignee },
    { id: "due", header: "Vence", cell: (t) => <span className="tabular">{formatDate(t.dueDate)}</span>, sortValue: (t) => t.dueDate },
    {
      id: "estado",
      header: "Estado",
      essential: true,
      cell: (t) => <StatusBadge status={t.done ? "resuelta" : "abierta"} />,
      sortValue: (t) => (t.done ? 1 : 0),
    },
  ];

  const filters: FilterDef<AdminTask>[] = [
    { id: "prio", label: "Prioridad", options: ["alta", "media", "baja"], matches: (t, v) => t.priority === v },
    { id: "assignee", label: "Asignada a", options: assignees, matches: (t, v) => t.assignee === v },
    { id: "estado", label: "Estado", options: ["abiertas", "resueltas"], matches: (t, v) => (v === "abiertas" ? !t.done : Boolean(t.done)) },
    { id: "cat", label: "Categoría", options: [...new Set(adminTasks.map((t) => t.category))], matches: (t, v) => t.category === v },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Tareas"
        description="Todo lo que requiere atención del equipo, en un solo lugar."
        breadcrumb={[{ label: "Tareas" }]}
      />

      <DataTable
        rows={tasks}
        columns={columns}
        rowKey={(t) => t.id}
        searchKeys={(t) => `${t.title} ${t.detail} ${t.assignee} ${t.category}`}
        searchPlaceholder="Buscar tareas…"
        filters={filters}
        exportName="tareas"
        onRowClick={setSelected}
        bulkActions={[{ label: "Marcar resueltas", onApply: (rows) => resolve(rows.map((r) => r.id)) }]}
        emptyTitle="No hay tareas con esos criterios"
        emptyDetail="Probá quitar filtros, o creá una tarea desde “Nueva acción”."
      />

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.title ?? ""}>
        {selected && (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-graphite-600">{selected.detail}</p>
            <KVGrid
              items={[
                { label: "Categoría", value: <span className="capitalize">{selected.category}</span> },
                { label: "Vence", value: formatDate(selected.dueDate) },
                { label: "Estado", value: <StatusBadge status={selected.done ? "resuelta" : "abierta"} /> },
                { label: "Prioridad", value: <StatusBadge status={selected.priority === "alta" ? "vencida" : selected.priority === "media" ? "pendiente" : "borrador"} /> },
              ]}
            />
            <div>
              <label htmlFor="task-assignee" className="mb-1 block text-sm font-semibold text-graphite-800">
                Asignar a
              </label>
              <select
                id="task-assignee"
                value={selected.assignee}
                onChange={(e) => reassign(selected.id, e.target.value)}
                className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none"
              >
                {assignees.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold text-graphite-800">Prioridad</p>
              <div className="flex gap-1.5">
                {(["alta", "media", "baja"] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(selected.id, p)}
                    aria-pressed={selected.priority === p}
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize cursor-pointer transition-colors ${
                      selected.priority === p ? "bg-petrol-900 text-ivory" : "bg-graphite-100 text-graphite-600 hover:bg-petrol-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="task-comment" className="mb-1 block text-sm font-semibold text-graphite-800">
                Agregar comentario
              </label>
              <textarea
                id="task-comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                placeholder="Visible para el equipo en el historial de la tarea."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {!selected.done && (
                <AdminButton onClick={() => resolve([selected.id])}>
                  <CheckSquareIcon className="size-4" aria-hidden /> Marcar resuelta
                </AdminButton>
              )}
              {selected.relatedHref && (
                <a href={selected.relatedHref} className="inline-flex items-center rounded-[var(--radius-control)] border border-graphite-200 px-3.5 py-2 text-sm font-semibold text-petrol-900 hover:border-petrol-600">
                  Abrir registro relacionado
                </a>
              )}
              <AdminButton
                variant="ghost"
                onClick={() => {
                  if (comment.trim()) {
                    showToast("Comentario agregado");
                    setComment("");
                  }
                }}
              >
                Guardar comentario
              </AdminButton>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
