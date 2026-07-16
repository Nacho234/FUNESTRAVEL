import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  BackpackIcon,
  CalendarBlankIcon,
  CheckIcon,
  ClockIcon,
  CloudSunIcon,
  MapPinIcon,
  MountainsIcon,
  TranslateIcon,
  UsersIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { excursions, getExcursion } from "@/data/excursions";
import { destinations } from "@/data/destinations";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";

export function generateStaticParams() {
  return excursions.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = getExcursion(slug);
  if (!e) return { title: "Excursión no encontrada" };
  return {
    title: e.name,
    description: e.description.slice(0, 155),
  };
}

const difficultyTone: Record<string, "positive" | "warning" | "danger"> = {
  Baja: "positive",
  Moderada: "warning",
  Alta: "danger",
};

export default async function ExcursionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = getExcursion(slug);
  if (!e) notFound();

  const dest = destinations.find((d) => d.slug === e.destinationSlug);
  const waText = encodeURIComponent(
    `Hola, quisiera consultar disponibilidad para la excursión ${e.name}${dest ? ` en ${dest.name}` : ""}.`,
  );

  const practicalData = [
    { icon: ClockIcon, label: "Duración", value: e.duration },
    { icon: TranslateIcon, label: "Idioma", value: e.language },
    { icon: MapPinIcon, label: "Punto de encuentro", value: e.meetingPoint },
    { icon: CalendarBlankIcon, label: "Horarios", value: e.schedule },
    { icon: MountainsIcon, label: "Dificultad", value: e.difficulty },
    { icon: UsersIcon, label: "Edad mínima", value: e.minAge === 0 ? "Apta para todas las edades" : `Desde ${e.minAge} años` },
  ];

  return (
    <div className="pt-28 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav aria-label="Migas de pan" className="text-sm text-graphite-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/excursiones" className="hover:text-petrol-800">Excursiones</Link>
            </li>
            <li aria-hidden>/</li>
            {dest && (
              <>
                <li>
                  <Link href={`/destinos/${dest.slug}`} className="hover:text-petrol-800">{dest.name}</Link>
                </li>
                <li aria-hidden>/</li>
              </>
            )}
            <li className="font-medium text-graphite-800">{e.name}</li>
          </ol>
        </nav>

        <div className="relative mt-5 h-72 overflow-hidden rounded-[var(--radius-card)] sm:h-96">
          <Image
            src={e.image}
            alt={e.name}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-petrol-950/70 via-transparent to-transparent" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="petrol" className="bg-white/90">{e.category}</Badge>
              <Badge tone={difficultyTone[e.difficulty]}>Dificultad {e.difficulty.toLowerCase()}</Badge>
            </div>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {e.name}
            </h1>
            {dest && (
              <p className="mt-1 flex items-center gap-1.5 text-white/85">
                <MapPinIcon className="size-4" aria-hidden />
                {dest.name}, {dest.country}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="min-w-0">
            <div className="flex items-center gap-4">
              <Rating value={e.rating} count={e.reviewsCount} />
            </div>
            <p className="mt-4 leading-relaxed text-graphite-700 max-w-[70ch]">{e.description}</p>

            <section className="mt-8">
              <h2 className="font-display text-xl font-bold text-petrol-900">Datos prácticos</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                {practicalData.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 rounded-[var(--radius-card)] border border-graphite-100 bg-white p-4">
                    <Icon className="mt-0.5 size-5 shrink-0 text-teal-600" aria-hidden />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-graphite-500">{label}</dt>
                      <dd className="mt-0.5 text-sm font-semibold text-graphite-800">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="font-display text-xl font-bold text-petrol-900">Qué incluye</h2>
                <ul className="mt-4 space-y-2.5">
                  {e.includes.map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-relaxed text-graphite-700">
                      <CheckIcon weight="bold" className="mt-0.5 size-4 shrink-0 text-positive-700" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-petrol-900">Qué llevar</h2>
                <ul className="mt-4 space-y-2.5">
                  {e.bring.map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-relaxed text-graphite-700">
                      <BackpackIcon className="mt-0.5 size-4 shrink-0 text-graphite-400" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="mt-8 rounded-[var(--radius-card)] bg-teal-50 p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-petrol-900">
                <CloudSunIcon className="size-5 text-teal-600" aria-hidden />
                Si el clima no acompaña
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-graphite-700 max-w-[65ch]">{e.weatherPolicy}</p>
            </section>
          </div>

          <aside>
            <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)] lg:sticky lg:top-28">
              <p className="text-xs text-graphite-500">Desde</p>
              <p className="font-display text-3xl font-bold text-petrol-900 tabular leading-tight">
                {formatMoney(e.price)}
                <span className="font-sans text-sm font-normal text-graphite-500"> por persona</span>
              </p>
              <p className="mt-1 text-xs text-graphite-500">Impuestos incluidos · se abona en destino o al reservar</p>
              <div className="mt-5 flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/5493415550123?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] bg-coral-500 px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-coral-600"
                >
                  <WhatsappLogoIcon className="size-4.5" aria-hidden />
                  Consultar disponibilidad
                </a>
                <ButtonLink href="/viajes-a-medida" variant="tertiary">
                  Agregar a mi viaje
                </ButtonLink>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-graphite-500">
                Si ya tenés una reserva con nosotros, mencionala en el mensaje y la sumamos a tu itinerario.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
