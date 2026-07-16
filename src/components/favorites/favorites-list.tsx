"use client";

import Image from "next/image";
import Link from "next/link";
import { HeartIcon, MapPinIcon } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";
import { getPackage } from "@/data/packages";
import { getHotel } from "@/data/hotels";
import { getExcursion } from "@/data/excursions";
import { getDestination } from "@/data/destinations";
import { PackageCard } from "@/components/cards/package-card";
import { FavoriteButton } from "@/components/cards/favorite-button";
import { ButtonLink } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";

interface SimpleFav {
  key: string;
  type: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  priceLabel?: string;
}

function resolveSimple(key: string): SimpleFav | null {
  const [prefix, slug] = key.split(":");
  if (prefix === "hotel") {
    const h = getHotel(slug);
    if (!h) return null;
    const minNight = Math.min(...h.rooms.map((r) => r.pricePerNight.amount));
    return {
      key,
      type: "Hotel",
      title: h.name,
      subtitle: h.address,
      image: h.image,
      href: `/hoteles/${h.slug}`,
      priceLabel: `Desde ${formatMoney({ amount: minNight, currency: h.rooms[0].pricePerNight.currency })} por noche`,
    };
  }
  if (prefix === "exc") {
    const e = getExcursion(slug);
    if (!e) return null;
    return {
      key,
      type: "Excursión",
      title: e.name,
      subtitle: e.duration,
      image: e.image,
      href: `/excursiones/${e.slug}`,
      priceLabel: `Desde ${formatMoney(e.price)} por persona`,
    };
  }
  if (prefix === "dest") {
    const d = getDestination(slug);
    if (!d) return null;
    return {
      key,
      type: "Destino",
      title: d.name,
      subtitle: d.tagline,
      image: d.image,
      href: `/destinos/${d.slug}`,
      priceLabel: `Desde ${formatMoney(d.priceFrom)} por persona`,
    };
  }
  return null;
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-hidden>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)]">
          <div className="aspect-[3/2] animate-pulse bg-graphite-100" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-24 animate-pulse rounded bg-graphite-100" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-graphite-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-graphite-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FavoritesList() {
  const { favorites, ready } = useStore();

  if (!ready) {
    return <SkeletonGrid />;
  }

  const packageFavs = favorites
    .filter((k) => k.startsWith("pkg:"))
    .map((k) => getPackage(k.slice(4)))
    .filter((p) => p !== undefined);

  const simpleFavs = favorites
    .filter((k) => !k.startsWith("pkg:"))
    .map(resolveSimple)
    .filter((f): f is SimpleFav => f !== null);

  if (packageFavs.length === 0 && simpleFavs.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-lift)]">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-coral-50">
          <HeartIcon className="size-7 text-coral-600" aria-hidden />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold text-petrol-900">
          Todavía no guardaste nada
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-graphite-600">
          Tocá el corazón en cualquier paquete, hotel o destino y queda guardado acá, para comparar
          tranquilo o retomarlo en otro momento desde este dispositivo.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/paquetes">Explorar paquetes</ButtonLink>
          <ButtonLink href="/destinos" variant="tertiary">
            Ver destinos
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {packageFavs.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold text-petrol-900">
            Paquetes guardados
          </h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {packageFavs.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
        </section>
      )}

      {simpleFavs.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold text-petrol-900">
            Otros favoritos
          </h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {simpleFavs.map((f) => (
              <article
                key={f.key}
                className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-lift)] transition-shadow hover:shadow-[var(--shadow-float)]"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={f.image}
                    alt={f.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute right-3 top-3">
                    <FavoriteButton itemKey={f.key} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-teal-600">
                    <MapPinIcon className="size-3.5" aria-hidden />
                    {f.type}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold leading-snug text-petrol-900">
                    <Link href={f.href} className="after:absolute after:inset-0">
                      {f.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-graphite-600 line-clamp-2">{f.subtitle}</p>
                  {f.priceLabel && (
                    <p className="mt-3 border-t border-graphite-100 pt-3 text-sm font-semibold text-petrol-900 tabular">
                      {f.priceLabel}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
