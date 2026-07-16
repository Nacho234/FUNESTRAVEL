"use client";

import { useState } from "react";
import { CheckCircleIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/field";

const reasons = [
  "Consulta por un paquete o destino",
  "Estado de mi reserva",
  "Pagos y facturación",
  "Viajes grupales o corporativos",
  "Otro motivo",
];

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    reason: reasons[0],
    message: "",
  });

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((er) => ({ ...er, [key]: "" }));
    };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Contanos tu nombre para saber a quién respondemos.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      next.email = "Revisá el correo: necesita el formato nombre@dominio.com";
    if (form.message.trim().length < 10)
      next.message = "Contanos un poco más: con dos líneas nos alcanza para orientarte mejor.";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setState("loading");
    // Demo: the real implementation posts to the contact service adapter.
    setTimeout(() => setState("done"), 800);
  };

  if (state === "done") {
    return (
      <div className="rounded-[var(--radius-card)] bg-white p-8 text-center shadow-[var(--shadow-lift)]">
        <CheckCircleIcon weight="fill" className="mx-auto size-12 text-positive-700" aria-hidden />
        <h2 className="mt-3 font-display text-xl font-bold text-petrol-900">Mensaje enviado</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-graphite-600">
          Te respondemos a {form.email} dentro del horario de atención. Si tu consulta es urgente y
          estás de viaje, usá la línea de WhatsApp de emergencias que figura en tu voucher.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[var(--radius-card)] bg-white p-6 sm:p-8 shadow-[var(--shadow-lift)]"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Nombre y apellido"
          required
          autoComplete="name"
          placeholder="Ej.: Carolina Peralta"
          value={form.name}
          onChange={set("name")}
          error={errors.name}
        />
        <TextField
          label="Correo electrónico"
          required
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
        />
        <TextField
          label="Teléfono"
          type="tel"
          autoComplete="tel"
          placeholder="+54 9 341 …"
          hint="Opcional: solo si preferís que te llamemos"
          value={form.phone}
          onChange={set("phone")}
        />
        <SelectField label="Motivo" value={form.reason} onChange={set("reason")}>
          {reasons.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </SelectField>
      </div>
      <div className="mt-5">
        <TextAreaField
          label="Tu mensaje"
          required
          placeholder="Contanos qué necesitás: destino, fechas aproximadas, cantidad de viajeros o el número de reserva si ya tenés una."
          value={form.message}
          onChange={set("message")}
          error={errors.message}
        />
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-graphite-500">
          Usamos tus datos solo para responder esta consulta. Nada de listas de spam.
        </p>
        <Button type="submit" size="lg" loading={state === "loading"}>
          <PaperPlaneTiltIcon className="size-4.5" aria-hidden /> Enviar mensaje
        </Button>
      </div>
    </form>
  );
}
