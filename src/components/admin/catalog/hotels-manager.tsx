"use client";

import { useState } from "react";
import { PlusIcon, StarIcon } from "@phosphor-icons/react";
import { hotels } from "@/data/hotels";
import { getDestination } from "@/data/destinations";
import type { Hotel } from "@/lib/types";
import { AdminButton, DataTable, Drawer, KVGrid, PageHeader, StatusBadge, useToast, type Column, type FilterDef } from "../ui";

/** Hotels manager: general data plus an editable room table per hotel. */

interface EditableRoom {
  id: string;
  name: string;
  capacity: number;
  regime: string;
  price: number;
  available: number;
}

const inputClass =
  "w-full rounded-[var(--radius-control)] border border-graphite-200 bg-white px-2.5 py-1.5 text-sm text-graphite-800 focus:border-teal-500 focus:outline-none";

function HotelEditor({ hotel, onSaved }: { hotel: Hotel; onSaved: () => void }) {
  const [rooms, setRooms] = useState<EditableRoom[]>(
    hotel.rooms.map((r) => ({ id: r.id, name: r.name, capacity: r.capacity, regime: r.regime, price: r.pricePerNight.amount, available: r.available })),
  );

  return (
    <div className="space-y-5">
      <KVGrid
        items={[
          { label: "Destino", value: getDestination(hotel.destinationSlug)?.name ?? hotel.destinationSlug },
          { label: "Categoría", value: `${hotel.stars} estrellas` },
          { label: "Dirección", value: hotel.address },
          { label: "Check-in / out", value: `${hotel.checkIn} / ${hotel.checkOut}` },
          { label: "Rating", value: <span className="tabular">{hotel.rating.toFixed(1)} ({hotel.reviewsCount})</span> },
          { label: "Proveedor", value: "Bávaro Hotels Group" },
        ]}
        cols={2}
      />

      <div>
        <p className="mb-1.5 text-xs font-semibold text-graphite-600">Políticas</p>
        <ul className="space-y-1 text-sm text-graphite-600">
          {hotel.policies.map((p) => (
            <li key={p}>· {p}</li>
          ))}
        </ul>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-graphite-600">Habitaciones</p>
          <AdminButton
            size="sm"
            variant="secondary"
            onClick={() =>
              setRooms((rs) => [...rs, { id: `nueva-${rs.length + 1}`, name: "Nueva habitación", capacity: 2, regime: "Desayuno", price: 0, available: 0 }])
            }
          >
            <PlusIcon className="size-3.5" aria-hidden /> Agregar
          </AdminButton>
        </div>
        <div className="overflow-x-auto rounded-lg border border-graphite-100">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-graphite-100 bg-sand-50/50 text-left text-xs font-bold uppercase tracking-wide text-graphite-500">
                <th className="px-2.5 py-2">Habitación</th>
                <th className="px-2.5 py-2 text-right">Cap.</th>
                <th className="px-2.5 py-2">Régimen</th>
                <th className="px-2.5 py-2 text-right">USD/noche</th>
                <th className="px-2.5 py-2 text-right">Disp.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-100">
              {rooms.map((r, i) => (
                <tr key={r.id}>
                  <td className="px-2.5 py-2">
                    <input value={r.name} onChange={(e) => setRooms((rs) => rs.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} className={inputClass} aria-label={`Nombre habitación ${i + 1}`} />
                  </td>
                  <td className="px-2.5 py-2 text-right">
                    <input type="number" min={1} value={r.capacity} onChange={(e) => setRooms((rs) => rs.map((x, j) => (j === i ? { ...x, capacity: Number(e.target.value) } : x)))} className={`${inputClass} max-w-16 text-right tabular`} aria-label={`Capacidad de ${r.name}`} />
                  </td>
                  <td className="px-2.5 py-2">
                    <select value={r.regime} onChange={(e) => setRooms((rs) => rs.map((x, j) => (j === i ? { ...x, regime: e.target.value } : x)))} className={`${inputClass} cursor-pointer`} aria-label={`Régimen de ${r.name}`}>
                      {["Solo alojamiento", "Desayuno", "Media pensión", "Pensión completa", "All inclusive"].map((reg) => (
                        <option key={reg}>{reg}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2.5 py-2 text-right">
                    <input type="number" value={r.price} onChange={(e) => setRooms((rs) => rs.map((x, j) => (j === i ? { ...x, price: Number(e.target.value) } : x)))} className={`${inputClass} max-w-24 text-right tabular`} aria-label={`Precio por noche de ${r.name}`} />
                  </td>
                  <td className="px-2.5 py-2 text-right">
                    <input type="number" min={0} value={r.available} onChange={(e) => setRooms((rs) => rs.map((x, j) => (j === i ? { ...x, available: Number(e.target.value) } : x)))} className={`${inputClass} max-w-16 text-right tabular`} aria-label={`Disponibles de ${r.name}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t border-graphite-100 pt-4">
        <AdminButton onClick={onSaved}>Guardar cambios (demo)</AdminButton>
      </div>
    </div>
  );
}

export function HotelsManager() {
  const [selected, setSelected] = useState<Hotel | null>(null);
  const { showToast, toastNode } = useToast();

  const columns: Column<Hotel>[] = [
    {
      id: "name",
      header: "Hotel",
      essential: true,
      cell: (h) => (
        <div>
          <p className="font-semibold text-graphite-800">{h.name}</p>
          <p className="text-xs text-graphite-500">{h.address}</p>
        </div>
      ),
      sortValue: (h) => h.name,
    },
    { id: "dest", header: "Destino", cell: (h) => getDestination(h.destinationSlug)?.name ?? h.destinationSlug, sortValue: (h) => h.destinationSlug },
    {
      id: "stars",
      header: "Cat.",
      cell: (h) => (
        <span className="inline-flex items-center gap-0.5 tabular">
          {h.stars} <StarIcon weight="fill" className="size-3 text-warning-700" aria-hidden />
        </span>
      ),
      sortValue: (h) => h.stars,
    },
    { id: "rooms", header: "Habitaciones", align: "right", cell: (h) => <span className="tabular">{h.rooms.length}</span>, sortValue: (h) => h.rooms.length },
    {
      id: "price",
      header: "Desde/noche",
      align: "right",
      cell: (h) => <span className="tabular">USD {Math.min(...h.rooms.map((r) => r.pricePerNight.amount)).toLocaleString("es-AR")}</span>,
      sortValue: (h) => Math.min(...h.rooms.map((r) => r.pricePerNight.amount)),
    },
    { id: "rating", header: "Rating", align: "right", cell: (h) => <span className="tabular">{h.rating.toFixed(1)}</span>, sortValue: (h) => h.rating },
    { id: "status", header: "Estado", essential: true, cell: () => <StatusBadge status="publicado" /> },
  ];

  const filters: FilterDef<Hotel>[] = [
    {
      id: "dest",
      label: "Destino",
      options: [...new Set(hotels.map((h) => getDestination(h.destinationSlug)?.name ?? h.destinationSlug))],
      matches: (h, v) => (getDestination(h.destinationSlug)?.name ?? h.destinationSlug) === v,
    },
    { id: "stars", label: "Categoría", options: ["3", "4", "5"], matches: (h, v) => h.stars === Number(v) },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Hoteles"
        description="Hotelería propia y de operadores, con habitaciones, regímenes y tarifas por noche."
        breadcrumb={[{ label: "Hoteles" }]}
      />
      <DataTable
        rows={hotels}
        columns={columns}
        rowKey={(h) => h.slug}
        searchKeys={(h) => `${h.name} ${h.address} ${h.destinationSlug}`}
        searchPlaceholder="Buscar hoteles…"
        filters={filters}
        exportName="hoteles"
        onRowClick={setSelected}
      />
      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? ""} wide>
        {selected && <HotelEditor hotel={selected} onSaved={() => showToast("Hotel actualizado (demo)")} />}
      </Drawer>
    </div>
  );
}
