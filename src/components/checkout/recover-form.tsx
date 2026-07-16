"use client";

import { useState } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";
import { getPackage } from "@/data/packages";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

export function RecoverForm() {
  const { bookings } = useStore();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<"none" | "found" | "not-found">("none");
  const [searching, setSearching] = useState(false);

  const found = bookings.find(
    (b) => b.code.toLowerCase() === code.trim().toLowerCase() && b.holderEmail.toLowerCase() === email.trim().toLowerCase(),
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setTimeout(() => {
      setResult(found ? "found" : "not-found");
      setSearching(false);
    }, 600);
  };

  return (
    <form onSubmit={submit} className="rounded-[var(--radius-card)] bg-white p-6 sm:p-8 shadow-[var(--shadow-lift)]" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Código de reserva"
          required
          placeholder="FT-2026-1234"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setResult("none");
          }}
          hint="Está en el asunto del correo de confirmación"
        />
        <TextField
          label="Correo de la reserva"
          required
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setResult("none");
          }}
        />
      </div>
      <Button type="submit" className="mt-5" loading={searching}>
        <MagnifyingGlassIcon className="size-4" aria-hidden /> Buscar mi reserva
      </Button>

      {result === "found" && found && (
        <div className="mt-6 rounded-xl border border-positive-100 bg-positive-100/40 p-5" role="status">
          <Badge tone={found.status === "confirmada" ? "positive" : "warning"}>
            {found.status === "confirmada" ? "Confirmada" : found.status === "pendiente-de-pago" ? "Pendiente de pago" : "En revisión"}
          </Badge>
          <p className="mt-2 font-display text-lg font-bold text-petrol-900">{getPackage(found.packageSlug)?.name ?? found.packageSlug}</p>
          <p className="text-sm text-graphite-600">
            {found.adults + found.children} pasajeros · total {formatMoney({ amount: found.totalUsd, currency: "USD" })} · a nombre de {found.holderName}
          </p>
          <Link href="/cuenta" className="mt-3 inline-block text-sm font-semibold text-teal-600 hover:underline">
            Gestionarla desde mi cuenta
          </Link>
        </div>
      )}
      {result === "not-found" && (
        <div className="mt-6 rounded-xl bg-danger-100/60 p-5 text-sm" role="alert">
          <p className="font-semibold text-danger-700">No encontramos una reserva con esos datos.</p>
          <p className="mt-1 text-graphite-700">
            Verificá que el código y el correo sean los del mail de confirmación. Si no aparece, escribinos por{" "}
            <a
              href="https://wa.me/5493415550123?text=Hola,%20no%20encuentro%20mi%20reserva%20en%20la%20web."
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-positive-700 underline"
            >
              WhatsApp
            </a>{" "}
            con tu nombre completo y la recuperamos a mano.
          </p>
        </div>
      )}
    </form>
  );
}
