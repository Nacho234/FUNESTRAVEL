"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarBlankIcon,
  CheckCircleIcon,
  MinusIcon,
  PlusIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";
import type { TravelPackage } from "@/lib/types";
import { formatArs, formatDate, formatMoney } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

export function computeTotal(pkg: TravelPackage, departureId: string, adults: number, children: number) {
  const dep = pkg.departures.find((d) => d.id === departureId) ?? pkg.departures[0];
  const base = dep.pricePerPerson.amount;
  const childPrice = Math.round(base * (1 - pkg.childDiscountPct / 100));
  const single = adults === 1 && children === 0 ? Math.round((base * pkg.singleSupplementPct) / 100) : 0;
  return {
    departure: dep,
    perAdult: base,
    perChild: childPrice,
    singleSupplement: single,
    total: base * adults + childPrice * children + single,
  };
}

function Stepper({
  label,
  hint,
  value,
  set,
  min,
  max,
}: {
  label: string;
  hint: string;
  value: number;
  set: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-semibold text-graphite-800">{label}</p>
        <p className="text-xs text-graphite-500">{hint}</p>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => set(Math.max(min, value - 1))}
          disabled={value <= min}
          className="grid size-8 place-items-center rounded-full border border-graphite-200 text-graphite-600 hover:border-teal-500 hover:text-teal-600 disabled:opacity-35 cursor-pointer transition-colors"
          aria-label={`Quitar ${label.toLowerCase()}`}
        >
          <MinusIcon className="size-3.5" aria-hidden />
        </button>
        <span className="w-5 text-center text-sm font-bold tabular">{value}</span>
        <button
          type="button"
          onClick={() => set(Math.min(max, value + 1))}
          disabled={value >= max}
          className="grid size-8 place-items-center rounded-full border border-graphite-200 text-graphite-600 hover:border-teal-500 hover:text-teal-600 disabled:opacity-35 cursor-pointer transition-colors"
          aria-label={`Agregar ${label.toLowerCase()}`}
        >
          <PlusIcon className="size-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export function BookingPanel({ pkg }: { pkg: TravelPackage }) {
  const router = useRouter();
  const { setDraft } = useStore();
  const [departureId, setDepartureId] = useState(pkg.departures[0]?.id ?? "");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [starting, setStarting] = useState(false);

  const calc = useMemo(() => computeTotal(pkg, departureId, adults, children), [pkg, departureId, adults, children]);
  const soldOut = calc.departure.seatsLeft === 0;
  const notEnoughSeats = adults + children > calc.departure.seatsLeft;

  const reserve = () => {
    setStarting(true);
    setDraft({ packageSlug: pkg.slug, departureId: calc.departure.id, adults, children, extras: [] });
    router.push("/checkout");
  };

  const waText = encodeURIComponent(
    `Hola, estoy viendo el paquete ${pkg.name} de ${pkg.nights} noches para la salida del ${formatDate(calc.departure.date)}. Quisiera consultar disponibilidad para ${adults} ${adults === 1 ? "adulto" : "adultos"}${children ? ` y ${children} ${children === 1 ? "menor" : "menores"}` : ""}.`,
  );

  return (
    <>
      <div id="reserva" className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-float)] scroll-mt-28">
        <h2 className="font-display text-lg font-bold text-petrol-900">Armá tu reserva</h2>

        {/* Departure picker */}
        <fieldset className="mt-4">
          <legend className="flex items-center gap-1.5 text-sm font-semibold text-graphite-800">
            <CalendarBlankIcon className="size-4 text-graphite-500" aria-hidden /> Fecha de salida
          </legend>
          <div className="mt-2 space-y-2">
            {pkg.departures.map((dep) => {
              const selected = dep.id === departureId;
              return (
                <label
                  key={dep.id}
                  className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 transition-colors ${
                    selected ? "border-teal-500 bg-teal-50/50" : "border-graphite-200 hover:border-graphite-400"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="departure"
                      checked={selected}
                      onChange={() => setDepartureId(dep.id)}
                      className="accent-teal-600"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-graphite-800">{formatDate(dep.date)}</span>
                      <span className={`block text-xs ${dep.seatsLeft <= 6 ? "font-semibold text-coral-700" : "text-graphite-500"}`}>
                        {dep.seatsLeft === 0 ? "Sin lugares" : dep.seatsLeft <= 6 ? `Quedan ${dep.seatsLeft} lugares` : "Lugares disponibles"}
                        {dep.confirmed && " · salida confirmada"}
                      </span>
                    </span>
                  </span>
                  <span className="text-sm font-bold text-petrol-900 tabular">{formatMoney(dep.pricePerPerson)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Travelers */}
        <div className="mt-4 divide-y divide-graphite-100 border-y border-graphite-100">
          <Stepper label="Adultos" hint="Desde 12 años" value={adults} set={setAdults} min={1} max={8} />
          <Stepper
            label="Menores"
            hint={pkg.childDiscountPct > 0 ? `2 a 11 años · ${pkg.childDiscountPct}% de descuento` : "2 a 11 años"}
            value={children}
            set={setChildren}
            min={0}
            max={6}
          />
        </div>

        {/* Price breakdown */}
        <dl className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-graphite-600">
              {adults} {adults === 1 ? "adulto" : "adultos"} × {formatMoney({ amount: calc.perAdult, currency: pkg.priceFrom.currency })}
            </dt>
            <dd className="font-semibold text-graphite-800 tabular">
              {formatMoney({ amount: calc.perAdult * adults, currency: pkg.priceFrom.currency })}
            </dd>
          </div>
          {children > 0 && (
            <div className="flex justify-between">
              <dt className="text-graphite-600">
                {children} {children === 1 ? "menor" : "menores"} × {formatMoney({ amount: calc.perChild, currency: pkg.priceFrom.currency })}
              </dt>
              <dd className="font-semibold text-graphite-800 tabular">
                {formatMoney({ amount: calc.perChild * children, currency: pkg.priceFrom.currency })}
              </dd>
            </div>
          )}
          {calc.singleSupplement > 0 && (
            <div className="flex justify-between">
              <dt className="text-graphite-600">Suplemento habitación individual</dt>
              <dd className="font-semibold text-graphite-800 tabular">
                {formatMoney({ amount: calc.singleSupplement, currency: pkg.priceFrom.currency })}
              </dd>
            </div>
          )}
          <div className="flex items-baseline justify-between border-t border-graphite-100 pt-2.5">
            <dt className="font-semibold text-graphite-800">Total estimado</dt>
            <dd className="font-display text-2xl font-bold text-petrol-900 tabular">
              {formatMoney({ amount: calc.total, currency: pkg.priceFrom.currency })}
            </dd>
          </div>
        </dl>
        <p className="mt-1 text-xs text-graphite-500">
          {pkg.taxesIncluded ? "Impuestos incluidos." : "Más impuestos y percepciones vigentes."}{" "}
          {pkg.installments && `Financiable en ${pkg.installments.count} cuotas desde ${formatArs(pkg.installments.approxArs)} por persona.`}
        </p>

        {calc.singleSupplement > 0 && (
          <p className="mt-2 rounded-lg bg-sand-50 px-3 py-2 text-xs text-graphite-600">
            Viajás solo: se aplica suplemento individual del {pkg.singleSupplementPct}%. Si sumás un acompañante, desaparece.
          </p>
        )}

        {notEnoughSeats && !soldOut && (
          <p className="mt-3 rounded-lg bg-warning-100 px-3 py-2 text-xs font-medium text-warning-700" role="alert">
            Esta salida tiene solo {calc.departure.seatsLeft} lugares. Elegí otra fecha o consultanos por lista de espera.
          </p>
        )}

        {/* CTAs */}
        <div className="mt-5 space-y-2.5">
          <button
            onClick={reserve}
            disabled={soldOut || notEnoughSeats || starting}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-control)] bg-coral-500 py-3 text-[0.9375rem] font-bold text-white transition-colors hover:bg-coral-600 disabled:opacity-50 cursor-pointer"
          >
            {starting ? "Preparando tu reserva…" : soldOut ? "Sin lugares en esta fecha" : "Reservar esta salida"}
          </button>
          <a
            href={`https://wa.me/5493415550123?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-control)] border border-graphite-200 bg-white py-3 text-[0.9375rem] font-semibold text-petrol-900 transition-colors hover:border-positive-700 hover:text-positive-700"
          >
            <WhatsappLogoIcon className="size-4.5" aria-hidden /> Consultar antes de reservar
          </a>
        </div>

        <ul className="mt-4 space-y-1.5 text-xs text-graphite-500">
          <li className="flex items-center gap-1.5">
            <CheckCircleIcon className="size-3.5 text-positive-700" aria-hidden /> Se reserva con seña, el saldo hasta 35 días antes
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircleIcon className="size-3.5 text-positive-700" aria-hidden /> Precio final validado por un asesor antes de pagar
          </li>
        </ul>
      </div>

      {/* Mobile persistent bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-graphite-100 bg-white/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div>
          <p className="text-xs text-graphite-500">Desde</p>
          <p className="font-display text-lg font-bold text-petrol-900 tabular leading-tight">
            {formatMoney(calc.departure.pricePerPerson)}
            <span className="text-xs font-normal text-graphite-500 font-sans"> p/persona</span>
          </p>
          {calc.departure.seatsLeft <= 6 && calc.departure.seatsLeft > 0 && (
            <Badge tone="warning" className="mt-0.5">Quedan {calc.departure.seatsLeft}</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <a
            href={`https://wa.me/5493415550123?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="grid size-11 place-items-center rounded-[var(--radius-control)] border border-graphite-200 text-positive-700"
            aria-label="Consultar por WhatsApp"
          >
            <WhatsappLogoIcon className="size-5" aria-hidden />
          </a>
          <a
            href="#reserva"
            className="flex items-center rounded-[var(--radius-control)] bg-coral-500 px-5 text-sm font-bold text-white"
          >
            Reservar
          </a>
        </div>
      </div>
    </>
  );
}
