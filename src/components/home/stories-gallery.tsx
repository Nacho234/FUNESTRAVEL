"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import type { TravelerPhoto } from "@/lib/types";
import { getPackage } from "@/data/packages";

/** Traveler photo strip with an accessible lightbox (destination, names, date). */
export function StoriesGallery({ photos }: { photos: TravelerPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, photos.length]);

  const current = openIndex !== null ? photos[openIndex] : null;
  const relatedPkg = current?.relatedPackageSlug ? getPackage(current.relatedPackageSlug) : undefined;

  return (
    <>
      <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] sm:grid sm:grid-cols-5 sm:overflow-visible">
        {photos.map((photo, i) => (
          <li key={photo.id} className="snap-start shrink-0 w-40 sm:w-auto">
            <button
              onClick={() => setOpenIndex(i)}
              className="group relative block aspect-square w-full overflow-hidden rounded-xl cursor-zoom-in"
              aria-label={`Ver foto de ${photo.travelers} en ${photo.destination}`}
            >
              <Image
                src={photo.image}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 160px, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-petrol-950/70 to-transparent p-2.5 pt-6 text-left">
                <span className="block truncate text-xs font-semibold text-white">{photo.destination}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div className="fixed inset-0 z-50 bg-petrol-950/95" role="dialog" aria-modal="true" aria-label={`Foto de ${current.travelers} en ${current.destination}`}>
          <button
            onClick={() => setOpenIndex(null)}
            className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            aria-label="Cerrar foto"
          >
            <XIcon className="size-5" aria-hidden />
          </button>
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6 sm:p-12">
            <div className="relative w-full max-w-3xl flex-1">
              <Image src={current.image} alt={current.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <div className="w-full max-w-3xl text-center">
              <p className="font-display text-lg font-bold text-white">{current.destination}</p>
              <p className="mt-0.5 text-sm text-white/80">
                {current.travelers} · {current.date}
              </p>
              <p className="mt-1 text-sm text-white/70">{current.description}</p>
              {relatedPkg && (
                <Link
                  href={`/paquetes/${relatedPkg.slug}`}
                  className="mt-3 inline-block rounded-[var(--radius-control)] bg-coral-500 px-4 py-2 text-sm font-semibold text-white hover:bg-coral-600 transition-colors"
                >
                  Ver el paquete: {relatedPkg.name}
                </Link>
              )}
            </div>
          </div>
          <button
            onClick={() => setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length))}
            className="absolute left-4 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            aria-label="Foto anterior"
          >
            <CaretLeftIcon className="size-5" aria-hidden />
          </button>
          <button
            onClick={() => setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length))}
            className="absolute right-4 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            aria-label="Foto siguiente"
          >
            <CaretRightIcon className="size-5" aria-hidden />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60 tabular">
            {openIndex! + 1} / {photos.length}
          </p>
        </div>
      )}
    </>
  );
}
