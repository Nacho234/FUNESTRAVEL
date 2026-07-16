import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { articles } from "@/data/content";
import { formatDate } from "@/lib/format";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Inspiración y guías de viaje",
  description:
    "Guías prácticas escritas por el equipo de Funes Travel: documentación, presupuesto, equipaje y la mejor época para cada destino.",
};

export default function InspirationPage() {
  const [featured, second, ...rest] = articles;

  return (
    <div className="pt-28 lg:pt-32 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-petrol-900">
            Guías para viajar mejor
          </h1>
          <p className="mt-3 max-w-xl text-graphite-600">
            Lo que respondemos todos los días en la oficina, puesto por escrito: documentación,
            presupuesto, equipaje y cuándo conviene cada destino.
          </p>
        </Reveal>

        {/* Featured pair: one large, one editorial highlight */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <Link href={`/inspiracion/${featured.slug}`} className="group block">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)]">
                <Image
                  src={featured.image}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-teal-600">
                {featured.category} · {featured.readMinutes} min de lectura
              </p>
              <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-petrol-900 group-hover:text-petrol-700 transition-colors">
                {featured.title}
              </h2>
              <p className="mt-2 max-w-xl text-graphite-600">{featured.excerpt}</p>
            </Link>
          </Reveal>

          {second && (
            <Reveal delay={0.08}>
              <Link
                href={`/inspiracion/${second.slug}`}
                className="group flex h-full flex-col justify-between rounded-[var(--radius-card)] bg-petrol-950 p-7 text-ivory"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-100">
                    {second.category} · {second.readMinutes} min de lectura
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-bold leading-snug group-hover:text-teal-100 transition-colors">
                    {second.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-petrol-100/80">{second.excerpt}</p>
                </div>
                <p className="mt-6 text-sm font-semibold text-teal-100">Leer la guía completa</p>
              </Link>
            </Reveal>
          )}
        </div>

        {/* Remaining articles */}
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-2">
          {rest.map((article, i) => (
            <Reveal key={article.slug} delay={(i % 2) * 0.06}>
              <Link href={`/inspiracion/${article.slug}`} className="group flex gap-5">
                <div className="relative aspect-square w-28 sm:w-36 shrink-0 overflow-hidden rounded-[var(--radius-card)]">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    sizes="144px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                    {article.category}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold leading-snug text-petrol-900 group-hover:text-petrol-700 transition-colors">
                    {article.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-graphite-600 line-clamp-2">{article.excerpt}</p>
                  <p className="mt-2 text-xs text-graphite-500">
                    {formatDate(article.date)} · {article.readMinutes} min de lectura
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
