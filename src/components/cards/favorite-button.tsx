"use client";

import { HeartIcon } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";

export function FavoriteButton({ itemKey, className = "" }: { itemKey: string; className?: string }) {
  const { isFavorite, toggleFavorite, ready } = useStore();
  const fav = ready && isFavorite(itemKey);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(itemKey);
      }}
      className={`grid size-9 place-items-center rounded-full bg-white/90 backdrop-blur transition-all cursor-pointer hover:scale-105 active:scale-95 ${className}`}
      aria-label={fav ? "Quitar de favoritos" : "Guardar en favoritos"}
      aria-pressed={fav}
    >
      <HeartIcon weight={fav ? "fill" : "regular"} className={`size-4.5 ${fav ? "text-coral-600" : "text-graphite-600"}`} aria-hidden />
    </button>
  );
}
