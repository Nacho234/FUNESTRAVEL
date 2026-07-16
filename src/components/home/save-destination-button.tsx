"use client";

import { HeartIcon } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";

/** "Guardar destino" secondary action with a visible label (hero card). */
export function SaveDestinationButton({ slug, onImage = true }: { slug: string; onImage?: boolean }) {
  const { isFavorite, toggleFavorite, ready } = useStore();
  const key = `dest:${slug}`;
  const saved = ready && isFavorite(key);

  return (
    <button
      onClick={() => toggleFavorite(key)}
      aria-pressed={saved}
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-control)] px-3.5 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
        onImage
          ? "text-white/95 hover:bg-white/10"
          : "text-petrol-800 hover:bg-petrol-50"
      }`}
    >
      <HeartIcon weight={saved ? "fill" : "regular"} className={`size-4.5 ${saved ? "text-coral-400" : ""}`} aria-hidden />
      {saved ? "Guardado" : "Guardar destino"}
    </button>
  );
}
