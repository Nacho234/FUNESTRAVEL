"use client";

import { useMemo, useState } from "react";
import { CaretDownIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { adminCustomers } from "@/data/admin";
import { formatDate } from "@/lib/format";

const usd = (n: number) => `USD ${n.toLocaleString("es-AR")}`;

export function CustomersTable() {
  const [query, setQuery] = useState("");
  const [openEmail, setOpenEmail] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return adminCustomers;
    return adminCustomers.filter((c) => `${c.name} ${c.email} ${c.city}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-graphite-400" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, correo o ciudad…"
            aria-label="Buscar clientes"
            className="w-full rounded-[var(--radius-control)] border border-graphite-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/25"
          />
        </div>
        <p className="text-sm text-graphite-500 tabular" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "cliente" : "clientes"}
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)]">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-graphite-500 border-b border-graphite-100">
              <th className="px-4 py-3 font-semibold">Cliente</th>
              <th className="px-4 py-3 font-semibold">Contacto</th>
              <th className="px-4 py-3 font-semibold">Ciudad</th>
              <th className="px-4 py-3 font-semibold text-right">Viajes</th>
              <th className="px-4 py-3 font-semibold text-right">Valor total</th>
              <th className="px-4 py-3 font-semibold text-right">Última reserva</th>
              <th className="px-2 py-3" aria-label="Expandir" />
            </tr>
          </thead>
          <tbody className="divide-y divide-graphite-100">
            {filtered.map((c) => {
              const open = openEmail === c.email;
              return (
                <CustomerRowGroup key={c.email}>
                  <tr className={open ? "bg-petrol-50/40" : "hover:bg-sand-50/60"}>
                    <td className="px-4 py-3 font-semibold text-graphite-800">{c.name}</td>
                    <td className="px-4 py-3 text-graphite-600">
                      {c.email}
                      <span className="block text-xs text-graphite-500">{c.phone}</span>
                    </td>
                    <td className="px-4 py-3 text-graphite-700">{c.city}</td>
                    <td className="px-4 py-3 text-right text-graphite-700 tabular">{c.trips}</td>
                    <td className="px-4 py-3 text-right font-semibold text-graphite-800 tabular">{usd(c.totalValueUsd)}</td>
                    <td className="px-4 py-3 text-right text-graphite-600 tabular">{formatDate(c.lastBooking)}</td>
                    <td className="px-2 py-3">
                      <button
                        onClick={() => setOpenEmail(open ? null : c.email)}
                        className="grid size-8 place-items-center rounded-lg text-graphite-500 hover:bg-petrol-50 hover:text-petrol-800 cursor-pointer"
                        aria-expanded={open}
                        aria-label={`${open ? "Cerrar" : "Ver"} ficha de ${c.name}`}
                      >
                        <CaretDownIcon className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
                      </button>
                    </td>
                  </tr>
                  {open && (
                    <tr className="bg-petrol-50/40">
                      <td colSpan={7} className="px-4 pb-4">
                        <div className="rounded-xl bg-white p-4 shadow-[var(--shadow-lift)]">
                          <p className="text-sm text-graphite-700">
                            <span className="font-semibold">Preferencias y notas:</span> {c.preferences}
                          </p>
                          <div className="mt-3 flex gap-2">
                            <button className="rounded-[var(--radius-control)] bg-petrol-900 px-3.5 py-2 text-sm font-semibold text-ivory hover:bg-petrol-800 cursor-pointer">
                              Ver historial
                            </button>
                            <button className="rounded-[var(--radius-control)] border border-graphite-200 px-3.5 py-2 text-sm font-semibold text-graphite-700 hover:border-petrol-600 cursor-pointer">
                              Nueva cotización
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </CustomerRowGroup>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-graphite-500">
            Ningún cliente coincide con la búsqueda.
          </p>
        )}
      </div>
    </div>
  );
}

function CustomerRowGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
