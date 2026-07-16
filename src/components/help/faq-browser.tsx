"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { AccordionItem } from "@/components/ui/accordion";
import type { FAQItem } from "@/lib/types";

const categoryOrder: FAQItem["category"][] = [
  "Reservas",
  "Pagos",
  "Cancelaciones",
  "Documentación",
  "Equipaje",
  "Asistencia",
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function FaqBrowser({ faqs }: { faqs: FAQItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return faqs;
    return faqs.filter((f) => normalize(`${f.q} ${f.a} ${f.category}`).includes(q));
  }, [faqs, query]);

  const grouped = useMemo(
    () =>
      categoryOrder
        .map((category) => ({
          category,
          items: filtered.filter((f) => f.category === category),
        }))
        .filter((g) => g.items.length > 0),
    [filtered],
  );

  return (
    <div>
      <div className="relative max-w-xl">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-graphite-400"
          aria-hidden
        />
        <label htmlFor="faq-search" className="sr-only">
          Buscar en preguntas frecuentes
        </label>
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscá por tema: cuotas, pasaporte, cancelar…"
          className="w-full rounded-full border border-graphite-200 bg-white py-3 pl-12 pr-5 text-[0.9375rem] text-graphite-800 placeholder:text-graphite-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/25 transition-colors"
        />
      </div>

      {grouped.length === 0 ? (
        <div className="mt-10 rounded-[var(--radius-card)] bg-white p-10 text-center shadow-[var(--shadow-lift)]">
          <h2 className="font-display text-xl font-bold text-petrol-900">
            No encontramos una respuesta para “{query}”
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-graphite-600">
            Puede que tu consulta sea muy específica. Escribinos y un asesor te responde en el día.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/5493415550123"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-positive-700 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <WhatsappLogoIcon weight="fill" className="size-4.5" aria-hidden />
              Consultar por WhatsApp
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center rounded-[var(--radius-control)] border border-graphite-200 bg-white px-5 py-2.5 text-sm font-semibold text-petrol-900 hover:border-petrol-600 hover:text-petrol-700 transition-colors"
            >
              Ir a contacto
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {grouped.map(({ category, items }) => (
            <section key={category} aria-label={category}>
              <h2 className="font-display text-xl font-bold text-petrol-900">{category}</h2>
              <div className="mt-2">
                {items.map((f) => (
                  <AccordionItem key={f.q} title={f.q}>
                    {f.a}
                  </AccordionItem>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
