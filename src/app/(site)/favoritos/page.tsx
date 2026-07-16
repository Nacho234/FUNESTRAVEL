import type { Metadata } from "next";
import { FavoritesList } from "@/components/favorites/favorites-list";

export const metadata: Metadata = {
  title: "Mis favoritos",
  description: "Los paquetes, hoteles, destinos y excursiones que guardaste para decidir después.",
};

export default function FavoritesPage() {
  return (
    <div className="pt-28 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-petrol-900">
            Mis favoritos
          </h1>
          <p className="mt-2 text-graphite-600">
            Todo lo que marcaste con el corazón, guardado en este dispositivo para retomarlo cuando quieras.
          </p>
        </header>
        <div className="mt-8">
          <FavoritesList />
        </div>
      </div>
    </div>
  );
}
