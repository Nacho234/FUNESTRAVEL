"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BankIcon,
  CalendarBlankIcon,
  CheckCircleIcon,
  ForkKnifeIcon,
  FlowerLotusIcon,
  MountainsIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { useStore } from "@/lib/store";

/**
 * Home intake for custom trips, as a two-step card.
 *
 * Step 1 is the trip idea (destination, dates, travelers, experience, notes);
 * step 2 is what we need to actually quote it (origin, duration, budget and
 * how to reach the traveler). State survives the step change, both directions.
 *
 * Kept separate from `quote-form.tsx`, which serves /viajes-a-medida with a
 * different field order and lives on its own page.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const experienceOptions = [
  { label: "Relax", icon: FlowerLotusIcon },
  { label: "Aventura", icon: MountainsIcon },
  { label: "Cultura", icon: BankIcon },
  { label: "Gastronomía", icon: ForkKnifeIcon },
];

const travelerOptions = [
  "1 adulto",
  "2 adultos",
  "2 adultos + niños",
  "Grupo de amigos",
  "Grupo grande (10 o más)",
];

const contactPreferences = ["WhatsApp", "Email", "Llamada"];

type Step = 1 | 2;

export function CustomTripForm() {
  const { addQuote } = useStore();
  const reduce = useReducedMotion() ?? false;
  const headingId = useId();
  const progressId = useId();
  const pendingId = useId();

  const [step, setStep] = useState<Step>(1);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [experiences, setExperiences] = useState<string[]>([]);
  const [form, setForm] = useState({
    destination: "",
    approxDate: "",
    travelers: "2 adultos",
    comments: "",
    origin: "Rosario",
    duration: "7 noches",
    budget: "",
    name: "",
    email: "",
    phone: "",
    preference: "WhatsApp",
  });

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      setErrors((er) => (er[k] ? { ...er, [k]: "" } : er));
    };

  const step1Complete = form.destination.trim().length >= 2 && form.approxDate !== "";
  const step2Complete = form.name.trim().length >= 2 && form.email.trim().length >= 5;

  const goToStep2 = () => {
    const next: Record<string, string> = {};
    if (form.destination.trim().length < 2)
      next.destination = "Contanos qué destino tenés en mente, aunque sea aproximado.";
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
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Decinos cómo te llamás.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Necesitamos un email válido para enviarte la propuesta.";
    if (Object.keys(next).length > 0) {
      setErrors(next);
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
        styles: experiences,
        comments: form.comments,
        status: "recibida",
        createdAt: new Date().toISOString(),
        contactName: form.name,
        contactEmail: form.email,
        contactPhone: form.phone,
        contactPreference: form.preference,
      });
      setState("done");
    }, 900);
  };

  if (state === "done") {
    return (
      <div className="rounded-[var(--radius-card)] border border-graphite-100 bg-white p-8 text-center shadow-[var(--shadow-lift)]">
        <CheckCircleIcon weight="fill" className="mx-auto size-12 text-positive-700" aria-hidden />
        <h3 className="mt-3 font-display text-xl font-bold text-petrol-900">
          Recibimos tu solicitud
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-graphite-600">
          Un asesor la revisa y te contacta por {form.preference.toLowerCase()} dentro de las
          próximas 24 horas hábiles con una primera propuesta. Podés seguirla desde{" "}
          <a href="/cuenta/cotizaciones" className="font-semibold text-teal-600 underline">
            tu cuenta
          </a>
          .
        </p>
      </div>
    );
  }

  const canAdvance = step === 1 ? step1Complete : step2Complete;

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-labelledby={headingId}
      className="rounded-[var(--radius-card)] border border-graphite-100 bg-white p-6 shadow-[var(--shadow-lift)] sm:p-8"
    >
      {/* Header + progress */}
      <div className="flex items-start justify-between gap-4">
        <h3
          id={headingId}
          className="font-display text-[1.0625rem] font-bold text-petrol-900 sm:text-xl"
        >
          Empecemos a diseñar tu viaje
        </h3>
        <p id={progressId} className="shrink-0 pt-1 text-xs font-semibold tabular text-graphite-500">
          Paso {step} de 2
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={2}
        aria-valuenow={step}
        aria-valuetext={`Paso ${step} de 2`}
        aria-labelledby={progressId}
        className="mt-3 h-1 w-full max-w-[11rem] overflow-hidden rounded-full bg-graphite-100"
      >
        <motion.span
          className="block h-full rounded-full bg-coral-500"
          initial={false}
          animate={{ width: step === 1 ? "50%" : "100%" }}
          transition={reduce ? { duration: 0 } : { duration: 0.45, ease: EASE }}
        />
      </div>

      {/* `layout` keeps the card from snapping between step heights */}
      <motion.div
        layout={!reduce}
        transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
        className="mt-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={reduce ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
              transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
              className="grid gap-5"
            >
              <TextField
                label="Destino deseado"
                required
                autoComplete="off"
                placeholder="Ej.: Caribe, Europa, Japón…"
                value={form.destination}
                onChange={set("destination")}
                error={errors.destination}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  label="Fecha aproximada"
                  required
                  type="month"
                  value={form.approxDate}
                  onChange={set("approxDate")}
                  error={errors.approxDate}
                  leadingIcon={<CalendarBlankIcon className="size-[1.05rem]" />}
                  /* Native indicator stretched over the field and hidden: one
                     calendar glyph, and the whole control opens the picker. */
                  className="[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <SelectField label="Viajeros" value={form.travelers} onChange={set("travelers")}>
                  {travelerOptions.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </SelectField>
              </div>

              <fieldset>
                <legend className="text-sm font-semibold text-graphite-800">
                  Tipo de experiencia
                </legend>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {experienceOptions.map(({ label, icon: Icon }) => {
                    const on = experiences.includes(label);
                    return (
                      <motion.button
                        key={label}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setExperiences(
                            on ? experiences.filter((x) => x !== label) : [...experiences, label],
                          )
                        }
                        whileTap={reduce ? undefined : { scale: 0.96 }}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                          on
                            ? "border-petrol-900 bg-petrol-900 text-ivory"
                            : "border-graphite-200 bg-white text-graphite-600 hover:-translate-y-px hover:border-coral-500/60 hover:text-petrol-800"
                        }`}
                      >
                        <Icon
                          weight={on ? "fill" : "regular"}
                          className={`size-4 ${on ? "text-teal-100" : "text-coral-600"}`}
                          aria-hidden
                        />
                        {label}
                      </motion.button>
                    );
                  })}
                </div>
              </fieldset>

              <TextAreaField
                label="Comentarios adicionales"
                hint="Opcional. Aniversario, dietas, algo que soñás hacer: todo suma."
                rows={3}
                placeholder="Contanos más sobre tu viaje ideal…"
                value={form.comments}
                onChange={set("comments")}
              />
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={reduce ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
              transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
              className="grid gap-5"
            >
              <div className="grid gap-5 sm:grid-cols-3">
                <SelectField label="Ciudad de salida" value={form.origin} onChange={set("origin")}>
                  {["Rosario", "Buenos Aires", "Córdoba", "Otra"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </SelectField>
                <SelectField label="Duración" value={form.duration} onChange={set("duration")}>
                  {["Fin de semana largo", "5 noches", "7 noches", "10 noches", "14 noches o más"].map(
                    (d) => (
                      <option key={d}>{d}</option>
                    ),
                  )}
                </SelectField>
                <SelectField label="Presupuesto" value={form.budget} onChange={set("budget")}>
                  <option value="">A definir</option>
                  {["Hasta USD 500", "USD 500 a 1.000", "USD 1.000 a 2.500", "Más de USD 2.500"].map(
                    (b) => (
                      <option key={b}>{b}</option>
                    ),
                  )}
                </SelectField>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  label="Nombre y apellido"
                  required
                  autoComplete="name"
                  placeholder="Ej.: Malena Ferreyra"
                  value={form.name}
                  onChange={set("name")}
                  error={errors.name}
                />
                <TextField
                  label="Email"
                  required
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="malena@ejemplo.com"
                  value={form.email}
                  onChange={set("email")}
                  error={errors.email}
                />
                <TextField
                  label="Teléfono"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+54 9 341 555 0123"
                  value={form.phone}
                  onChange={set("phone")}
                />
                <SelectField
                  label="Preferís que te contactemos por"
                  value={form.preference}
                  onChange={set("preference")}
                >
                  {contactPreferences.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </SelectField>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer: privacy note and the advancing action */}
      <div className="mt-6 flex flex-col gap-4 border-t border-graphite-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2.5 text-xs leading-snug text-graphite-500">
          <ShieldCheckIcon className="mt-px size-4 shrink-0 text-teal-600" aria-hidden />
          <span>
            Tu información está protegida.
            <br className="hidden sm:block" /> No compartimos tus datos.
          </span>
        </p>

        <div className="flex items-center gap-4 sm:justify-end">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-graphite-500 transition-colors hover:text-petrol-800"
            >
              <ArrowLeftIcon className="size-3.5" aria-hidden /> Volver
            </button>
          )}
          <Button
            type="submit"
            loading={state === "loading"}
            disabled={!canAdvance}
            aria-describedby={canAdvance ? undefined : pendingId}
            className="group w-full uppercase tracking-[0.08em] sm:w-auto"
          >
            {step === 1 ? "Continuar" : "Enviar solicitud"}
            <ArrowRightIcon
              weight="bold"
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden
            />
          </Button>
        </div>
      </div>
      {!canAdvance && (
        <p id={pendingId} className="mt-2 text-right text-xs text-graphite-500">
          {step === 1
            ? "Completá destino y fecha para continuar."
            : "Completá nombre y email para enviar la solicitud."}
        </p>
      )}
    </form>
  );
}
