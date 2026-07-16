import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CalendarCheckIcon,
  ChalkboardTeacherIcon,
  InfoIcon,
  MapPinIcon,
  UsersThreeIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { groupTrips } from "@/data/content";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { formatArs, formatDate, formatDateLong, formatMoney } from "@/lib/format";

export function generateStaticParams() {
  return groupTrips.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = groupTrips.find((t) => t.slug === slug);
  if (!trip) return { title: "Salida no encontrada" };
  return {
    title: trip.name,
    description: `Salida grupal confirmada el ${formatDate(trip.confirmedDate)} desde ${trip.departureCity}, con coordinador. ${trip.itinerarySummary.join(", ")}.`,
  };
}

export default async function GroupTripDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = groupTrips.find((t) => t.slug === slug);
  if (!trip) notFound();

  const waText = encodeURIComponent(
    `Hola, quisiera reservar lugar en la salida grupal ${trip.name} del ${formatDate(trip.confirmedDate)}. ¿Sigue habiendo disponibilidad?`,
  );

  const keyData = [
    { icon: ChalkboardTeacherIcon, label: "Coordinador", value: trip.coordinator },
    { icon: CalendarCheckIcon, label: "Duración", value: `${trip.days} días` },
    { icon: MapPinIcon, label: "Salida desde", value: trip.departureCity },
    { icon: UsersThreeIcon, label: "Cupos", value: `Quedan ${trip.seatsLeft} de ${trip.totalSeats} lugares` },
  ];

  return (
    <div className="pt-28 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav aria-label="Migas de pan" className="text-sm text-graphite-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/viajes-grupales" className="hover:text-petrol-800">Viajes grupales</Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-graphite-800">{trip.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <div className="relative mt-5 h-72 overflow-hidden rounded-[var(--radius-card)] sm:h-96">
          <Image
            src={trip.image}
            alt={trip.name}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-petrol-950/75 via-transparent to-transparent" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <Badge tone="positive">Salida confirmada · {formatDate(trip.confirmedDate)}</Badge>
            <h1 className="mt-2 max-w-3xl font-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              {trip.name}
            </h1>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="min-w-0">
            <section>
              <h2 className="font-display text-xl font-bold text-petrol-900">Datos de la salida</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                {keyData.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 rounded-[var(--radius-card)] border border-graphite-100 bg-white p-4">
                    <Icon className="mt-0.5 size-5 shrink-0 text-teal-600" aria-hidden />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-graphite-500">{label}</dt>
                      <dd className="mt-0.5 text-sm font-semibold text-graphite-800">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <div className="mt-4 rounded-[var(--radius-card)] bg-teal-50 p-5">
                <p className="text-sm font-semibold text-petrol-900">Perfil recomendado</p>
                <p className="mt-1 text-sm leading-relaxed text-graphite-700">{trip.profile}</p>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-display text-xl font-bold text-petrol-900">Itinerario resumido</h2>
              <ol className="mt-5 space-y-0">
                {trip.itinerarySummary.map((stage, i) => (
                  <li key={stage} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < trip.itinerarySummary.length - 1 && (
                      <span className="absolute left-[15px] top-8 bottom-0 w-px bg-graphite-200" aria-hidden />
                    )}
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-petrol-900 font-display text-sm font-bold text-ivory tabular">
                      {i + 1}
                    </span>
                    <p className="pt-1 font-semibold text-graphite-800">{stage}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm text-graphite-600 max-w-[70ch]">
                El itinerario día por día, con hoteles y visitas incluidas, se entrega en la reunión
                informativa y queda disponible en tu cuenta al reservar.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="font-display text-xl font-bold text-petrol-900">Reunión informativa</h2>
              <p className="mt-3 flex items-start gap-2 text-graphite-700 leading-relaxed max-w-[70ch]">
                <InfoIcon className="mt-1 size-5 shrink-0 text-teal-600" aria-hidden />
                {trip.infoMeeting}. Si no podés asistir, te enviamos el material y coordinamos una
                videollamada con el coordinador.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="font-display text-xl font-bold text-petrol-900">Condiciones</h2>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-graphite-700">
                <li className="flex gap-2">
                  <InfoIcon className="mt-0.5 size-4 shrink-0 text-graphite-400" aria-hidden />
                  El lugar se bloquea con una seña de USD 500 por persona; el saldo se abona hasta 35 días antes de la salida.
                </li>
                <li className="flex gap-2">
                  <InfoIcon className="mt-0.5 size-4 shrink-0 text-graphite-400" aria-hidden />
                  Precio por persona en base doble. Consultá el suplemento por habitación individual y las promociones para tercera persona.
                </li>
                <li className="flex gap-2">
                  <InfoIcon className="mt-0.5 size-4 shrink-0 text-graphite-400" aria-hidden />
                  Cancelando más de 60 días antes de la salida se reintegra la seña completa; después aplican los gastos de los servicios ya confirmados.
                </li>
              </ul>
            </section>
          </div>

          {/* Sticky booking panel */}
          <aside>
            <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)] lg:sticky lg:top-28">
              <p className="text-sm font-semibold text-graphite-700">
                Sale el {formatDateLong(trip.confirmedDate)}
              </p>
              <p className="mt-3 text-xs text-graphite-500">Desde</p>
              <p className="font-display text-3xl font-bold text-petrol-900 tabular leading-tight">
                {formatMoney(trip.price)}
                <span className="font-sans text-sm font-normal text-graphite-500"> por persona</span>
              </p>
              <p className="mt-1 text-xs text-graphite-500">En base doble · más impuestos</p>
              {trip.installments && (
                <p className="mt-1.5 text-sm font-semibold text-positive-700 tabular">
                  {trip.installments.count} cuotas desde {formatArs(trip.installments.approxArs)}
                </p>
              )}
              <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-coral-700">
                <UsersThreeIcon className="size-4.5" aria-hidden />
                Quedan {trip.seatsLeft} lugares
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/5493415550123?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-5 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-coral-600"
                >
                  <WhatsappLogoIcon className="size-5" aria-hidden />
                  Reservar mi lugar
                </a>
                <ButtonLink href="/contacto" variant="tertiary">
                  Prefiero que me llamen
                </ButtonLink>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-graphite-500">
                Seña de USD 500 por persona. Sin cargos ocultos: el detalle completo se firma antes de pagar.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
