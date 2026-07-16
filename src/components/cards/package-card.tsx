import Image from "next/image";
import Link from "next/link";
import {
  AirplaneTiltIcon,
  BusIcon,
  CalendarBlankIcon,
  ForkKnifeIcon,
  MapPinIcon,
  MoonStarsIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { TravelPackage } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { PriceBlock } from "@/components/ui/price";
import { FavoriteButton } from "./favorite-button";

export function PackageCard({ pkg, priority = false }: { pkg: TravelPackage; priority?: boolean }) {
  const nextDeparture = pkg.departures[0];
  const lowSeats = nextDeparture && nextDeparture.seatsLeft <= 6;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)] transition-shadow hover:shadow-[var(--shadow-float)]">
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={pkg.image}
          alt={`${pkg.name}: ${pkg.cities.join(", ")}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col gap-1.5">
            {pkg.promo && <Badge tone="coral">{pkg.promo.label}</Badge>}
            {lowSeats && <Badge tone="warning">Últimos {nextDeparture.seatsLeft} lugares</Badge>}
          </div>
          <FavoriteButton itemKey={`pkg:${pkg.slug}`} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-teal-600">
              <MapPinIcon className="size-3.5" aria-hidden />
              {pkg.cities.join(" · ")}
            </p>
            <h3 className="mt-1 font-display text-lg font-bold text-petrol-900 leading-snug">
              <Link href={`/paquetes/${pkg.slug}`} className="after:absolute after:inset-0">
                {pkg.name}
              </Link>
            </h3>
          </div>
          <Rating value={pkg.rating} />
        </div>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.8125rem] text-graphite-600">
          <li className="flex items-center gap-1.5">
            <MoonStarsIcon className="size-4 text-graphite-400" aria-hidden />
            {pkg.nights} noches
          </li>
          <li className="flex items-center gap-1.5">
            {pkg.transport === "Bus" ? (
              <BusIcon className="size-4 text-graphite-400" aria-hidden />
            ) : (
              <AirplaneTiltIcon className="size-4 text-graphite-400" aria-hidden />
            )}
            {pkg.transport} desde {pkg.departureCity}
          </li>
          <li className="flex items-center gap-1.5">
            <ForkKnifeIcon className="size-4 text-graphite-400" aria-hidden />
            {pkg.regime}
          </li>
          {nextDeparture && (
            <li className="flex items-center gap-1.5">
              <CalendarBlankIcon className="size-4 text-graphite-400" aria-hidden />
              Próxima salida: {formatDate(nextDeparture.date)}
            </li>
          )}
        </ul>

        <p className="mt-2 text-sm text-graphite-600 line-clamp-2">{pkg.summary}</p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-graphite-100 pt-4 mt-4">
          <PriceBlock price={pkg.priceFrom} installments={pkg.installments} taxesIncluded={pkg.taxesIncluded} size="sm" />
          <span className="relative z-10 rounded-[var(--radius-control)] bg-petrol-900 px-4 py-2 text-sm font-semibold text-ivory transition-colors group-hover:bg-petrol-800 pointer-events-none">
            Ver fechas y precios
          </span>
        </div>
      </div>
    </article>
  );
}
