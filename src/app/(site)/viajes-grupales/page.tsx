import Image from "next/image";
import type { Metadata } from "next";
import {
  CalendarCheckIcon,
  ChalkboardTeacherIcon,
  UsersThreeIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { groupTrips } from "@/data/content";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { formatArs, formatDate, formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Viajes grupales acompañados",
  description:
    "Salidas grupales con coordinador de Funes Travel: fechas confirmadas, grupos reducidos, reunión informativa previa y acompañamiento durante todo el viaje.",
};

const pillars = [
  {
    icon: ChalkboardTeacherIcon,
    title: "Coordinador de la agencia",
    text: "Viaja con el grupo desde la salida hasta el regreso. Resuelve en el momento y conoce el itinerario de memoria.",
  },
  {
    icon: CalendarCheckIcon,
    title: "Fechas confirmadas",
    text: "Las salidas publicadas están garantizadas: no dependen de que se llene el cupo para operar.",
  },
  {
    icon: UsersThreeIcon,
    title: "Grupos reducidos y reunión previa",
    text: "Máximo 40 personas según el destino, con reunión informativa (o grupo de WhatsApp) antes de viajar para conocerse y despejar dudas.",
  },
];

export default function GroupTripsPage() {
  return (
    <div className="pt-28 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900">
            Viajar acompañado, sin resignar el viaje que querés
          </h1>
          <p className="mt-3 text-graphite-600 leading-relaxed">
            Las salidas grupales son para quienes prefieren no viajar solos: primeros viajes largos,
            personas que viajan sin compañía o grupos de amigas que quieren todo resuelto. El itinerario
            está armado, el coordinador viaja con el grupo y vos solo te ocupás de disfrutar.
          </p>
        </header>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border-t-2 border-teal-500 pt-5">
              <Icon className="size-7 text-teal-600" aria-hidden />
              <h2 className="mt-3 font-display text-lg font-bold text-petrol-900">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-graphite-600">{text}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-petrol-900">
          Próximas salidas
        </h2>

        <div className="mt-6 space-y-6">
          {groupTrips.map((trip) => {
            const waText = encodeURIComponent(
              `Hola, quisiera consultar disponibilidad para la salida grupal ${trip.name} del ${formatDate(trip.confirmedDate)}.`,
            );
            return (
              <article
                key={trip.slug}
                className="grid overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)] lg:grid-cols-[320px_1fr_auto]"
              >
                <div className="relative h-48 lg:h-full lg:min-h-64">
                  <Image
                    src={trip.image}
                    alt={trip.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover"
                  />
                  <Badge tone="positive" className="absolute left-3 top-3">Salida confirmada</Badge>
                </div>
                <div className="p-6 lg:p-7">
                  <h3 className="font-display text-xl font-bold text-petrol-900">{trip.name}</h3>
                  <p className="mt-2 text-sm font-medium text-graphite-700">
                    {trip.itinerarySummary.join(" · ")}
                  </p>
                  <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                    <div className="flex gap-1.5">
                      <dt className="text-graphite-500">Salida:</dt>
                      <dd className="font-semibold text-graphite-800">
                        {formatDate(trip.confirmedDate)} · {trip.days} días
                      </dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="text-graphite-500">Desde:</dt>
                      <dd className="font-semibold text-graphite-800">{trip.departureCity}</dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="text-graphite-500">Coordina:</dt>
                      <dd className="font-semibold text-graphite-800">{trip.coordinator}</dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="text-graphite-500">Perfil:</dt>
                      <dd className="font-semibold text-graphite-800">{trip.profile}</dd>
                    </div>
                  </dl>
                  <p className="mt-3.5 flex items-center gap-1.5 text-sm font-semibold text-coral-700">
                    <UsersThreeIcon className="size-4.5" aria-hidden />
                    Quedan {trip.seatsLeft} lugares de {trip.totalSeats}
                  </p>
                  <p className="mt-2 flex items-start gap-1.5 text-sm text-graphite-600">
                    <CalendarCheckIcon className="mt-0.5 size-4.5 shrink-0 text-teal-600" aria-hidden />
                    {trip.infoMeeting}
                  </p>
                </div>
                <div className="flex flex-row items-end justify-between gap-4 border-t border-graphite-100 p-6 lg:flex-col lg:items-end lg:border-t-0 lg:border-l lg:p-7 lg:text-right">
                  <div>
                    <p className="text-xs text-graphite-500">Desde</p>
                    <p className="font-display text-2xl font-bold text-petrol-900 tabular leading-tight">
                      {formatMoney(trip.price)}
                    </p>
                    <p className="text-xs text-graphite-500">por persona, base doble</p>
                    {trip.installments && (
                      <p className="mt-1 text-xs font-semibold text-positive-700 tabular">
                        {trip.installments.count} cuotas desde {formatArs(trip.installments.approxArs)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-stretch gap-2.5">
                    <a
                      href={`https://wa.me/5493415550123?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coral-600 whitespace-nowrap"
                    >
                      <WhatsappLogoIcon className="size-4.5" aria-hidden />
                      Consultar disponibilidad
                    </a>
                    <ButtonLink href={`/viajes-grupales/${trip.slug}`} variant="tertiary" size="sm">
                      Ver itinerario
                    </ButtonLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 rounded-[var(--radius-card)] bg-sand-100 p-8 text-center">
          <h2 className="font-display text-xl font-bold text-petrol-900">
            ¿Tenés un grupo armado de 10 o más personas?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-graphite-600">
            Armamos salidas exclusivas para clubes, empresas, egresados y familias grandes, con precio
            especial de grupo y coordinador si el destino lo amerita.
          </p>
          <ButtonLink href="/viajes-a-medida" className="mt-5">
            Pedir propuesta para mi grupo
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
