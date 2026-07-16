"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckCircleIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";

/** Compact three-question intake inside the curated destinations module. */
export function MiniProposalForm() {
  const { addQuote } = useStore();
  const [destination, setDestination] = useState("");
  const [month, setMonth] = useState("");
  const [travelers, setTravelers] = useState("2 personas");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim().length < 2) {
      setError("Contanos al menos una idea de destino.");
      return;
    }
    setError("");
    setState("loading");
    setTimeout(() => {
      addQuote({
        id: `Q-${Date.now().toString(36).toUpperCase()}`,
        destination: destination.trim(),
        origin: "A confirmar",
        approxDate: month || "A confirmar",
        duration: "A confirmar",
        travelers,
        budget: "",
        styles: [],
        comments: "Solicitud rápida desde la sección de destinos de la home.",
        status: "recibida",
        createdAt: new Date().toISOString(),
      });
      setState("done");
    }, 600);
  };

  if (state === "done") {
    return (
      <div className="flex h-full flex-col justify-center" role="status">
        <p className="flex items-center gap-2 font-semibold text-petrol-900">
          <CheckCircleIcon weight="fill" className="size-5 text-positive-700" aria-hidden />
          Recibimos tu idea de viaje
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-graphite-600">
          Un asesor la revisa y te contacta dentro de las próximas 24 horas hábiles. Podés seguirla desde{" "}
          <a href="/cuenta/cotizaciones" className="font-semibold text-teal-600 underline">tu cuenta</a>.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-[var(--radius-control)] border border-sand-200 bg-white px-3 py-2 text-sm text-graphite-800 placeholder:text-graphite-400 focus:border-teal-500 focus:outline-none";

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        <div>
          <label htmlFor="mini-dest" className="mb-1 block text-xs font-semibold text-graphite-600">
            ¿A dónde te gustaría viajar?
          </label>
          <input
            id="mini-dest"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setError("");
            }}
            placeholder="Ej.: Caribe, Europa…"
            className={inputClass}
            aria-invalid={error ? true : undefined}
          />
        </div>
        <div>
          <label htmlFor="mini-month" className="mb-1 block text-xs font-semibold text-graphite-600">
            ¿En qué fecha?
          </label>
          <input id="mini-month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="mini-pax" className="mb-1 block text-xs font-semibold text-graphite-600">
            ¿Cuántas personas viajan?
          </label>
          <select id="mini-pax" value={travelers} onChange={(e) => setTravelers(e.target.value)} className={`${inputClass} cursor-pointer`}>
            {["1 persona", "2 personas", "3 o 4 personas", "5 o más", "Grupo grande"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-xs font-medium text-danger-700" role="alert">
          {error}
        </p>
      )}
      <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-petrol-900 px-4 py-2.5 text-sm font-bold text-ivory transition-colors hover:bg-petrol-800 disabled:opacity-60 cursor-pointer"
        >
          {state === "loading" ? "Enviando…" : "Empezar mi propuesta"}
          <ArrowRightIcon weight="bold" className="size-4" aria-hidden />
        </button>
        <a
          href="https://wa.me/5493415550123?text=Hola,%20quiero%20armar%20un%20viaje%20y%20me%20gustar%C3%ADa%20hablar%20con%20un%20asesor."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-positive-700 hover:underline"
        >
          <WhatsappLogoIcon className="size-4.5" aria-hidden />
          Hablar con un asesor
        </a>
      </div>
    </form>
  );
}
