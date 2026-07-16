"use client";

import { useState } from "react";
import { CheckCircleIcon } from "@phosphor-icons/react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("loading");
    // Demo: the real implementation posts to the marketing service adapter.
    setTimeout(() => setState("done"), 700);
  };

  if (state === "done") {
    return (
      <p className="mt-4 lg:mt-0 flex items-center gap-2 text-sm font-semibold text-ivory" role="status">
        <CheckCircleIcon weight="fill" className="size-5 text-teal-100" aria-hidden />
        Listo. Te llega el próximo resumen de ofertas.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 lg:mt-0 w-full max-w-sm" noValidate>
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Tu correo electrónico
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="tu@correo.com"
          className="w-full rounded-[var(--radius-control)] border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-ivory placeholder:text-petrol-100/50 focus:border-teal-100 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="shrink-0 rounded-[var(--radius-control)] bg-coral-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-coral-600 transition-colors cursor-pointer disabled:opacity-60"
        >
          {state === "loading" ? "Enviando…" : "Suscribirme"}
        </button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-xs font-medium text-coral-100" role="alert">
          Revisá el correo ingresado: necesita el formato nombre@dominio.com
        </p>
      )}
    </form>
  );
}
