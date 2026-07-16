"use client";

import Link from "next/link";
import { useState } from "react";
import { adminSettings } from "@/data/admin-system";
import { branches } from "@/data/admin-core";
import { AdminButton, PageHeader, SectionCard, useToast } from "@/components/admin/ui";

/** Settings with internal side navigation per section. */

const sections = [
  { id: "empresa", label: "Empresa" },
  { id: "sucursales", label: "Sucursales" },
  { id: "monedas", label: "Monedas y tipo de cambio" },
  { id: "impuestos", label: "Impuestos y comisiones" },
  { id: "pagos", label: "Medios de pago" },
  { id: "plantillas", label: "Plantillas" },
  { id: "numeracion", label: "Numeración" },
  { id: "politicas", label: "Políticas" },
];

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold text-graphite-800">{label}</span>
      <input defaultValue={defaultValue} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none" />
    </label>
  );
}

export function SettingsAdmin() {
  const [payments, setPayments] = useState(adminSettings.paymentMethods);
  const { showToast, toastNode } = useToast();
  const save = (what: string) => showToast(`${what} guardado (demo)`);

  return (
    <div className="mx-auto max-w-[1200px]">
      {toastNode}
      <PageHeader
        title="Configuración"
        description="Datos de la empresa, monedas, impuestos, medios de pago y plantillas de comunicación."
        breadcrumb={[{ label: "Configuración" }]}
      />

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        {/* Internal nav */}
        <nav aria-label="Secciones de configuración" className="lg:sticky lg:top-20 lg:self-start">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#cfg-${s.id}`}
                  className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-graphite-600 hover:bg-white hover:text-petrol-900"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-5">
          <div id="cfg-empresa" className="scroll-mt-20">
            <SectionCard title="Empresa" actions={<AdminButton size="sm" onClick={() => save("Datos de empresa")}>Guardar</AdminButton>}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Razón social" defaultValue={adminSettings.company.legalName} />
                <Field label="Habilitación" defaultValue={adminSettings.company.license} />
                <Field label="Dirección" defaultValue={adminSettings.company.address} />
                <Field label="Horarios" defaultValue={adminSettings.company.hours} />
                <Field label="Teléfono / WhatsApp" defaultValue={adminSettings.company.whatsapp} />
                <Field label="Correo general" defaultValue={adminSettings.company.email} />
                <Field label="Correo de administración" defaultValue={adminSettings.company.billingEmail} />
              </div>
            </SectionCard>
          </div>

          <div id="cfg-sucursales" className="scroll-mt-20">
            <SectionCard title="Sucursales" actions={<AdminButton size="sm" onClick={() => save("Sucursales")}>Guardar</AdminButton>}>
              <ul className="divide-y divide-graphite-100">
                {branches.map((b) => (
                  <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-graphite-800">{b.name}</p>
                      <p className="text-xs text-graphite-500">{adminSettings.company.hours}</p>
                    </div>
                    <AdminButton size="sm" variant="ghost" onClick={() => save(`Horarios de ${b.name}`)}>
                      Editar horarios
                    </AdminButton>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>

          <div id="cfg-monedas" className="scroll-mt-20">
            <SectionCard title="Monedas y tipo de cambio" actions={<AdminButton size="sm" onClick={() => save("Tipo de cambio")}>Guardar</AdminButton>}>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Moneda principal" defaultValue={adminSettings.currencies.primary} />
                <Field label="Moneda secundaria" defaultValue={adminSettings.currencies.secondary} />
                <Field label="1 USD =" defaultValue={`${adminSettings.currencies.exchangeRate} ARS`} />
              </div>
              <p className="mt-3 text-xs text-graphite-500">
                Fuente: {adminSettings.currencies.exchangeSource} · última actualización {adminSettings.currencies.lastUpdate}. Con la
                integración de cotización activa, este valor se actualiza automáticamente.
              </p>
            </SectionCard>
          </div>

          <div id="cfg-impuestos" className="scroll-mt-20">
            <SectionCard title="Impuestos y comisiones" actions={<AdminButton size="sm" onClick={() => save("Impuestos")}>Guardar</AdminButton>}>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="IVA (%)" defaultValue={String(adminSettings.taxes.iva)} />
                <Field label="Comisión por defecto (%)" defaultValue={String(adminSettings.taxes.defaultCommission)} />
                <Field label="Percepciones" defaultValue={adminSettings.taxes.perceptions} />
              </div>
            </SectionCard>
          </div>

          <div id="cfg-pagos" className="scroll-mt-20">
            <SectionCard title="Medios de pago" actions={<AdminButton size="sm" onClick={() => save("Medios de pago")}>Guardar</AdminButton>}>
              <ul className="divide-y divide-graphite-100">
                {payments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <span className="text-sm text-graphite-800">{p.label}</span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={p.enabled}
                        onChange={() => setPayments((ps) => ps.map((x) => (x.id === p.id ? { ...x, enabled: !x.enabled } : x)))}
                        className="peer sr-only"
                      />
                      <span className="h-5 w-9 rounded-full bg-graphite-200 transition-colors peer-checked:bg-teal-500" />
                      <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
                    </label>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>

          <div id="cfg-plantillas" className="scroll-mt-20">
            <SectionCard
              title="Plantillas de comunicación"
              description="Variables disponibles: {cliente}, {reserva}, {fecha}."
              actions={<AdminButton size="sm" onClick={() => save("Plantillas")}>Guardar</AdminButton>}
            >
              <div className="space-y-4">
                {adminSettings.templates.map((t) => (
                  <label key={t.id} className="block text-sm">
                    <span className="mb-1 block font-semibold text-graphite-800">{t.name}</span>
                    <textarea rows={3} defaultValue={t.body} className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm leading-relaxed focus:border-teal-500 focus:outline-none" />
                  </label>
                ))}
              </div>
            </SectionCard>
          </div>

          <div id="cfg-numeracion" className="scroll-mt-20">
            <SectionCard title="Numeración de comprobantes" actions={<AdminButton size="sm" onClick={() => save("Numeración")}>Guardar</AdminButton>}>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Prefijo de reservas" defaultValue={adminSettings.numbering.bookingPrefix} />
                <Field label="Próxima reserva" defaultValue={String(adminSettings.numbering.nextBooking)} />
                <Field label="Prefijo de cotizaciones" defaultValue={adminSettings.numbering.quotePrefix} />
                <Field label="Próxima cotización" defaultValue={String(adminSettings.numbering.nextQuote)} />
                <Field label="Prefijo de pagos" defaultValue={adminSettings.numbering.paymentPrefix} />
                <Field label="Próximo pago" defaultValue={String(adminSettings.numbering.nextPayment)} />
              </div>
            </SectionCard>
          </div>

          <div id="cfg-politicas" className="scroll-mt-20">
            <SectionCard title="Políticas públicas" description="Documentos publicados en el sitio.">
              <ul className="space-y-1.5 text-sm">
                {[
                  { label: "Términos y condiciones", href: "/terminos" },
                  { label: "Política de privacidad", href: "/privacidad" },
                  { label: "Política de cancelaciones", href: "/politica-de-cancelaciones" },
                  { label: "Medios de pago", href: "/medios-de-pago" },
                ].map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} target="_blank" className="text-teal-600 hover:underline">
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
