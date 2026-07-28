import Image from "next/image";
import type { Metadata } from "next";
import { SearchWidget } from "@/components/search/search-widget";
import { FlightAssurance } from "@/components/flights/flight-assurance";
import { FeaturedRoutes } from "@/components/flights/featured-routes";
import { JourneyScenes } from "@/components/flights/journey-scenes";

export const metadata: Metadata = {
  title: "Vuelos",
  description:
    "Buscá y emití vuelos de cabotaje e internacionales con asistencia de agencia: tarifas con equipaje aclarado y gestión ante reprogramaciones.",
};

export default function FlightsPage() {
  return (
    <div className="pb-16 lg:pb-24">
      {/* Compact hero with video background */}
      <section className="relative overflow-hidden bg-petrol-950 pt-28 pb-12 lg:pb-16">
        {/* Mobile: static image */}
        <Image
          src="/images/flights-hero-plane-mobile.webp"
          alt="Avión en vuelo sobre un mar de nubes y montañas al atardecer"
          fill
          priority
          sizes="(min-width: 1024px) 1px, 100vw"
          className="object-cover lg:hidden"
        />
        {/* Desktop: video */}
        <video
          className="absolute inset-0 hidden h-full w-full object-cover lg:block"
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/flights-hero-poster.jpg"
          aria-hidden
        >
          <source src="/videos/flights-hero-video.webm" type="video/webm" />
          <source src="/videos/flights-hero-video.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 bg-gradient-to-r from-petrol-950/70 via-petrol-950/45 to-petrol-950/15"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Vuelos con alguien que responde del otro lado
            </h1>
            <p className="mt-3 text-white/80 leading-relaxed">
              Cotizamos cabotaje e internacionales con las condiciones claras:
              equipaje, cambios y reembolsos a la vista antes de pagar.
            </p>
          </div>
          <div className="mt-8">
            <SearchWidget />
          </div>
        </div>
      </section>

      <FlightAssurance />

      <FeaturedRoutes />

      <JourneyScenes />
    </div>
  );
}
