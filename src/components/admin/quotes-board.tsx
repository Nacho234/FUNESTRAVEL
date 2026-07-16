"use client";

import { useEffect, useState } from "react";
import { adminQuotes, type AdminQuote, type AdminQuoteStatus } from "@/data/admin";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

const columns: { status: AdminQuoteStatus; title: string }[] = [
  { status: "recibida", title: "Recibida" },
  { status: "en-revision", title: "En revisión" },
  { status: "propuesta-enviada", title: "Propuesta enviada" },
  { status: "aprobada", title: "Aprobada" },
];

interface QuoteCardData extends AdminQuote {
  fromWeb?: boolean;
}

function QuoteCard({ quote }: { quote: QuoteCardData }) {
  return (
    <article className="rounded-xl bg-white p-4 shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-graphite-800 leading-snug">{quote.destination}</h3>
        {quote.fromWeb && <Badge tone="teal">Web</Badge>}
      </div>
      <p className="mt-1 text-sm text-graphite-600">{quote.customer}</p>
      <p className="text-xs text-graphite-500">{quote.travelers} · viaje {quote.approxDate}</p>
      <div className="mt-3 flex items-center justify-between border-t border-graphite-100 pt-2.5 text-xs text-graphite-500">
        <span>{quote.advisor}</span>
        <span className="tabular">Vence {formatDate(quote.validUntil)}</span>
      </div>
    </article>
  );
}

export function QuotesBoard() {
  const [quotes, setQuotes] = useState<QuoteCardData[]>(adminQuotes);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("ft-quotes");
      if (!raw) return;
      const webQuotes = JSON.parse(raw) as {
        id?: string;
        destination: string;
        travelers: string;
        approxDate: string;
        status?: string;
        createdAt: string;
      }[];
      if (!Array.isArray(webQuotes) || webQuotes.length === 0) return;
      const mapped: QuoteCardData[] = webQuotes.map((w, i) => ({
        id: w.id ?? `Q-WEB-${i}`,
        destination: w.destination,
        customer: "Cliente web",
        travelers: w.travelers,
        approxDate: w.approxDate,
        status: "recibida",
        advisor: "Sin asignar",
        validUntil: w.createdAt.slice(0, 10),
        fromWeb: true,
      }));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuotes((prev) => {
        const known = new Set(prev.map((q) => q.id));
        return [...mapped.filter((m) => !known.has(m.id)), ...prev];
      });
    } catch {
      // storage unreadable: mock data only
    }
  }, []);

  const expired = quotes.filter((q) => q.status === "vencida");

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const items = quotes.filter((q) => q.status === col.status);
          return (
            <section key={col.status} aria-label={`Cotizaciones en estado ${col.title}`}>
              <h2 className="flex items-center justify-between text-sm font-bold text-graphite-800">
                {col.title}
                <span className="grid size-6 place-items-center rounded-full bg-graphite-100 text-xs text-graphite-600 tabular">
                  {items.length}
                </span>
              </h2>
              <div className="mt-3 space-y-3">
                {items.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-graphite-200 px-4 py-6 text-center text-xs text-graphite-400">
                    Sin cotizaciones acá
                  </p>
                ) : (
                  items.map((q) => <QuoteCard key={q.id} quote={q} />)
                )}
              </div>
            </section>
          );
        })}
      </div>

      {expired.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-bold text-graphite-500">Vencidas</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {expired.map((q) => (
              <div key={q.id} className="opacity-70">
                <QuoteCard quote={q} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
