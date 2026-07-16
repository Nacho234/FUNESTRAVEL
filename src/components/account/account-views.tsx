"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AirplaneTakeoffIcon,
  CalendarBlankIcon,
  CheckCircleIcon,
  ClockIcon,
  FileArrowUpIcon,
  FilePdfIcon,
  ReceiptIcon,
  WarningCircleIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";
import { useStore, type StoredBooking } from "@/lib/store";
import { getPackage } from "@/data/packages";
import { formatDate, formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { ButtonLink, Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";

function statusBadge(status: StoredBooking["status"]) {
  return status === "confirmada" ? (
    <Badge tone="positive">Confirmada</Badge>
  ) : status === "pendiente-de-pago" ? (
    <Badge tone="warning">Pendiente de pago</Badge>
  ) : (
    <Badge tone="teal">En revisión</Badge>
  );
}

function daysUntil(dateIso: string): number {
  return Math.ceil((new Date(dateIso).getTime() - Date.now()) / 86400000);
}

function useBookingsWithData() {
  const { bookings } = useStore();
  return useMemo(
    () =>
      bookings
        .map((b) => {
          const pkg = getPackage(b.packageSlug);
          const dep = pkg?.departures.find((d) => d.id === b.departureId);
          return pkg && dep ? { booking: b, pkg, dep } : null;
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
    [bookings],
  );
}

/* ─────────────────────────── Dashboard ──────────────────────────── */

export function AccountDashboard() {
  const { user, quotes } = useStore();
  const items = useBookingsWithData();
  const upcoming = items
    .filter(({ dep }) => daysUntil(dep.date) >= 0)
    .sort((a, b) => a.dep.date.localeCompare(b.dep.date))[0];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-petrol-900">Tu resumen</h1>

      {upcoming ? (
        <section className="overflow-hidden rounded-[var(--radius-card)] bg-petrol-950 text-ivory shadow-[var(--shadow-float)]">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-petrol-100/75">Tu próximo viaje</p>
                <h2 className="mt-1 font-display text-2xl font-bold">{upcoming.pkg.name}</h2>
                <p className="mt-1 text-sm text-petrol-100/85">
                  Salida {formatDate(upcoming.dep.date)} desde {upcoming.pkg.departureCity} · reserva{" "}
                  <span className="tabular">{upcoming.booking.code}</span>
                </p>
              </div>
              <div className="rounded-xl bg-white/10 px-5 py-3 text-center">
                <p className="font-display text-3xl font-bold tabular">{daysUntil(upcoming.dep.date)}</p>
                <p className="text-xs text-petrol-100/75">días para viajar</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {statusBadge(upcoming.booking.status)}
              {upcoming.booking.status === "pendiente-de-pago" && (
                <span className="text-sm text-warning-100">Tenés un pago pendiente para asegurar el precio.</span>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/cuenta/viajes" variant="primary" size="sm">Ver el viaje completo</ButtonLink>
              <ButtonLink href="/cuenta/documentos" variant="tertiary" size="sm">Documentación</ButtonLink>
              <a
                href={`https://wa.me/5493415550123?text=${encodeURIComponent(`Hola, soy ${user?.name ?? ""}. Consulta sobre mi reserva ${upcoming.booking.code}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] px-3.5 py-2 text-sm font-semibold text-positive-100 hover:bg-white/10 transition-colors"
              >
                <WhatsappLogoIcon className="size-4.5" aria-hidden /> Hablar con tu asesora
              </a>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-[var(--radius-card)] bg-white p-8 text-center shadow-[var(--shadow-lift)]">
          <AirplaneTakeoffIcon className="mx-auto size-10 text-graphite-300" aria-hidden />
          <h2 className="mt-3 font-display text-xl font-bold text-petrol-900">Todavía no tenés viajes reservados</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-graphite-500">
            Cuando confirmes una reserva vas a ver acá la cuenta regresiva, los pagos y la documentación.
          </p>
          <ButtonLink href="/paquetes" className="mt-5">Buscar mi próximo viaje</ButtonLink>
        </section>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <section className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-petrol-900">
            <ReceiptIcon className="size-5 text-teal-600" aria-hidden /> Cotizaciones abiertas
          </h2>
          {quotes.length === 0 ? (
            <p className="mt-3 text-sm text-graphite-500">
              No tenés cotizaciones en curso.{" "}
              <Link href="/viajes-a-medida" className="font-semibold text-teal-600 hover:underline">Pedí una propuesta</Link>.
            </p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {quotes.slice(0, 3).map((q) => (
                <li key={q.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-graphite-800">{q.destination}</span>
                    <span className="text-xs text-graphite-500">{q.approxDate} · {q.travelers}</span>
                  </span>
                  <Badge tone="teal">Recibida</Badge>
                </li>
              ))}
            </ul>
          )}
          <Link href="/cuenta/cotizaciones" className="mt-4 inline-block text-sm font-semibold text-teal-600 hover:underline">
            Ver todas
          </Link>
        </section>

        <section className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-petrol-900">
            <ClockIcon className="size-5 text-teal-600" aria-hidden /> Próximas acciones
          </h2>
          <ul className="mt-3 space-y-2.5 text-sm text-graphite-600">
            {upcoming ? (
              <>
                {upcoming.booking.status === "pendiente-de-pago" && (
                  <li className="flex gap-2">
                    <WarningCircleIcon className="mt-0.5 size-4 shrink-0 text-warning-700" aria-hidden />
                    Completar el pago para confirmar la reserva {upcoming.booking.code}.
                  </li>
                )}
                <li className="flex gap-2">
                  <FileArrowUpIcon className="mt-0.5 size-4 shrink-0 text-teal-600" aria-hidden />
                  Subir la documentación de los pasajeros (DNI o pasaporte).
                </li>
                <li className="flex gap-2">
                  <CalendarBlankIcon className="mt-0.5 size-4 shrink-0 text-teal-600" aria-hidden />
                  {daysUntil(upcoming.dep.date) > 30
                    ? "Los vouchers llegan 30 días antes de la salida."
                    : "Revisá tus vouchers: ya están disponibles en Documentación."}
                </li>
              </>
            ) : (
              <li>Nada pendiente por ahora.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

/* ─────────────────────────── My trips ───────────────────────────── */

export function AccountTrips() {
  const items = useBookingsWithData();
  const upcoming = items.filter(({ dep }) => daysUntil(dep.date) >= 0);
  const past = items.filter(({ dep }) => daysUntil(dep.date) < 0);

  const TripCard = ({ item }: { item: (typeof items)[number] }) => (
    <article className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-petrol-900">{item.pkg.name}</h3>
          <p className="mt-0.5 text-sm text-graphite-600">
            {formatDate(item.dep.date)} · {item.pkg.nights} noches · {item.booking.adults + item.booking.children} pasajeros ·
            reserva <span className="tabular">{item.booking.code}</span>
          </p>
        </div>
        {statusBadge(item.booking.status)}
      </div>
      <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-graphite-500">Hotel</dt>
          <dd className="font-semibold text-graphite-800">{item.pkg.hotelName}</dd>
        </div>
        <div>
          <dt className="text-graphite-500">Transporte</dt>
          <dd className="font-semibold text-graphite-800">{item.pkg.transport} desde {item.pkg.departureCity}</dd>
        </div>
        <div>
          <dt className="text-graphite-500">Total</dt>
          <dd className="font-semibold text-graphite-800 tabular">{formatMoney({ amount: item.booking.totalUsd, currency: "USD" })}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-3">
        <ButtonLink href={`/paquetes/${item.pkg.slug}`} variant="tertiary" size="sm">Ver itinerario</ButtonLink>
        <ButtonLink href="/cuenta/documentos" variant="ghost" size="sm">Documentos y vouchers</ButtonLink>
        <a
          href={`https://wa.me/5493415550123?text=${encodeURIComponent(`Hola, consulta sobre mi reserva ${item.booking.code} (${item.pkg.name}).`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] px-3.5 py-2 text-sm font-semibold text-positive-700 hover:bg-positive-100/50 transition-colors"
        >
          <WhatsappLogoIcon className="size-4" aria-hidden /> Soporte
        </a>
      </div>
    </article>
  );

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-petrol-900">Mis viajes</h1>
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-graphite-500">Próximos</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-graphite-500">
            No tenés viajes próximos. <Link href="/paquetes" className="font-semibold text-teal-600 hover:underline">Buscá el siguiente</Link>.
          </p>
        ) : (
          <div className="mt-3 space-y-4">{upcoming.map((i) => <TripCard key={i.booking.code} item={i} />)}</div>
        )}
      </section>
      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-graphite-500">Finalizados</h2>
          <div className="mt-3 space-y-4">{past.map((i) => <TripCard key={i.booking.code} item={i} />)}</div>
        </section>
      )}
    </div>
  );
}

/* ─────────────────────────── Quotes ─────────────────────────────── */

export function AccountQuotes() {
  const { quotes } = useStore();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-petrol-900">Cotizaciones</h1>
      {quotes.length === 0 ? (
        <div className="mt-5 rounded-[var(--radius-card)] bg-white p-10 text-center shadow-[var(--shadow-lift)]">
          <ReceiptIcon className="mx-auto size-10 text-graphite-300" aria-hidden />
          <p className="mt-3 font-semibold text-graphite-800">No pediste ninguna cotización todavía</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-graphite-500">
            Contanos el viaje que imaginás y un asesor te arma una propuesta concreta en 24 horas hábiles.
          </p>
          <ButtonLink href="/viajes-a-medida" className="mt-5">Diseñar mi viaje</ButtonLink>
        </div>
      ) : (
        <ul className="mt-5 space-y-4">
          {quotes.map((q) => (
            <li key={q.id} className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-petrol-900">{q.destination}</h2>
                  <p className="mt-0.5 text-sm text-graphite-600">
                    {q.approxDate} · {q.duration} · {q.travelers} · desde {q.origin}
                  </p>
                  {q.styles.length > 0 && (
                    <p className="mt-1 text-xs text-graphite-500">Estilo: {q.styles.join(", ")}</p>
                  )}
                </div>
                <Badge tone="teal">Solicitud recibida</Badge>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-graphite-500">
                <ClockIcon className="size-3.5" aria-hidden />
                Pedida el {formatDate(q.createdAt)} · un asesor la está revisando; la propuesta llega por correo y aparece acá.
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─────────────────────────── Documents ──────────────────────────── */

interface DemoDoc {
  name: string;
  status: "aprobado" | "pendiente" | "requerido";
}

export function AccountDocuments() {
  const items = useBookingsWithData();
  const [docs, setDocs] = useState<DemoDoc[]>([
    { name: "DNI del titular (frente y dorso)", status: "requerido" },
    { name: "DNI de acompañantes", status: "requerido" },
  ]);

  const upload = (index: number) => {
    // Demo: a real implementation uploads to object storage with type/size checks.
    setDocs((d) => d.map((doc, i) => (i === index ? { ...doc, status: "pendiente" } : doc)));
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-petrol-900">Documentación</h1>

      {items.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-10 text-center shadow-[var(--shadow-lift)]">
          <FilePdfIcon className="mx-auto size-10 text-graphite-300" aria-hidden />
          <p className="mt-3 font-semibold text-graphite-800">Sin documentos por ahora</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-graphite-500">
            Al confirmar una reserva, acá vas a subir tus documentos y descargar vouchers, facturas e itinerarios.
          </p>
        </div>
      ) : (
        <>
          <section className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
            <h2 className="font-display text-lg font-bold text-petrol-900">Para subir</h2>
            <p className="mt-1 text-sm text-graphite-500">
              Formatos aceptados: JPG, PNG o PDF de hasta 10 MB. Verificamos cada documento a mano.
            </p>
            <ul className="mt-4 divide-y divide-graphite-100">
              {docs.map((doc, i) => (
                <li key={doc.name} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                  <span className="flex items-center gap-2.5 text-sm font-medium text-graphite-800">
                    {doc.status === "pendiente" ? (
                      <CheckCircleIcon weight="fill" className="size-5 text-warning-700" aria-hidden />
                    ) : (
                      <WarningCircleIcon className="size-5 text-coral-600" aria-hidden />
                    )}
                    {doc.name}
                  </span>
                  {doc.status === "pendiente" ? (
                    <Badge tone="warning">En verificación</Badge>
                  ) : (
                    <Button size="sm" variant="tertiary" onClick={() => upload(i)}>
                      <FileArrowUpIcon className="size-4" aria-hidden /> Subir archivo
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
            <h2 className="font-display text-lg font-bold text-petrol-900">Para descargar</h2>
            <ul className="mt-4 divide-y divide-graphite-100 text-sm">
              {items.map(({ booking, pkg, dep }) => (
                <li key={booking.code} className="py-3.5">
                  <p className="font-semibold text-graphite-800">{pkg.name} · <span className="tabular">{booking.code}</span></p>
                  <p className="mt-1 text-xs text-graphite-500">
                    {daysUntil(dep.date) > 30
                      ? `Los vouchers se habilitan 30 días antes de la salida (${formatDate(dep.date)}).`
                      : "Vouchers disponibles: te los enviamos también por correo."}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────── Profile ────────────────────────────── */

export function AccountProfile() {
  const { user, login } = useStore();
  const [name, setName] = useState(user?.name ?? "");
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-petrol-900">Mis datos</h1>
      <div className="mt-5 max-w-lg rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (user && name.trim().length >= 2) {
              login(name.trim(), user.email);
              setSaved(true);
              setTimeout(() => setSaved(false), 2500);
            }
          }}
          className="space-y-5"
        >
          <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="Correo electrónico" value={user?.email ?? ""} disabled hint="Para cambiar el correo de la cuenta, escribinos por WhatsApp." />
          <div className="flex items-center gap-3">
            <Button type="submit">Guardar cambios</Button>
            {saved && (
              <span className="flex items-center gap-1 text-sm font-semibold text-positive-700" role="status">
                <CheckCircleIcon weight="fill" className="size-4.5" aria-hidden /> Guardado
              </span>
            )}
          </div>
        </form>
        <div className="mt-6 border-t border-graphite-100 pt-5 text-sm text-graphite-500">
          <p className="font-semibold text-graphite-800">Pasajeros frecuentes y preferencias</p>
          <p className="mt-1 leading-relaxed">
            En producción, acá se administran los pasajeros guardados (para reservar sin recargar datos), datos fiscales
            para facturación y preferencias de comunicación.
          </p>
        </div>
      </div>
    </div>
  );
}
