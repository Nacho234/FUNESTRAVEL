"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CaretDownIcon,
  CaretUpIcon,
  CheckCircleIcon,
  DownloadSimpleIcon,
  MagnifyingGlassIcon,
  RowsIcon,
  SquaresFourIcon,
  XIcon,
} from "@phosphor-icons/react";

/**
 * Shared backoffice UI kit: page scaffolding, status badges, generic data
 * table with the standard toolbar (search, filters, density, export, bulk
 * actions), side drawer, toasts, empty states and definition lists.
 * Every admin module builds on these so the panel stays coherent.
 */

/* ── Page scaffolding ────────────────────────────────────────────── */

export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
}: {
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6">
      {breadcrumb && (
        <nav aria-label="Miga de pan" className="mb-1.5 text-xs text-graphite-500">
          <ol className="flex flex-wrap gap-1.5">
            <li>
              <Link href="/admin" className="hover:text-petrol-800">Resumen</Link>
            </li>
            {breadcrumb.map((b) => (
              <li key={b.label} className="flex gap-1.5">
                <span aria-hidden>/</span>
                {b.href ? (
                  <Link href={b.href} className="hover:text-petrol-800">{b.label}</Link>
                ) : (
                  <span className="font-semibold text-graphite-800">{b.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-petrol-900">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-graphite-600">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-graphite-200/70 bg-white ${className}`}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-graphite-100 px-5 py-3.5">
          <div>
            {title && <h2 className="text-sm font-bold text-petrol-900">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-graphite-500">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

/* ── Status badges (shared state → tone mapping) ─────────────────── */

const statusTones: Record<string, string> = {
  // positive
  confirmada: "bg-positive-100 text-positive-700",
  aprobado: "bg-positive-100 text-positive-700",
  aprobada: "bg-positive-100 text-positive-700",
  publicado: "bg-positive-100 text-positive-700",
  publicada: "bg-positive-100 text-positive-700",
  activa: "bg-positive-100 text-positive-700",
  activo: "bg-positive-100 text-positive-700",
  pagado: "bg-positive-100 text-positive-700",
  conciliado: "bg-positive-100 text-positive-700",
  resuelta: "bg-positive-100 text-positive-700",
  completada: "bg-positive-100 text-positive-700",
  "lista para viajar": "bg-positive-100 text-positive-700",
  // warning
  "pendiente-de-pago": "bg-warning-100 text-warning-700",
  "pendiente de pago": "bg-warning-100 text-warning-700",
  "pago parcial": "bg-warning-100 text-warning-700",
  pendiente: "bg-warning-100 text-warning-700",
  "por vencer": "bg-warning-100 text-warning-700",
  "en revisión": "bg-warning-100 text-warning-700",
  "en revision": "bg-warning-100 text-warning-700",
  "en-revision": "bg-warning-100 text-warning-700",
  "documentación pendiente": "bg-warning-100 text-warning-700",
  "esperando cliente": "bg-warning-100 text-warning-700",
  "esperando proveedor": "bg-warning-100 text-warning-700",
  pausada: "bg-warning-100 text-warning-700",
  pausado: "bg-warning-100 text-warning-700",
  // danger
  vencida: "bg-danger-100 text-danger-700",
  vencido: "bg-danger-100 text-danger-700",
  rechazado: "bg-danger-100 text-danger-700",
  rechazada: "bg-danger-100 text-danger-700",
  cancelada: "bg-danger-100 text-danger-700",
  cancelado: "bg-danger-100 text-danger-700",
  bloqueado: "bg-danger-100 text-danger-700",
  agotado: "bg-danger-100 text-danger-700",
  reembolsada: "bg-danger-100 text-danger-700",
  // teal / info
  nueva: "bg-teal-50 text-teal-600",
  nuevo: "bg-teal-50 text-teal-600",
  enviada: "bg-teal-50 text-teal-600",
  abierta: "bg-teal-50 text-teal-600",
  "en curso": "bg-teal-50 text-teal-600",
  "en viaje": "bg-teal-50 text-teal-600",
  "en negociación": "bg-teal-50 text-teal-600",
  programada: "bg-teal-50 text-teal-600",
  programado: "bg-teal-50 text-teal-600",
  vista: "bg-teal-50 text-teal-600",
  // neutral
  borrador: "bg-graphite-100 text-graphite-600",
  archivada: "bg-graphite-100 text-graphite-600",
  archivado: "bg-graphite-100 text-graphite-600",
  inactivo: "bg-graphite-100 text-graphite-600",
  cerrada: "bg-graphite-100 text-graphite-600",
  "modo demo": "bg-graphite-100 text-graphite-600",
};

export function StatusBadge({ status, className = "" }: { status: string; className?: string }) {
  const tone = statusTones[status.toLowerCase()] ?? "bg-graphite-100 text-graphite-600";
  const label = status.replaceAll("-", " ");
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${tone} ${className}`}>
      {label}
    </span>
  );
}

/* ── Buttons ─────────────────────────────────────────────────────── */

export function AdminButton({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
} & React.ComponentProps<"button">) {
  const variants = {
    primary: "bg-coral-500 text-white hover:bg-coral-600",
    secondary: "border border-graphite-200 bg-white text-petrol-900 hover:border-petrol-600",
    ghost: "text-graphite-600 hover:bg-graphite-100 hover:text-petrol-900",
    danger: "border border-danger-100 bg-white text-danger-700 hover:bg-danger-100/50",
  };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-3.5 py-2 text-sm" };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-control)] font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
    />
  );
}

/* ── Toasts ──────────────────────────────────────────────────────── */

export function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);
  const node = (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2 rounded-xl bg-petrol-950 px-4 py-2.5 text-sm font-medium text-ivory shadow-[var(--shadow-float)]">
            <CheckCircleIcon weight="fill" className="size-4.5 text-positive-100" aria-hidden />
            {toast}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  return { showToast: setToast, toastNode: node };
}

/* ── Drawer (contextual side panel) ──────────────────────────────── */

export function Drawer({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={title}>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-petrol-950/50 cursor-default"
            onClick={onClose}
            aria-label="Cerrar panel"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute right-0 top-0 flex h-full ${wide ? "w-full max-w-2xl" : "w-full max-w-md"} flex-col bg-white shadow-[var(--shadow-float)]`}
          >
            <div className="flex items-center justify-between border-b border-graphite-100 px-6 py-4">
              <h2 className="font-display text-lg font-bold text-petrol-900">{title}</h2>
              <button
                onClick={onClose}
                className="grid size-9 place-items-center rounded-full hover:bg-graphite-100 cursor-pointer"
                aria-label="Cerrar"
              >
                <XIcon className="size-5" aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ── Empty state ─────────────────────────────────────────────────── */

export function EmptyState({
  icon,
  title,
  detail,
  action,
}: {
  icon?: ReactNode;
  title: string;
  detail: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-graphite-200 bg-white px-6 py-12 text-center">
      {icon && <div className="mx-auto mb-3 grid size-11 place-items-center rounded-full bg-petrol-50 text-petrol-700">{icon}</div>}
      <p className="font-semibold text-graphite-800">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-graphite-500">{detail}</p>
      {action && <div className="mt-4 flex justify-center gap-2">{action}</div>}
    </div>
  );
}

/* ── Definition list ─────────────────────────────────────────────── */

export function KVGrid({ items, cols = 2 }: { items: { label: string; value: ReactNode }[]; cols?: 2 | 3 | 4 }) {
  const colClass = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" }[cols];
  return (
    <dl className={`grid gap-x-8 gap-y-3 ${colClass}`}>
      {items.map((i) => (
        <div key={i.label}>
          <dt className="text-xs text-graphite-500">{i.label}</dt>
          <dd className="mt-0.5 text-sm font-semibold text-graphite-800">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Generic data table ──────────────────────────────────────────── */

export interface Column<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  align?: "left" | "right";
  /** hidden below lg unless essential */
  essential?: boolean;
}

export interface FilterDef<T> {
  id: string;
  label: string;
  options: string[];
  matches: (row: T, value: string) => boolean;
}

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  searchKeys,
  searchPlaceholder = "Buscar…",
  filters = [],
  bulkActions,
  onRowClick,
  exportName,
  emptyTitle = "Sin resultados",
  emptyDetail = "Probá ajustar la búsqueda o los filtros.",
  pageSize = 10,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  searchKeys?: (row: T) => string;
  searchPlaceholder?: string;
  filters?: FilterDef<T>[];
  bulkActions?: { label: string; onApply: (selected: T[]) => void }[];
  onRowClick?: (row: T) => void;
  exportName?: string;
  emptyTitle?: string;
  emptyDetail?: string;
  pageSize?: number;
}) {
  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ id: string; dir: 1 | -1 } | null>(null);
  const [dense, setDense] = useState(false);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let out = rows;
    const q = query.trim().toLowerCase();
    if (q && searchKeys) out = out.filter((r) => searchKeys(r).toLowerCase().includes(q));
    for (const f of filters) {
      const v = filterValues[f.id];
      if (v) out = out.filter((r) => f.matches(r, v));
    }
    if (sort) {
      const col = columns.find((c) => c.id === sort.id);
      if (col?.sortValue) {
        out = [...out].sort((a, b) => {
          const av = col.sortValue!(a);
          const bv = col.sortValue!(b);
          return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir;
        });
      }
    }
    return out;
  }, [rows, query, searchKeys, filters, filterValues, sort, columns]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice(page * pageSize, (page + 1) * pageSize);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pagination resets when criteria change
    setPage(0);
  }, [query, filterValues]);

  const exportCsv = () => {
    const header = columns.map((c) => c.header).join(";");
    const lines = filtered.map((r) =>
      columns
        .map((c) => {
          const el = c.sortValue ? String(c.sortValue(r)) : "";
          return `"${el.replaceAll('"', '""')}"`;
        })
        .join(";"),
    );
    const blob = new Blob([`${header}\n${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${exportName ?? "export"}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const cellPad = dense ? "px-3 py-1.5" : "px-3 py-2.5";
  const selectedRows = filtered.filter((r) => selected.has(rowKey(r)));

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {searchKeys && (
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-graphite-400" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-56 rounded-[var(--radius-control)] border border-graphite-200 bg-white py-2 pl-8 pr-3 text-sm text-graphite-800 placeholder:text-graphite-400 focus:border-teal-500 focus:outline-none"
              aria-label={searchPlaceholder}
            />
          </div>
        )}
        {filters.map((f) => (
          <select
            key={f.id}
            value={filterValues[f.id] ?? ""}
            onChange={(e) => setFilterValues((v) => ({ ...v, [f.id]: e.target.value }))}
            className="rounded-[var(--radius-control)] border border-graphite-200 bg-white px-2.5 py-2 text-sm text-graphite-700 cursor-pointer focus:border-teal-500 focus:outline-none"
            aria-label={f.label}
          >
            <option value="">{f.label}: todos</option>
            {f.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="mr-1 text-xs text-graphite-500 tabular" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "registro" : "registros"}
          </span>
          <button
            onClick={() => setDense((d) => !d)}
            className="grid size-8 place-items-center rounded-lg border border-graphite-200 text-graphite-500 hover:text-petrol-800 cursor-pointer"
            aria-label={dense ? "Densidad cómoda" : "Densidad compacta"}
            aria-pressed={dense}
          >
            {dense ? <SquaresFourIcon className="size-4" aria-hidden /> : <RowsIcon className="size-4" aria-hidden />}
          </button>
          {exportName && (
            <button
              onClick={exportCsv}
              className="flex items-center gap-1.5 rounded-lg border border-graphite-200 px-2.5 py-1.5 text-xs font-semibold text-graphite-600 hover:text-petrol-800 cursor-pointer"
            >
              <DownloadSimpleIcon className="size-4" aria-hidden /> CSV
            </button>
          )}
        </div>
      </div>

      {/* Bulk bar */}
      {bulkActions && selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg bg-petrol-50 px-3 py-2">
          <span className="text-xs font-semibold text-petrol-800 tabular">{selected.size} seleccionados</span>
          {bulkActions.map((a) => (
            <AdminButton key={a.label} size="sm" variant="secondary" onClick={() => { a.onApply(selectedRows); setSelected(new Set()); }}>
              {a.label}
            </AdminButton>
          ))}
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs font-semibold text-graphite-500 hover:text-petrol-800 cursor-pointer">
            Limpiar
          </button>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState title={emptyTitle} detail={emptyDetail} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-graphite-200/70 bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-graphite-100 bg-sand-50/50 text-left">
                {bulkActions && (
                  <th className={`${cellPad} w-8`}>
                    <input
                      type="checkbox"
                      checked={selected.size > 0 && pageRows.every((r) => selected.has(rowKey(r)))}
                      onChange={(e) => {
                        const next = new Set(selected);
                        pageRows.forEach((r) => (e.target.checked ? next.add(rowKey(r)) : next.delete(rowKey(r))));
                        setSelected(next);
                      }}
                      className="size-3.5 accent-teal-600 cursor-pointer"
                      aria-label="Seleccionar página"
                    />
                  </th>
                )}
                {columns.map((c) => (
                  <th
                    key={c.id}
                    className={`${cellPad} text-xs font-bold uppercase tracking-wide text-graphite-500 ${c.align === "right" ? "text-right" : ""} ${c.essential ? "" : "max-lg:hidden"}`}
                    aria-sort={sort?.id === c.id ? (sort.dir === 1 ? "ascending" : "descending") : undefined}
                  >
                    {c.sortValue ? (
                      <button
                        onClick={() => setSort((s) => (s?.id === c.id ? { id: c.id, dir: s.dir === 1 ? -1 : 1 } : { id: c.id, dir: 1 }))}
                        className="inline-flex items-center gap-1 hover:text-petrol-800 cursor-pointer uppercase"
                      >
                        {c.header}
                        {sort?.id === c.id &&
                          (sort.dir === 1 ? <CaretUpIcon className="size-3" aria-hidden /> : <CaretDownIcon className="size-3" aria-hidden />)}
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-100">
              {pageRows.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={onRowClick ? "cursor-pointer transition-colors hover:bg-petrol-50/40" : undefined}
                >
                  {bulkActions && (
                    <td className={cellPad} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(rowKey(row))}
                        onChange={(e) => {
                          const next = new Set(selected);
                          if (e.target.checked) next.add(rowKey(row));
                          else next.delete(rowKey(row));
                          setSelected(next);
                        }}
                        className="size-3.5 accent-teal-600 cursor-pointer"
                        aria-label="Seleccionar fila"
                      />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.id} className={`${cellPad} ${c.align === "right" ? "text-right" : ""} ${c.essential ? "" : "max-lg:hidden"}`}>
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="text-xs text-graphite-500 tabular">
            Página {page + 1} de {pages}
          </p>
          <div className="flex gap-1.5">
            <AdminButton size="sm" variant="secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Anterior
            </AdminButton>
            <AdminButton size="sm" variant="secondary" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}>
              Siguiente
            </AdminButton>
          </div>
        </div>
      )}
    </div>
  );
}
