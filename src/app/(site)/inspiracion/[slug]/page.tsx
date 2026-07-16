import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { articles } from "@/data/content";
import { formatDate } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Artículo no encontrado" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <article className="pb-16 lg:pb-24">
      {/* Hero */}
      <header className="relative min-h-[55dvh] flex items-end">
        <Image src={article.image} alt="" fill priority sizes="100vw" className="object-cover" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-petrol-950/85 via-petrol-950/35 to-petrol-950/40"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 pb-10 pt-40">
          <nav aria-label="Ubicación" className="text-sm text-white/75">
            <Link href="/inspiracion" className="hover:text-white underline-offset-4 hover:underline">
              Inspiración
            </Link>
            <span aria-hidden> / </span>
            <span className="text-white/90">{article.category}</span>
          </nav>
          <h1 className="mt-3 max-w-3xl font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            {article.title}
          </h1>
          <p className="mt-3 text-sm text-white/80">
            {formatDate(article.date)} · {article.readMinutes} min de lectura · Equipo Funes Travel
          </p>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-[70ch] py-12 lg:py-16">
          <p className="text-xl leading-relaxed text-graphite-700 font-medium">{article.excerpt}</p>
          <div className="mt-8 space-y-6">
            {article.body.map((paragraph, i) => (
              <p key={i} className="text-lg leading-relaxed text-graphite-700">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Sober CTA */}
          <aside className="mt-12 rounded-[var(--radius-card)] bg-sand-100 p-7 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <h2 className="font-display text-xl font-bold text-petrol-900">
                ¿Preferís que lo resolvamos juntos?
              </h2>
              <p className="mt-1 text-sm text-graphite-600">
                Contanos tu viaje y un asesor arma la propuesta con estos detalles ya resueltos.
              </p>
            </div>
            <ButtonLink href="/viajes-a-medida" className="mt-4 sm:mt-0 shrink-0">
              Diseñar mi viaje
            </ButtonLink>
          </aside>
        </div>

        {/* Related */}
        <section className="border-t border-graphite-100 pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-petrol-900">
              Seguí leyendo
            </h2>
            <Link
              href="/inspiracion"
              className="group flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-500"
            >
              Todas las guías
              <ArrowRightIcon
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {related.map((rel) => (
              <Link key={rel.slug} href={`/inspiracion/${rel.slug}`} className="group flex gap-5">
                <div className="relative aspect-square w-24 sm:w-28 shrink-0 overflow-hidden rounded-[var(--radius-card)]">
                  <Image
                    src={rel.image}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                    {rel.category}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold leading-snug text-petrol-900 group-hover:text-petrol-700 transition-colors">
                    {rel.title}
                  </h3>
                  <p className="mt-1 text-xs text-graphite-500">{rel.readMinutes} min de lectura</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
