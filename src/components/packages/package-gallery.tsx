"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";

export function PackageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % images.length);
      if (e.key === "ArrowLeft") setActive((a) => (a - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  return (
    <div>
      <div className="grid gap-2 md:grid-cols-[2fr_1fr] md:grid-rows-2 md:h-[420px]">
        <button
          onClick={() => setLightbox(true)}
          className="relative aspect-[3/2] md:aspect-auto md:row-span-2 overflow-hidden rounded-[var(--radius-card)] cursor-zoom-in group"
          aria-label="Ampliar galería de fotos"
        >
          <Image
            src={images[active] ?? images[0]}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </button>
        {images.slice(0, 2).map((img, i) =>
          images.length > 1 ? (
            <button
              key={img + i}
              onClick={() => setActive(i === 0 ? 1 % images.length : Math.min(2, images.length - 1))}
              className="relative hidden md:block overflow-hidden rounded-[var(--radius-card)] cursor-pointer group"
              aria-label={`Ver foto ${i + 2}`}
            >
              <Image
                src={images[(i + 1) % images.length]}
                alt=""
                fill
                sizes="33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>
          ) : null,
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg cursor-pointer transition-all ${
                active === i ? "ring-2 ring-teal-500 ring-offset-2 ring-offset-ivory" : "opacity-75 hover:opacity-100"
              }`}
              aria-label={`Foto ${i + 1} de ${images.length}`}
              aria-current={active === i}
            >
              <Image src={img} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-petrol-950/95" role="dialog" aria-modal="true" aria-label="Galería de fotos">
          <button
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            aria-label="Cerrar galería"
          >
            <XIcon className="size-5" aria-hidden />
          </button>
          <div className="flex h-full items-center justify-center p-6 sm:p-12">
            <div className="relative h-full w-full max-w-5xl">
              <Image src={images[active]} alt={alt} fill sizes="100vw" className="object-contain" />
            </div>
          </div>
          <button
            onClick={() => setActive((a) => (a - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            aria-label="Foto anterior"
          >
            <CaretLeftIcon className="size-5" aria-hidden />
          </button>
          <button
            onClick={() => setActive((a) => (a + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            aria-label="Foto siguiente"
          >
            <CaretRightIcon className="size-5" aria-hidden />
          </button>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/80 tabular">
            {active + 1} / {images.length}
          </p>
        </div>
      )}
    </div>
  );
}
