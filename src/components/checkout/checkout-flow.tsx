"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BankIcon,
  CalendarPlusIcon,
  CheckCircleIcon,
  CheckIcon,
  DownloadSimpleIcon,
  LockKeyIcon,
  StorefrontIcon,
  WalletIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";
import { getPackage } from "@/data/packages";
import { extrasCatalog } from "@/data/extras";
import { computeTotal } from "@/components/packages/booking-panel";
import { formatDate, formatMoney } from "@/lib/format";
import { useStore, type BookingDraft } from "@/lib/store";
import { Button, ButtonLink } from "@/components/ui/button";
import { TextField, SelectField } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

/* ─────────────────────────── types & steps ───────────────────────── */

const steps = ["Resumen", "Pasajeros", "Adicionales", "Pago", "Confirmación"] as const;

interface Buyer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  docNumber: string;
  address: string;
}

interface PassengerForm {
  fullName: string;
  birthDate: string;
  nationality: string;
  docType: string;
  docNumber: string;
  docExpiry: string;
}

type PayMethod = "mercado-pago" | "transferencia" | "sena" | "oficina";

const emptyBuyer: Buyer = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "Argentina",
  docNumber: "",
  address: "",
};

/* ────────────────────────── progress header ──────────────────────── */

function Progress({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-1 sm:gap-2" aria-label="Progreso de la reserva">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step} className="flex items-center gap-1 sm:gap-2">
            {i > 0 && <span className={`h-px w-4 sm:w-8 ${done || active ? "bg-teal-500" : "bg-graphite-200"}`} aria-hidden />}
            <span
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold ${
                active ? "text-petrol-900" : done ? "text-teal-600" : "text-graphite-400"
              }`}
              aria-current={active ? "step" : undefined}
            >
              <span
                className={`grid size-6 place-items-center rounded-full text-[0.6875rem] tabular ${
                  done ? "bg-teal-500 text-white" : active ? "bg-petrol-900 text-ivory" : "bg-graphite-100 text-graphite-500"
                }`}
              >
                {done ? <CheckIcon weight="bold" className="size-3" aria-hidden /> : i + 1}
              </span>
              <span className="hidden md:inline">{step}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ─────────────────────────── main flow ───────────────────────────── */

export function CheckoutFlow() {
  const { draft, setDraft, addBooking, ready, user } = useStore();

  if (!ready) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-10">
        <div className="h-8 w-64 animate-pulse rounded bg-graphite-100" />
        <div className="h-40 animate-pulse rounded-2xl bg-graphite-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-graphite-100" />
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-petrol-900">No tenés una reserva en curso</h1>
        <p className="mt-2 text-graphite-600">
          Elegí un paquete y una fecha de salida para empezar. Si ya habías reservado, podés recuperarla con tu código.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/paquetes">Ver paquetes</ButtonLink>
          <ButtonLink href="/reserva/recuperar" variant="tertiary">Recuperar una reserva</ButtonLink>
        </div>
      </div>
    );
  }

  return <CheckoutSteps draft={draft} clearDraft={() => setDraft(null)} addBooking={addBooking} userEmail={user?.email} />;
}

function CheckoutSteps({
  draft,
  clearDraft,
  addBooking,
  userEmail,
}: {
  draft: BookingDraft;
  clearDraft: () => void;
  addBooking: ReturnType<typeof useStore>["addBooking"];
  userEmail?: string;
}) {
  const pkg = getPackage(draft.packageSlug);
  const [step, setStep] = useState(0);
  const [buyer, setBuyer] = useState<Buyer>({ ...emptyBuyer, email: userEmail ?? "" });
  const paxCount = draft.adults + draft.children;
  const [passengers, setPassengers] = useState<PassengerForm[]>(
    Array.from({ length: paxCount }, () => ({ fullName: "", birthDate: "", nationality: "Argentina", docType: "DNI", docNumber: "", docExpiry: "" })),
  );
  const [extras, setExtras] = useState<string[]>(draft.extras);
  const [payMethod, setPayMethod] = useState<PayMethod>("mercado-pago");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [bookingCode, setBookingCode] = useState<string | null>(null);

  const calc = useMemo(
    () => (pkg ? computeTotal(pkg, draft.departureId, draft.adults, draft.children) : null),
    [pkg, draft],
  );

  const extrasTotal = useMemo(
    () =>
      extras.reduce((sum, id) => {
        const ex = extrasCatalog.find((e) => e.id === id);
        if (!ex) return sum;
        return sum + ex.price.amount * (ex.perPerson ? paxCount : 1);
      }, 0),
    [extras, paxCount],
  );

  if (!pkg || !calc) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-petrol-900">Esta reserva ya no está disponible</h1>
        <p className="mt-2 text-graphite-600">El paquete de tu reserva en curso dejó de publicarse. Empezá de nuevo o consultanos.</p>
        <ButtonLink href="/paquetes" className="mt-6">Ver paquetes</ButtonLink>
      </div>
    );
  }

  const transferDiscount = payMethod === "transferencia" ? Math.round((calc.total + extrasTotal) * 0.05) : 0;
  const grandTotal = calc.total + extrasTotal - transferDiscount;
  const deposit = Math.max(Math.round(grandTotal * 0.2), Math.min(500, grandTotal));

  const requireBuyer = () => {
    const e: Record<string, string> = {};
    if (buyer.firstName.trim().length < 2) e.firstName = "Ingresá tu nombre como figura en tu documento.";
    if (buyer.lastName.trim().length < 2) e.lastName = "Ingresá tu apellido.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(buyer.email)) e.email = "Necesitamos un correo válido: ahí llega la confirmación.";
    if (buyer.phone.trim().length < 8) e.phone = "Ingresá un teléfono con código de área, ej. 341 5550123.";
    if (buyer.docNumber.trim().length < 6) e.docNumber = "Ingresá tu número de documento, sin puntos.";
    passengers.forEach((p, i) => {
      if (p.fullName.trim().split(" ").length < 2) e[`pax-${i}-name`] = "Nombre y apellido completos, como figuran en el documento.";
      if (!p.birthDate) e[`pax-${i}-birth`] = "La fecha de nacimiento es requerida por los prestadores.";
      if (p.docNumber.trim().length < 6) e[`pax-${i}-doc`] = "Número de documento o pasaporte.";
    });
    setErrors(e);
    if (Object.keys(e).length > 0) {
      // Focus the first invalid field
      const first = document.querySelector('[aria-invalid="true"]') as HTMLElement | null;
      first?.focus();
      return false;
    }
    return true;
  };

  const confirm = () => {
    setProcessing(true);
    // Demo: a real integration creates the booking server-side, revalidates the
    // price, and redirects to the payment gateway. Never trust client totals.
    setTimeout(() => {
      const code = `FT-${new Date().getFullYear()}-${Math.floor(1000 + (Date.now() % 9000))}`;
      addBooking({
        code,
        packageSlug: pkg.slug,
        departureId: calc.departure.id,
        adults: draft.adults,
        children: draft.children,
        extras,
        totalUsd: grandTotal,
        payMethod,
        status: payMethod === "mercado-pago" ? "confirmada" : "pendiente-de-pago",
        createdAt: new Date().toISOString(),
        holderName: `${buyer.firstName} ${buyer.lastName}`,
        holderEmail: buyer.email,
      });
      setBookingCode(code);
      clearDraft();
      setStep(4);
      setProcessing(false);
      window.scrollTo({ top: 0 });
    }, 1400);
  };

  /* ── confirmation ── */
  if (step === 4 && bookingCode) {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:Viaje ${pkg.name} (Funes Travel)`,
      `DTSTART;VALUE=DATE:${calc.departure.date.replaceAll("-", "")}`,
      `DESCRIPTION:Reserva ${bookingCode}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    return (
      <div className="mx-auto max-w-2xl py-10">
        <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-float)] text-center">
          <CheckCircleIcon weight="fill" className="mx-auto size-14 text-positive-700" aria-hidden />
          <h1 className="mt-4 font-display text-3xl font-bold text-petrol-900">
            {payMethod === "mercado-pago" ? "Tu reserva está confirmada" : "Recibimos tu reserva"}
          </h1>
          <p className="mt-2 text-graphite-600">
            Número de reserva{" "}
            <span className="font-bold text-petrol-900 tabular">{bookingCode}</span>. Te enviamos el detalle a{" "}
            <span className="font-semibold">{buyer.email}</span>.
          </p>
          <div className="mx-auto mt-6 max-w-md rounded-xl bg-sand-50 p-5 text-left text-sm">
            <p className="font-display font-bold text-petrol-900">{pkg.name}</p>
            <p className="mt-1 text-graphite-600">
              Salida {formatDate(calc.departure.date)} · {draft.adults} {draft.adults === 1 ? "adulto" : "adultos"}
              {draft.children > 0 && ` + ${draft.children} ${draft.children === 1 ? "menor" : "menores"}`}
            </p>
            <p className="mt-1 font-semibold text-graphite-800 tabular">Total: {formatMoney({ amount: grandTotal, currency: "USD" })}</p>
            <p className="mt-2 text-xs text-graphite-500">
              {payMethod === "mercado-pago"
                ? "Pago aprobado en Mercado Pago (entorno de demostración)."
                : payMethod === "transferencia"
                  ? "Te enviamos por correo los datos bancarios. La reserva queda bloqueada por 48 h a la espera de la transferencia."
                  : payMethod === "sena"
                    ? `Reservaste con seña de ${formatMoney({ amount: deposit, currency: "USD" })}. El saldo vence 35 días antes de la salida.`
                    : "Te esperamos en la oficina para completar el pago. La reserva queda bloqueada por 72 h."}
            </p>
          </div>

          <h2 className="mt-8 font-display text-lg font-bold text-petrol-900">Próximos pasos</h2>
          <ol className="mx-auto mt-3 max-w-md space-y-2 text-left text-sm text-graphite-600">
            <li className="flex gap-2"><span className="font-bold text-teal-600">1.</span> Revisá el correo de confirmación y verificá los datos de los pasajeros.</li>
            <li className="flex gap-2"><span className="font-bold text-teal-600">2.</span> Subí la documentación de viaje desde tu cuenta (te avisamos qué falta).</li>
            <li className="flex gap-2"><span className="font-bold text-teal-600">3.</span> 30 días antes de la salida te enviamos vouchers y recomendaciones finales.</li>
          </ol>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/cuenta">Ir a mi cuenta</ButtonLink>
            <Button variant="tertiary" onClick={() => window.print()}>
              <DownloadSimpleIcon className="size-4" aria-hidden /> Descargar comprobante
            </Button>
            <a
              href={`data:text/calendar;charset=utf8,${encodeURIComponent(icsData)}`}
              download={`viaje-${bookingCode}.ics`}
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-graphite-200 bg-white px-5 py-2.5 text-[0.9375rem] font-semibold text-petrol-900 hover:border-petrol-600 transition-colors"
            >
              <CalendarPlusIcon className="size-4" aria-hidden /> Agendar el viaje
            </a>
          </div>
          <a
            href={`https://wa.me/5493415550123?text=${encodeURIComponent(`Hola, acabo de reservar (${bookingCode}) y tengo una consulta.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-positive-700 hover:underline"
          >
            <WhatsappLogoIcon className="size-4.5" aria-hidden /> ¿Dudas? Escribinos y seguimos desde ahí
          </a>
        </div>
      </div>
    );
  }

  /* ── steps 0-3 ── */
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-petrol-900">Tu reserva</h1>
        <Progress current={step} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          {/* STEP 0: summary */}
          {step === 0 && (
            <section className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
              <h2 className="font-display text-xl font-bold text-petrol-900">Revisá lo que estás reservando</h2>
              <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2 text-sm">
                <div>
                  <dt className="text-graphite-500">Paquete</dt>
                  <dd className="font-semibold text-graphite-800">{pkg.name}</dd>
                </div>
                <div>
                  <dt className="text-graphite-500">Destino</dt>
                  <dd className="font-semibold text-graphite-800">{pkg.cities.join(" · ")}</dd>
                </div>
                <div>
                  <dt className="text-graphite-500">Salida</dt>
                  <dd className="font-semibold text-graphite-800">
                    {formatDate(calc.departure.date)} desde {pkg.departureCity}
                    {calc.departure.confirmed && <Badge tone="positive" className="ml-2">Confirmada</Badge>}
                  </dd>
                </div>
                <div>
                  <dt className="text-graphite-500">Duración</dt>
                  <dd className="font-semibold text-graphite-800">{pkg.nights} noches · {pkg.regime}</dd>
                </div>
                <div>
                  <dt className="text-graphite-500">Pasajeros</dt>
                  <dd className="font-semibold text-graphite-800">
                    {draft.adults} {draft.adults === 1 ? "adulto" : "adultos"}
                    {draft.children > 0 && ` + ${draft.children} ${draft.children === 1 ? "menor" : "menores"}`}
                  </dd>
                </div>
                <div>
                  <dt className="text-graphite-500">Alojamiento</dt>
                  <dd className="font-semibold text-graphite-800">{pkg.hotelName} ({pkg.hotelStars}★)</dd>
                </div>
              </dl>
              <p className="mt-4 rounded-lg bg-teal-50 px-4 py-3 text-sm text-graphite-700">
                Si algo no coincide con lo que elegiste, podés{" "}
                <Link href={`/paquetes/${pkg.slug}`} className="font-semibold text-teal-600 underline">
                  volver al paquete
                </Link>{" "}
                y ajustar fecha o pasajeros sin perder el resto.
              </p>
              <div className="mt-6 flex justify-end">
                <Button size="lg" onClick={() => setStep(1)}>Continuar con los pasajeros</Button>
              </div>
            </section>
          )}

          {/* STEP 1: buyer + passengers */}
          {step === 1 && (
            <section className="space-y-6">
              <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
                <h2 className="font-display text-xl font-bold text-petrol-900">Datos de quien reserva</h2>
                <p className="mt-1 text-sm text-graphite-500">A este contacto llegan la confirmación, los vouchers y cualquier aviso del viaje.</p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <TextField label="Nombre" required autoComplete="given-name" value={buyer.firstName} error={errors.firstName} onChange={(e) => setBuyer({ ...buyer, firstName: e.target.value })} />
                  <TextField label="Apellido" required autoComplete="family-name" value={buyer.lastName} error={errors.lastName} onChange={(e) => setBuyer({ ...buyer, lastName: e.target.value })} />
                  <TextField label="Correo electrónico" required type="email" autoComplete="email" value={buyer.email} error={errors.email} onChange={(e) => setBuyer({ ...buyer, email: e.target.value })} />
                  <TextField label="Teléfono" required type="tel" autoComplete="tel" placeholder="341 5550123" value={buyer.phone} error={errors.phone} onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })} />
                  <SelectField label="País de residencia" value={buyer.country} onChange={(e) => setBuyer({ ...buyer, country: e.target.value })}>
                    {["Argentina", "Uruguay", "Chile", "Otro"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </SelectField>
                  <TextField label="DNI" required inputMode="numeric" placeholder="Sin puntos" value={buyer.docNumber} error={errors.docNumber} onChange={(e) => setBuyer({ ...buyer, docNumber: e.target.value })} />
                  <div className="sm:col-span-2">
                    <TextField label="Domicilio" autoComplete="street-address" hint="Opcional. Solo se usa para la facturación." value={buyer.address} onChange={(e) => setBuyer({ ...buyer, address: e.target.value })} />
                  </div>
                </div>
              </div>

              {passengers.map((pax, i) => (
                <div key={i} className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
                  <h2 className="font-display text-lg font-bold text-petrol-900">
                    {i < draft.adults ? `Pasajero ${i + 1} · adulto` : `Pasajero ${i + 1} · menor`}
                  </h2>
                  <div className="mt-4 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <TextField
                        label="Nombre completo"
                        required
                        placeholder="Como figura en el documento de viaje"
                        value={pax.fullName}
                        error={errors[`pax-${i}-name`]}
                        onChange={(e) => setPassengers(passengers.map((p, j) => (j === i ? { ...p, fullName: e.target.value } : p)))}
                      />
                    </div>
                    <TextField
                      label="Fecha de nacimiento"
                      required
                      type="date"
                      value={pax.birthDate}
                      error={errors[`pax-${i}-birth`]}
                      onChange={(e) => setPassengers(passengers.map((p, j) => (j === i ? { ...p, birthDate: e.target.value } : p)))}
                    />
                    <SelectField
                      label="Nacionalidad"
                      value={pax.nationality}
                      onChange={(e) => setPassengers(passengers.map((p, j) => (j === i ? { ...p, nationality: e.target.value } : p)))}
                    >
                      {["Argentina", "Uruguaya", "Chilena", "Otra"].map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </SelectField>
                    <SelectField
                      label="Tipo de documento"
                      value={pax.docType}
                      onChange={(e) => setPassengers(passengers.map((p, j) => (j === i ? { ...p, docType: e.target.value } : p)))}
                    >
                      <option>DNI</option>
                      <option>Pasaporte</option>
                    </SelectField>
                    <TextField
                      label="Número de documento"
                      required
                      value={pax.docNumber}
                      error={errors[`pax-${i}-doc`]}
                      onChange={(e) => setPassengers(passengers.map((p, j) => (j === i ? { ...p, docNumber: e.target.value } : p)))}
                    />
                    {pax.docType === "Pasaporte" && (
                      <TextField
                        label="Vencimiento del pasaporte"
                        type="date"
                        hint="Debe superar en 6 meses la fecha de regreso"
                        value={pax.docExpiry}
                        onChange={(e) => setPassengers(passengers.map((p, j) => (j === i ? { ...p, docExpiry: e.target.value } : p)))}
                      />
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(0)}>Volver</Button>
                <Button
                  size="lg"
                  onClick={() => {
                    if (requireBuyer()) {
                      setStep(2);
                      window.scrollTo({ top: 0 });
                    }
                  }}
                >
                  Continuar con adicionales
                </Button>
              </div>
            </section>
          )}

          {/* STEP 2: extras */}
          {step === 2 && (
            <section className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
              <h2 className="font-display text-xl font-bold text-petrol-900">Sumale algo al viaje (o no)</h2>
              <p className="mt-1 text-sm text-graphite-500">
                Todo es opcional y podés agregarlo más adelante. Los precios muestran el impacto real en tu total.
              </p>
              <div className="mt-5 space-y-3">
                {extrasCatalog.map((ex) => {
                  const on = extras.includes(ex.id);
                  const impact = ex.price.amount * (ex.perPerson ? paxCount : 1);
                  return (
                    <label
                      key={ex.id}
                      className={`flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4 transition-colors ${
                        on ? "border-teal-500 bg-teal-50/50" : "border-graphite-200 hover:border-graphite-400"
                      }`}
                    >
                      <span className="flex gap-3">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => setExtras(on ? extras.filter((x) => x !== ex.id) : [...extras, ex.id])}
                          className="mt-1 size-4 accent-teal-600 cursor-pointer"
                        />
                        <span>
                          <span className="block font-semibold text-graphite-800">{ex.name}</span>
                          <span className="mt-0.5 block text-sm text-graphite-600">{ex.detail}</span>
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-bold text-petrol-900 tabular">+{formatMoney({ amount: impact, currency: "USD" })}</span>
                        <span className="text-xs text-graphite-500">{ex.perPerson ? `${formatMoney(ex.price)} por pasajero` : "por reserva"}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Volver</Button>
                <Button size="lg" onClick={() => { setStep(3); window.scrollTo({ top: 0 }); }}>
                  Continuar con el pago
                </Button>
              </div>
            </section>
          )}

          {/* STEP 3: payment */}
          {step === 3 && (
            <section className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
              <h2 className="font-display text-xl font-bold text-petrol-900">Elegí cómo pagar</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-graphite-500">
                <LockKeyIcon className="size-4" aria-hidden /> No guardamos datos de tarjetas: los pagos con tarjeta se procesan en Mercado Pago.
              </p>
              <div className="mt-5 space-y-3" role="radiogroup" aria-label="Método de pago">
                {(
                  [
                    { id: "mercado-pago", icon: WalletIcon, title: "Mercado Pago", detail: `Tarjetas de crédito hasta ${pkg.installments?.count ?? 12} cuotas, débito o dinero en cuenta. Confirmación inmediata.` },
                    { id: "transferencia", icon: BankIcon, title: "Transferencia bancaria", detail: "5% de descuento sobre el total. Te enviamos los datos y tenés 48 h para transferir." },
                    { id: "sena", icon: CheckCircleIcon, title: "Seña ahora, saldo después", detail: `Bloqueás tu lugar con ${formatMoney({ amount: deposit, currency: "USD" })} y pagás el resto hasta 35 días antes de salir.` },
                    { id: "oficina", icon: StorefrontIcon, title: "Pago en oficina", detail: "Reservamos por 72 h y lo resolvés en San José 1650, Funes: efectivo, dólares o tarjeta." },
                  ] as { id: PayMethod; icon: typeof WalletIcon; title: string; detail: string }[]
                ).map(({ id, icon: Icon, title, detail }) => (
                  <label
                    key={id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                      payMethod === id ? "border-teal-500 bg-teal-50/50" : "border-graphite-200 hover:border-graphite-400"
                    }`}
                  >
                    <input type="radio" name="pay" checked={payMethod === id} onChange={() => setPayMethod(id)} className="mt-1 accent-teal-600" />
                    <Icon className="mt-0.5 size-5 shrink-0 text-teal-600" aria-hidden />
                    <span>
                      <span className="block font-semibold text-graphite-800">{title}</span>
                      <span className="mt-0.5 block text-sm text-graphite-600">{detail}</span>
                    </span>
                  </label>
                ))}
              </div>

              <p className="mt-5 rounded-lg bg-sand-50 px-4 py-3 text-xs leading-relaxed text-graphite-600">
                Al confirmar aceptás los{" "}
                <Link href="/terminos" className="font-semibold text-teal-600 underline">términos y condiciones</Link> y la{" "}
                <Link href="/politica-de-cancelaciones" className="font-semibold text-teal-600 underline">política de cancelaciones</Link>.
                El precio final en pesos se calcula al tipo de cambio del día de pago e incluye los impuestos vigentes discriminados en el comprobante.
              </p>

              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}>Volver</Button>
                <Button size="lg" loading={processing} onClick={confirm}>
                  {payMethod === "mercado-pago" ? "Pagar y confirmar reserva" : "Confirmar reserva"}
                </Button>
              </div>
            </section>
          )}
        </div>

        {/* Sticky order summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
            <h2 className="font-display text-base font-bold text-petrol-900">Resumen</h2>
            <p className="mt-2 text-sm font-semibold text-graphite-800">{pkg.name}</p>
            <p className="text-xs text-graphite-500">
              {formatDate(calc.departure.date)} · {pkg.nights} noches · {draft.adults + draft.children} pax
            </p>
            <dl className="mt-4 space-y-1.5 border-t border-graphite-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-graphite-600">Paquete</dt>
                <dd className="font-semibold text-graphite-800 tabular">{formatMoney({ amount: calc.total, currency: "USD" })}</dd>
              </div>
              {extras.map((id) => {
                const ex = extrasCatalog.find((e) => e.id === id);
                if (!ex) return null;
                return (
                  <div key={id} className="flex justify-between">
                    <dt className="text-graphite-600">{ex.name}</dt>
                    <dd className="font-semibold text-graphite-800 tabular">
                      +{formatMoney({ amount: ex.price.amount * (ex.perPerson ? paxCount : 1), currency: "USD" })}
                    </dd>
                  </div>
                );
              })}
              {transferDiscount > 0 && (
                <div className="flex justify-between text-positive-700">
                  <dt>Descuento por transferencia (5%)</dt>
                  <dd className="font-semibold tabular">-{formatMoney({ amount: transferDiscount, currency: "USD" })}</dd>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-graphite-100 pt-2.5">
                <dt className="font-semibold text-graphite-800">Total</dt>
                <dd className="font-display text-2xl font-bold text-petrol-900 tabular">
                  {formatMoney({ amount: grandTotal, currency: "USD" })}
                </dd>
              </div>
              {payMethod === "sena" && step === 3 && (
                <div className="flex justify-between text-graphite-600">
                  <dt>Pagás hoy (seña)</dt>
                  <dd className="font-semibold tabular">{formatMoney({ amount: deposit, currency: "USD" })}</dd>
                </div>
              )}
            </dl>
            <p className="mt-3 text-xs text-graphite-500">
              {pkg.taxesIncluded ? "Impuestos incluidos." : "Más impuestos y percepciones según normativa vigente."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
