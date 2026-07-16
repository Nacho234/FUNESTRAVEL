"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BankIcon,
  CheckCircleIcon,
  ForkKnifeIcon,
  HeartIcon,
  MountainsIcon,
  FlowerLotusIcon,
  SnowflakeIcon,
  UmbrellaIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { useStore } from "@/lib/store";

/**
 * Custom-trip intake as a compact two-step card: the essentials first
 * (destination, date, travelers), preferences second (origin, duration,
 * budget, experience). Step changes slide softly; the CTA gains emphasis once
 * the request is complete.
 */

const styleOptions = [
  { label: "Playa", icon: UmbrellaIcon },
  { label: "Aventura", icon: MountainsIcon },
  { label: "Cultura", icon: BankIcon },
  { label: "Gastronomía", icon: ForkKnifeIcon },
  { label: "Relax", icon: FlowerLotusIcon },
  { label: "Luna de miel", icon: HeartIcon },
  { label: "Familia", icon: UsersThreeIcon },
  { label: "Nieve", icon: SnowflakeIcon },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function QuoteForm({ extended = false }: { extended?: boolean }) {
  const { addQuote } = useStore();
  const reduce = useReducedMotion() ?? false;
  const [step, setStep] = useState<1 | 2>(1);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    destination: "",
    origin: "Rosario",
    approxDate: "",
    duration: "7 noches",
    travelers: "2 adultos",
    budget: "",
    comments: "",
  });
  const [styles, setStyles] = useState<string[]>([]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };

  const goToStep2 = () => {
    const next: Record<string, string> = {};
    if (form.destination.trim().length < 2) next.destination = "Contanos qué destino tenés en mente, aunque sea aproximado.";
    if (!form.approxDate) next.approxDate = "Con el mes aproximado alcanza.";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setStep(2);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      goToStep2();
      return;
    }
    setState("loading");
    setTimeout(() => {
      addQuote({
        id: `Q-${Date.now().toString(36).toUpperCase()}`,
        destination: form.destination,
        origin: form.origin,
        approxDate: form.approxDate,
        duration: form.duration,
        travelers: form.travelers,
        budget: form.budget,
        styles,
        comments: form.comments,
        status: "recibida",
        createdAt: new Date().toISOString(),
      });
      setState("done");
    }, 800);
  };

  const ready = step === 2 && styles.length > 0;

  if (state === "done") {
    return (
      <div className="rounded-[var(--radius-card)] border border-sand-200 bg-white p-8 text-center shadow-[var(--shadow-lift)]">
        <CheckCircleIcon weight="fill" className="mx-auto size-12 text-positive-700" aria-hidden />
        <h3 className="mt-3 font-display text-xl font-bold text-petrol-900">Recibimos tu solicitud</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-graphite-600">
          Un asesor la revisa y te contacta dentro de las próximas 24 horas hábiles con una propuesta.
          Podés seguirla desde{" "}
          <a href="/cuenta/cotizaciones" className="font-semibold text-teal-600 underline">tu cuenta</a>.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="overflow-hidden rounded-[var(--radius-card)] border border-sand-200 bg-white shadow-[var(--shadow-lift)]"
    >
      {/* Slim header with progress */}
      <div className="flex items-center justify-between gap-4 border-b border-sand-200 bg-sand-50/60 px-6 py-4">
        <div>
          <h3 className="font-display text-base font-bold text-petrol-900">Armemos una primera propuesta</h3>
          <p className="mt-0.5 text-xs text-graphite-500">
            {step === 1 ? "Lo esencial para empezar." : "Afinamos la propuesta con tus preferencias."}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[0.6875rem] font-semibold text-graphite-500 tabular">Paso {step} de 2</p>
          <div className="mt-1 flex gap-1" aria-hidden>
            <span className="h-1 w-7 rounded-full bg-teal-500" />
            <span className={`h-1 w-7 rounded-full transition-colors duration-300 ${step === 2 ? "bg-teal-500" : "bg-sand-200"}`} />
          </div>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={reduce ? false : { opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -18 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <TextField
                    label="Destino deseado"
                    required
                    placeholder="Ej.: Caribe, Europa, no lo tengo claro…"
                    value={form.destination}
                    onChange={set("destination")}
                    error={errors.destination}
                  />
                </div>
                <TextField
                  label="Fecha aproximada"
                  required
                  type="month"
                  value={form.approxDate}
                  onChange={set("approxDate")}
                  error={errors.approxDate}
                />
                <SelectField label="Viajeros" value={form.travelers} onChange={set("travelers")}>
                  {["1 adulto", "2 adultos", "2 adultos + niños", "Grupo de amigos", "Grupo grande (10 o más)"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </SelectField>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-xs leading-snug text-graphite-500">
                  Esto es una solicitud, no una compra.
                </p>
                <Button type="button" onClick={goToStep2} className="group">
                  Continuar
                  <ArrowRightIcon weight="bold" className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={reduce ? false : { opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: 18 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <SelectField label="Ciudad de salida" value={form.origin} onChange={set("origin")}>
                  {["Rosario", "Buenos Aires", "Córdoba", "Otra"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </SelectField>
                <SelectField label="Duración" value={form.duration} onChange={set("duration")}>
                  {["Fin de semana largo", "5 noches", "7 noches", "10 noches", "14 noches o más"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </SelectField>
                <SelectField label="Presupuesto" value={form.budget} onChange={set("budget")}>
                  <option value="">A definir</option>
                  {["Hasta USD 500", "USD 500 a 1.000", "USD 1.000 a 2.500", "Más de USD 2.500"].map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </SelectField>
              </div>

              <fieldset className="mt-5">
                <legend className="text-sm font-semibold text-graphite-800">Experiencia deseada</legend>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {styleOptions.map(({ label, icon: Icon }) => {
                    const on = styles.includes(label);
                    return (
                      <motion.button
                        key={label}
                        type="button"
                        onClick={() => setStyles(on ? styles.filter((x) => x !== label) : [...styles, label])}
                        aria-pressed={on}
                        whileTap={reduce ? undefined : { scale: 0.96 }}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                          on
                            ? "border-petrol-900 bg-petrol-900 text-ivory shadow-[0_1px_2px_rgb(14_58_71_/_0.25)]"
                            : "border-sand-200 bg-white text-graphite-600 hover:border-teal-500/60 hover:text-petrol-800 hover:-translate-y-px"
                        }`}
                      >
                        <Icon weight={on ? "fill" : "regular"} className={`size-4 ${on ? "text-teal-100" : "text-graphite-400"}`} aria-hidden />
                        {label}
                      </motion.button>
                    );
                  })}
                </div>
              </fieldset>

              {extended && (
                <div className="mt-5">
                  <TextAreaField
                    label="Contanos más"
                    placeholder="Aniversario, celiaquía, algo que soñás hacer… todo suma."
                    rows={3}
                    value={form.comments}
                    onChange={set("comments")}
                  />
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-graphite-500 transition-colors hover:text-petrol-800 cursor-pointer"
                  >
                    <ArrowLeftIcon className="size-3.5" aria-hidden /> Volver
                  </button>
                  <p className="hidden text-xs leading-snug text-graphite-500 sm:block">
                    Te enviamos una propuesta personalizada para empezar.
                  </p>
                </div>
                <Button
                  type="submit"
                  loading={state === "loading"}
                  className={`group transition-shadow duration-300 ${ready ? "shadow-[0_4px_16px_-4px_rgb(217_85_42_/_0.5)]" : ""}`}
                >
                  Diseñar mi viaje
                  <ArrowRightIcon weight="bold" className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
