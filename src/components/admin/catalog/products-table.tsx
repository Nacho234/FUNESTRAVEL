"use client";

import Link from "next/link";
import { useState } from "react";
import { StarIcon } from "@phosphor-icons/react";
import { packages } from "@/data/packages";
import { hotels } from "@/data/hotels";
import { excursions } from "@/data/excursions";
import { groupTrips } from "@/data/content";
import { getDestination } from "@/data/destinations";
import { adminInsurances, adminTransfers, productDrafts } from "@/data/admin-catalog";
import { AdminButton, DataTable, Drawer, KVGrid, PageHeader, StatusBadge, useToast, type Column, type FilterDef } from "../ui";

/** Unified catalog view: every sellable product with state and quick actions. */

interface CatalogRow {
  id: string;
  type: "Paquete" | "Hotel" | "Excursión" | "Traslado" | "Seguro" | "Grupal";
  name: string;
  destination: string;
  provider: string;
  priceFrom: string;
  status: string;
  featured: boolean;
  editorHref: string;
  publicHref?: string;
  summary: string;
}

function buildRows(): CatalogRow[] {
  const rows: CatalogRow[] = [];
  for (const p of packages) {
    const seats = p.departures.reduce((s, d) => s + d.seatsLeft, 0);
    rows.push({
      id: `pkg-${p.slug}`,
      type: "Paquete",
      name: p.name,
      destination: getDestination(p.destinationSlug)?.name ?? p.cities[0],
      provider: "Andes Operador Mayorista",
      priceFrom: `USD ${p.priceFrom.amount.toLocaleString("es-AR")}`,
      status: seats === 0 ? "agotado" : "publicado",
      featured: Boolean(p.featured),
      editorHref: `/admin/paquetes?slug=${p.slug}`,
      publicHref: `/paquetes/${p.slug}`,
      summary: p.summary,
    });
  }
  for (const h of hotels) {
    const min = Math.min(...h.rooms.map((r) => r.pricePerNight.amount));
    rows.push({
      id: `hot-${h.slug}`,
      type: "Hotel",
      name: h.name,
      destination: getDestination(h.destinationSlug)?.name ?? h.destinationSlug,
      provider: "Bávaro Hotels Group",
      priceFrom: `USD ${min.toLocaleString("es-AR")} / noche`,
      status: "publicado",
      featured: false,
      editorHref: "/admin/hoteles",
      publicHref: `/hoteles/${h.slug}`,
      summary: h.description,
    });
  }
  for (const e of excursions) {
    rows.push({
      id: `exc-${e.slug}`,
      type: "Excursión",
      name: e.name,
      destination: getDestination(e.destinationSlug)?.name ?? e.destinationSlug,
      provider: "Patagonia Receptivo SRL",
      priceFrom: `USD ${e.price.amount.toLocaleString("es-AR")}`,
      status: "publicado",
      featured: false,
      editorHref: "/admin/excursiones",
      publicHref: `/excursiones/${e.slug}`,
      summary: e.description,
    });
  }
  for (const g of groupTrips) {
    rows.push({
      id: `grp-${g.slug}`,
      type: "Grupal",
      name: g.name,
      destination: g.itinerarySummary[0] ?? "",
      provider: "Operación propia",
      priceFrom: `USD ${g.price.amount.toLocaleString("es-AR")}`,
      status: g.seatsLeft === 0 ? "agotado" : "publicado",
      featured: true,
      editorHref: "/admin/paquetes",
      publicHref: `/viajes-grupales/${g.slug}`,
      summary: g.profile,
    });
  }
  for (const t of adminTransfers) {
    rows.push({
      id: t.id,
      type: "Traslado",
      name: `${t.origin} → ${t.destination}`,
      destination: t.destination,
      provider: t.provider,
      priceFrom: `USD ${t.priceUsd.toLocaleString("es-AR")}`,
      status: t.status,
      featured: false,
      editorHref: "/admin/traslados",
      summary: `${t.kind} · ${t.vehicle}`,
    });
  }
  for (const s of adminInsurances) {
    rows.push({
      id: s.id,
      type: "Seguro",
      name: `${s.plan} (${s.company})`,
      destination: "Todos",
      provider: "Assist Total",
      priceFrom: `USD ${s.pricePerDayUsd.toLocaleString("es-AR")} / día`,
      status: s.status,
      featured: false,
      editorHref: "/admin/seguros",
      summary: `Cobertura USD ${s.coverageUsd.toLocaleString("es-AR")} · ${s.ageRange}`,
    });
  }
  for (const d of productDrafts) {
    rows.push({
      id: d.id,
      type: d.type === "Hotel" ? "Hotel" : d.type === "Excursión" ? "Excursión" : "Paquete",
      name: d.name,
      destination: d.destination,
      provider: "A definir",
      priceFrom: d.priceFromUsd ? `USD ${d.priceFromUsd.toLocaleString("es-AR")}` : "Sin tarifa",
      status: d.status,
      featured: false,
      editorHref: "/admin/paquetes",
      summary: d.note,
    });
  }
  return rows;
}

export function ProductsTable() {
  const [rows, setRows] = useState<CatalogRow[]>(buildRows);
  const [selected, setSelected] = useState<CatalogRow | null>(null);
  const { showToast, toastNode } = useToast();

  const setStatus = (ids: string[], status: string) => {
    setRows((rs) => rs.map((r) => (ids.includes(r.id) ? { ...r, status } : r)));
    showToast(status === "pausado" ? "Productos pausados" : "Productos publicados");
  };

  const toggleFeatured = (id: string) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, featured: !r.featured } : r)));
    showToast("Destacado actualizado");
  };

  const columns: Column<CatalogRow>[] = [
    { id: "type", header: "Tipo", essential: true, cell: (r) => <StatusBadge status={r.type.toLowerCase()} className="!bg-petrol-50 !text-petrol-800" />, sortValue: (r) => r.type },
    {
      id: "name",
      header: "Producto",
      essential: true,
      cell: (r) => (
        <div>
          <p className="font-semibold text-graphite-800">{r.name}</p>
          <p className="max-w-xs truncate text-xs text-graphite-500">{r.summary}</p>
        </div>
      ),
      sortValue: (r) => r.name,
    },
    { id: "destination", header: "Destino", cell: (r) => r.destination, sortValue: (r) => r.destination },
    { id: "provider", header: "Proveedor", cell: (r) => <span className="text-graphite-600">{r.provider}</span>, sortValue: (r) => r.provider },
    { id: "price", header: "Precio desde", align: "right", cell: (r) => <span className="tabular">{r.priceFrom}</span>, sortValue: (r) => r.priceFrom },
    { id: "status", header: "Estado", essential: true, cell: (r) => <StatusBadge status={r.status} />, sortValue: (r) => r.status },
    {
      id: "featured",
      header: "Destacado",
      cell: (r) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFeatured(r.id);
          }}
          className="cursor-pointer"
          aria-pressed={r.featured}
          aria-label={r.featured ? `Quitar destacado a ${r.name}` : `Destacar ${r.name}`}
        >
          <StarIcon weight={r.featured ? "fill" : "regular"} className={`size-4.5 ${r.featured ? "text-warning-700" : "text-graphite-300 hover:text-graphite-500"}`} aria-hidden />
        </button>
      ),
      sortValue: (r) => (r.featured ? 0 : 1),
    },
  ];

  const filters: FilterDef<CatalogRow>[] = [
    { id: "type", label: "Tipo", options: ["Paquete", "Hotel", "Excursión", "Traslado", "Seguro", "Grupal"], matches: (r, v) => r.type === v },
    { id: "status", label: "Estado", options: ["publicado", "borrador", "pausado", "agotado"], matches: (r, v) => r.status === v },
    { id: "dest", label: "Destino", options: [...new Set(buildRows().map((r) => r.destination))].sort(), matches: (r, v) => r.destination === v },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Productos"
        description="Todo el catálogo vendible en una sola vista: paquetes, hoteles, excursiones, traslados, seguros y salidas grupales."
        breadcrumb={[{ label: "Productos" }]}
      />
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(r) => r.id}
        searchKeys={(r) => `${r.name} ${r.destination} ${r.provider} ${r.type}`}
        searchPlaceholder="Buscar productos…"
        filters={filters}
        exportName="productos"
        onRowClick={setSelected}
        bulkActions={[
          { label: "Pausar", onApply: (rs) => setStatus(rs.map((r) => r.id), "pausado") },
          { label: "Publicar", onApply: (rs) => setStatus(rs.map((r) => r.id), "publicado") },
        ]}
        pageSize={12}
      />

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? ""}>
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={selected.type.toLowerCase()} className="!bg-petrol-50 !text-petrol-800" />
              <StatusBadge status={selected.status} />
              {selected.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-warning-100 px-2.5 py-0.5 text-xs font-semibold text-warning-700">
                  <StarIcon weight="fill" className="size-3" aria-hidden /> Destacado
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-graphite-600">{selected.summary}</p>
            <KVGrid
              items={[
                { label: "Destino", value: selected.destination },
                { label: "Proveedor", value: selected.provider },
                { label: "Precio desde", value: <span className="tabular">{selected.priceFrom}</span> },
                { label: "Visibilidad", value: selected.status === "publicado" ? "Visible en el sitio" : "No visible" },
              ]}
            />
            <div className="flex flex-wrap gap-2">
              <Link
                href={selected.editorHref}
                className="inline-flex items-center rounded-[var(--radius-control)] bg-coral-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-coral-600"
              >
                Abrir editor
              </Link>
              {selected.publicHref && (
                <Link
                  href={selected.publicHref}
                  target="_blank"
                  className="inline-flex items-center rounded-[var(--radius-control)] border border-graphite-200 px-3.5 py-2 text-sm font-semibold text-petrol-900 hover:border-petrol-600"
                >
                  Ver en el sitio
                </Link>
              )}
              <AdminButton
                variant="secondary"
                onClick={() => {
                  setStatus([selected.id], selected.status === "pausado" ? "publicado" : "pausado");
                  setSelected(null);
                }}
              >
                {selected.status === "pausado" ? "Publicar" : "Pausar"}
              </AdminButton>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
