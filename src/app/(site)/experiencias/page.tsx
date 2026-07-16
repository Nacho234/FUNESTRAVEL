import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRightIcon, SealCheckIcon, StarIcon } from "@phosphor-icons/react/dist/ssr";
import { travelerPhotos, travelStories, trustMetrics } from "@/data/stories";
import { formatDate } from "@/lib/format";
import { StoriesGallery } from "@/components/home/stories-gallery";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Experiencias de viajeros",
  description:
    "Historias reales de personas que viajaron con Funes Travel: lunas de miel, familias en la nieve, salidas grupales e imprevistos resueltos en el camino.",
};

export default function ExperiencesPage() {
  const stories = travelStories.filter((s) => s.active && s.publishPermission).sort((a, b) => a.order - b.order);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 pb-20">
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-graphite-500">
        Viajeros reales · Experiencias verificadas
      </p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900">
        Experiencias de quienes ya viajaron
      </h1>
      <p className="mt-2 max-w-xl text-graphite-600">
        Cada historia está vinculada a una reserva real y se publica con permiso de los viajeros. La
        valoración promedio actual es {trustMetrics.averageRating.toLocaleString("es-AR")} sobre 5.
      </p>

      <div className="mt-8 space-y-5">
        {stories.map((story) => (
          <article key={story.id} className="grid overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)] sm:grid-cols-[220px_1fr]">
            <div className="relative h-44 sm:h-full min-h-44">
              <Image src={story.tripImages[0]} alt={story.tripImageAlt} fill sizes="(max-width: 640px) 100vw, 220px" className="object-cover" />
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-xs font-semibold text-graphite-600">
                  {story.tripType} · {story.country}
                </span>
                {story.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-600">
                    <SealCheckIcon weight="fill" className="size-3.5" aria-hidden /> Viaje verificado
                  </span>
                )}
                <span className="ml-auto flex items-center gap-1 text-xs text-graphite-500">
                  <StarIcon weight="fill" className="size-3.5 text-warning-700" aria-hidden />
                  <span className="font-semibold text-graphite-800 tabular">{story.rating}.0</span>
                </span>
              </div>
              <h2 className="mt-2.5 font-display text-xl font-bold leading-snug text-petrol-900">{story.storyTitle}</h2>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-graphite-700">“{story.highlight}”</p>
              {story.fullText !== story.highlight && (
                <p className="mt-1.5 text-sm leading-relaxed text-graphite-600">{story.fullText}</p>
              )}
              <p className="mt-3 text-xs text-graphite-500">
                <span className="font-bold text-graphite-800">{story.travelerName}</span> · {story.city} ·{" "}
                {story.destination} · {formatDate(story.date)}
              </p>
              <Link href={story.ctaHref} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-500">
                {story.ctaLabel}
                <ArrowRightIcon className="size-4" aria-hidden />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold text-petrol-900">Fotos de los viajeros</h2>
      <div className="mt-4">
        <StoriesGallery photos={travelerPhotos} />
      </div>

      <div className="mt-12 rounded-[var(--radius-card)] bg-petrol-950 p-8 text-center text-ivory">
        <h2 className="font-display text-2xl font-bold">¿Viajaste con nosotros?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-petrol-100/85">
          Nos encantaría sumar tu historia. Escribinos por WhatsApp con una foto del viaje y qué te
          gustaría contar: la publicamos solo con tu permiso.
        </p>
        <ButtonLink
          href="https://wa.me/5493415550123?text=Hola,%20viajé%20con%20ustedes%20y%20quiero%20compartir%20mi%20experiencia."
          target="_blank"
          className="mt-5"
        >
          Compartir mi experiencia
        </ButtonLink>
      </div>
    </div>
  );
}
