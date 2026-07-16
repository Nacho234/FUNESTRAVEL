"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArticleIcon,
  BedIcon,
  CompassIcon,
  MapPinIcon,
  PackageIcon,
  QuestionIcon,
} from "@phosphor-icons/react";
import { destinations } from "@/data/destinations";
import { packages } from "@/data/packages";
import { hotels } from "@/data/hotels";
import { excursions } from "@/data/excursions";
import { articles, faqs } from "@/data/content";

interface Result {
  type: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const index: Result[] = [
  ...destinations.map((d) => ({
    type: "Destino",
    icon: <MapPinIcon className="size-4" aria-hidden />,
    title: d.name,
    subtitle: `${d.country} · ${d.tagline}`,
    href: `/destinos/${d.slug}`,
  })),
  ...packages.map((p) => ({
    type: "Paquete",
    icon: <PackageIcon className="size-4" aria-hidden />,
    title: p.name,
    subtitle: `${p.nights} noches · desde ${p.priceFrom.currency} ${p.priceFrom.amount}`,
    href: `/paquetes/${p.slug}`,
  })),
  ...hotels.map((h) => ({
    type: "Hotel",
    icon: <BedIcon className="size-4" aria-hidden />,
    title: h.name,
    subtitle: h.address,
    href: `/hoteles/${h.slug}`,
  })),
  ...excursions.map((e) => ({
    type: "Excursión",
    icon: <CompassIcon className="size-4" aria-hidden />,
    title: e.name,
    subtitle: `${e.duration} · desde ${e.price.currency} ${e.price.amount}`,
    href: `/excursiones/${e.slug}`,
  })),
  ...articles.map((a) => ({
    type: "Artículo",
    icon: <ArticleIcon className="size-4" aria-hidden />,
    title: a.title,
    subtitle: a.category,
    href: `/inspiracion/${a.slug}`,
  })),
  ...faqs.map((f) => ({
    type: "Pregunta frecuente",
    icon: <QuestionIcon className="size-4" aria-hidden />,
    title: f.q,
    subtitle: f.category,
    href: `/ayuda`,
  })),
];

const trending = ["Punta Cana", "Bariloche", "Europa", "Río de Janeiro"];

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  // The dialog mounts fresh on each open, so its state initializes lazily.
  if (!open) return null;
  return <SearchDialog onClose={onClose} />;
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [recent] = useState<string[]>(() => {
    try {
      return JSON.parse(window.localStorage.getItem("ft-recent-searches") ?? "[]");
    } catch {
      return [];
    }
  });

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return [];
    return index
      .filter((r) => normalize(`${r.title} ${r.subtitle} ${r.type}`).includes(q))
      .slice(0, 8);
  }, [query]);

  const saveRecent = (term: string) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    try {
      window.localStorage.setItem("ft-recent-searches", JSON.stringify(next));
    } catch {
      // best-effort persistence
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Buscador global">
      <button className="absolute inset-0 bg-petrol-950/55 cursor-default" onClick={onClose} aria-label="Cerrar buscador" />
      <div className="absolute left-1/2 top-[10vh] w-[92%] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-float)]">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && results[active]) {
              saveRecent(results[active].title);
              onClose();
              window.location.href = results[active].href;
            }
          }}
          placeholder="Buscá destinos, paquetes, hoteles, excursiones…"
          className="w-full border-b border-graphite-100 px-5 py-4 text-base text-graphite-800 placeholder:text-graphite-400 focus:outline-none"
          aria-label="Buscar"
        />
        <div className="max-h-[55vh] overflow-y-auto p-2">
          {query.trim().length < 2 ? (
            <div className="p-3">
              {recent.length > 0 && (
                <>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-graphite-500">Búsquedas recientes</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button
                        key={r}
                        onClick={() => setQuery(r)}
                        className="rounded-full bg-graphite-100 px-3 py-1 text-sm text-graphite-600 hover:bg-petrol-50 cursor-pointer"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-graphite-500">Tendencias</p>
              <div className="flex flex-wrap gap-2">
                {trending.map((t) => (
                  <button
                    key={t}
                    onClick={() => setQuery(t)}
                    className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-600 hover:bg-teal-100 cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center">
              <p className="font-semibold text-graphite-800">No encontramos resultados para “{query}”</p>
              <p className="mt-1 text-sm text-graphite-500">
                Probá con el nombre de un destino, o contanos qué viaje buscás y lo armamos con vos.
              </p>
              <Link
                href="/viajes-a-medida"
                onClick={onClose}
                className="mt-3 inline-block rounded-[var(--radius-control)] bg-coral-500 px-4 py-2 text-sm font-semibold text-white hover:bg-coral-600"
              >
                Diseñar mi viaje
              </Link>
            </div>
          ) : (
            <ul>
              {results.map((r, i) => (
                <li key={`${r.href}-${r.title}`}>
                  <Link
                    href={r.href}
                    onClick={() => {
                      saveRecent(r.title);
                      onClose();
                    }}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                      i === active ? "bg-petrol-50" : "hover:bg-petrol-50"
                    }`}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-600">
                      {r.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-graphite-800">{r.title}</span>
                      <span className="block truncate text-xs text-graphite-500">
                        {r.type} · {r.subtitle}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
