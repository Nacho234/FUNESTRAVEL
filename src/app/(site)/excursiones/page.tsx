import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ClockIcon, MagnifyingGlassIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import { excursions } from "@/data/excursions";
import { destinations } from "@/data/destinations";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { formatMoney, plural } from "@/lib/format";

export const metadata: Metadata = {
  title: "Excursiones y actividades",
  description:
    "Excursiones con guía, cupos reales y política climática clara: canal Beagle, Cataratas, bodegas del Valle de Uco, Isla Saona y más.",
};

const categories = ["Naturaleza", "Cultura", "Aventura", "Gastronomía", "Náutica"] as const;

const difficultyTone: Record<string, "positive" | "warning" | "danger"> = {
  Baja: "positive",
  Moderada: "warning",
  Alta: "danger",
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default async function ExcursionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const destino = typeof sp.destino === "string" ? sp.destino.trim() : "";
  const categoria = typeof sp.categoria === "string" ? sp.categoria : "";

  let results = excursions;
  if (destino) {
    const q = normalize(destino);
    const matchedSlugs = destinations
      .filter((d) => normalize(`${d.name} ${d.country}`).includes(q))
      .map((d) => d.slug);
    results = results.filter(
      (e) => matchedSlugs.includes(e.destinationSlug) || normalize(e.name).includes(q),
    );
  }
  if (categoria) {
    results = results.filter((e) => e.category === categoria);
  }

  const chipHref = (cat?: string) => {
    const params = new URLSearchParams();
    if (destino) params.set("destino", destino);
    if (cat) params.set("categoria", cat);
    const qs = params.toString();
    return qs ? `/excursiones?${qs}` : "/excursiones";
  };

  return (
    <div className="pt-28 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900">
            Excursiones que valen el día
          </h1>
          <p className="mt-2 text-graphite-600">
            Guías habilitados, punto de encuentro claro y política climática por escrito. Podés
            sumarlas a un paquete o reservarlas sueltas.
          </p>
        </header>

        {destino && (
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[var(--radius-card)] bg-white px-5 py-3.5 shadow-[var(--shadow-lift)] text-sm">
            <MagnifyingGlassIcon className="size-4.5 text-teal-600" aria-hidden />
            <span className="font-semibold text-graphite-800">Destino:</span>
            <span className="text-graphite-600">{destino}</span>
            <Link href={chipHref()} className="ml-auto font-semibold text-teal-600 hover:text-teal-500">
              Quitar filtro de destino
            </Link>
          </div>
        )}

        {/* Category chips */}
        <nav aria-label="Filtrar por categoría" className="mt-6 flex flex-wrap gap-2">
          <Link
            href={chipHref()}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              !categoria ? "bg-petrol-900 text-ivory" : "bg-graphite-100 text-graphite-600 hover:bg-petrol-50"
            }`}
            aria-current={!categoria ? "true" : undefined}
          >
            Todas
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={chipHref(cat)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                categoria === cat ? "bg-petrol-900 text-ivory" : "bg-graphite-100 text-graphite-600 hover:bg-petrol-50"
              }`}
              aria-current={categoria === cat ? "true" : undefined}
            >
              {cat}
            </Link>
          ))}
        </nav>

        <p className="mt-5 text-sm text-graphite-500">
          {plural(results.length, "excursión encontrada", "excursiones encontradas")}
        </p>

        {results.length === 0 ? (
          <div className="mt-6 rounded-[var(--radius-card)] bg-white p-10 text-center shadow-[var(--shadow-lift)]">
            <h2 className="font-display text-xl font-bold text-petrol-900">
              No hay excursiones con esos filtros
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-graphite-600">
              Probá con otra categoría o quitá el destino. Y si buscás una actividad puntual que no
              está publicada, la conseguimos con nuestros operadores locales.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/excursiones" variant="tertiary">
                Quitar filtros
              </ButtonLink>
              <ButtonLink href="/viajes-a-medida">Pedir una actividad puntual</ButtonLink>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {results.map((e) => {
              const dest = destinations.find((d) => d.slug === e.destinationSlug);
              return (
                <article
                  key={e.slug}
                  className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)] transition-shadow hover:shadow-[var(--shadow-float)]"
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={e.image}
                      alt={e.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute left-3 top-3 flex gap-1.5">
                      <Badge tone="petrol">{e.category}</Badge>
                      <Badge tone={difficultyTone[e.difficulty]}>Dificultad {e.difficulty.toLowerCase()}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-teal-600">
                      <MapPinIcon className="size-3.5" aria-hidden />
                      {dest?.name ?? e.destinationSlug}
                    </p>
                    <h2 className="mt-1 font-display text-lg font-bold leading-snug text-petrol-900">
                      <Link href={`/excursiones/${e.slug}`} className="after:absolute after:inset-0">
                        {e.name}
                      </Link>
                    </h2>
                    <div className="mt-2 flex items-center justify-between text-sm text-graphite-600">
                      <span className="flex items-center gap-1.5">
                        <ClockIcon className="size-4 text-graphite-400" aria-hidden />
                        {e.duration}
                      </span>
                      <Rating value={e.rating} count={e.reviewsCount} />
                    </div>
                    <div className="mt-auto flex items-end justify-between border-t border-graphite-100 pt-4 mt-4">
                      <div>
                        <p className="text-xs text-graphite-500">Desde</p>
                        <p className="font-display text-xl font-bold text-petrol-900 tabular leading-tight">
                          {formatMoney(e.price)}
                          <span className="font-sans text-sm font-normal text-graphite-500"> por persona</span>
                        </p>
                      </div>
                      <span className="relative z-10 pointer-events-none rounded-[var(--radius-control)] bg-petrol-900 px-4 py-2 text-sm font-semibold text-ivory transition-colors group-hover:bg-petrol-800">
                        Ver detalle
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
