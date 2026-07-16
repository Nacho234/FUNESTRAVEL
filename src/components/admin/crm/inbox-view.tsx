"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarPlusIcon,
  CaretDownIcon,
  EnvelopeSimpleIcon,
  FacebookLogoIcon,
  GlobeIcon,
  InstagramLogoIcon,
  PaperPlaneTiltIcon,
  PhoneIcon,
  UserPlusIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";
import {
  conversations as seedConversations,
  type Conversation,
  type ConversationChannel,
  type ConversationStatus,
} from "@/data/admin-crm";
import { AdminButton, Drawer, EmptyState, PageHeader, StatusBadge, useToast } from "@/components/admin/ui";

/** Omnichannel inbox: list + conversation panel (drawer on mobile). */

const channelMeta: Record<ConversationChannel, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  whatsapp: { label: "WhatsApp", icon: WhatsappLogoIcon },
  correo: { label: "Correo", icon: EnvelopeSimpleIcon },
  instagram: { label: "Instagram", icon: InstagramLogoIcon },
  facebook: { label: "Facebook", icon: FacebookLogoIcon },
  telefono: { label: "Teléfono", icon: PhoneIcon },
  web: { label: "Web", icon: GlobeIcon },
};

const statusOptions: ConversationStatus[] = [
  "nueva",
  "abierta",
  "esperando cliente",
  "esperando proveedor",
  "cotización enviada",
  "resuelta",
  "cerrada",
];

const advisors = ["Sin asignar", "Sofía Gachet", "Marcela Buttini", "Diego Anselmi"];

const quickReplies = [
  { label: "Precios y disponibilidad", text: "¡Hola! Gracias por escribirnos. Te paso precios y disponibilidad actualizados en un rato, ¿sobre qué fechas estás pensando?" },
  { label: "Requisitos de documentación", text: "Para ese destino necesitás pasaporte con 6 meses de vigencia desde la fecha de regreso. Si viajan menores, contanos con quién viajan así te indicamos si hace falta autorización." },
  { label: "Formas de pago", text: "Podés pagar con Mercado Pago (hasta 12 cuotas con bancos adheridos), transferencia con 5% de descuento en la porción terrestre, o señar con el 20% y pagar el saldo hasta 35 días antes." },
];

function ConversationThread({
  conv,
  onUpdate,
  showToast,
}: {
  conv: Conversation;
  onUpdate: (updater: (c: Conversation) => Conversation) => void;
  showToast: (m: string) => void;
}) {
  const [reply, setReply] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const Icon = channelMeta[conv.channel].icon;

  const send = () => {
    const text = reply.trim();
    if (!text) return;
    onUpdate((c) => ({
      ...c,
      status: c.status === "nueva" ? "abierta" : c.status,
      messages: [...c.messages, { author: "asesor", text, time: "ahora" }],
    }));
    setReply("");
    showToast("Respuesta enviada");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="border-b border-graphite-100 pb-3">
        <div className="flex flex-wrap items-center gap-3">
          <Image src={`https://i.pravatar.cc/64?img=${conv.avatarId}`} alt="" width={38} height={38} className="rounded-full" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-bold text-petrol-900">{conv.customer}</p>
            <p className="flex items-center gap-1.5 text-xs text-graphite-500">
              <Icon className="size-3.5" aria-hidden />
              {channelMeta[conv.channel].label} · {conv.context}
            </p>
          </div>
          <select
            value={conv.status}
            onChange={(e) => {
              onUpdate((c) => ({ ...c, status: e.target.value as ConversationStatus }));
              showToast(`Estado: ${e.target.value}`);
            }}
            className="rounded-[var(--radius-control)] border border-graphite-200 px-2.5 py-1.5 text-xs font-semibold cursor-pointer focus:border-teal-500 focus:outline-none"
            aria-label="Estado de la conversación"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <select
            value={conv.advisor}
            onChange={(e) => {
              onUpdate((c) => ({ ...c, advisor: e.target.value }));
              showToast(`Asignada a ${e.target.value}`);
            }}
            className="rounded-[var(--radius-control)] border border-graphite-200 px-2.5 py-1.5 text-xs cursor-pointer focus:border-teal-500 focus:outline-none"
            aria-label="Asignar asesor"
          >
            {advisors.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          <Link
            href="/admin/cotizaciones?nueva=1"
            className="rounded-[var(--radius-control)] border border-graphite-200 px-2.5 py-1.5 text-xs font-semibold text-petrol-900 hover:border-petrol-600"
          >
            Convertir en cotización
          </Link>
          <AdminButton size="sm" variant="secondary" onClick={() => showToast(`${conv.customer} agregado como cliente`)}>
            <UserPlusIcon className="size-3.5" aria-hidden /> Convertir en cliente
          </AdminButton>
          <span className="ml-auto flex items-center gap-1.5">
            <label htmlFor={`fu-${conv.id}`} className="sr-only">
              Programar seguimiento
            </label>
            <input
              id={`fu-${conv.id}`}
              type="date"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              className="rounded-[var(--radius-control)] border border-graphite-200 px-2 py-1.5 text-xs focus:border-teal-500 focus:outline-none"
            />
            <AdminButton
              size="sm"
              variant="secondary"
              onClick={() => {
                if (followUp) showToast(`Seguimiento programado para el ${followUp.split("-").reverse().join("/")}`);
              }}
            >
              <CalendarPlusIcon className="size-3.5" aria-hidden /> Seguimiento
            </AdminButton>
          </span>
        </div>
      </div>

      {/* Thread */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto py-4">
        {conv.messages.map((m, i) => (
          <div key={i} className={`flex ${m.author === "asesor" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                m.author === "asesor" ? "rounded-br-sm bg-petrol-100/70 text-petrol-950" : "rounded-bl-sm bg-graphite-100 text-graphite-800"
              }`}
            >
              <p>{m.text}</p>
              <p className={`mt-0.5 text-[0.625rem] ${m.author === "asesor" ? "text-petrol-800/60" : "text-graphite-400"}`}>{m.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Internal notes */}
      <div className="border-t border-graphite-100 pt-2.5">
        <button
          onClick={() => setNotesOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-lg bg-warning-100/40 px-3 py-2 text-xs font-semibold text-warning-700 cursor-pointer"
          aria-expanded={notesOpen}
        >
          Notas internas ({conv.internalNotes.length})
          <CaretDownIcon className={`size-3.5 transition-transform ${notesOpen ? "rotate-180" : ""}`} aria-hidden />
        </button>
        {notesOpen && (
          <div className="mt-1.5 rounded-lg bg-warning-100/40 px-3 py-2">
            {conv.internalNotes.length === 0 ? (
              <p className="text-xs text-graphite-500">Sin notas internas.</p>
            ) : (
              <ul className="list-inside list-disc space-y-1 text-xs text-graphite-700">
                {conv.internalNotes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Quick replies + composer */}
      <div className="pt-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {quickReplies.map((q) => (
            <button
              key={q.label}
              onClick={() => setReply((r) => (r ? `${r}\n${q.text}` : q.text))}
              className="rounded-full border border-graphite-200 px-2.5 py-1 text-xs font-medium text-graphite-600 hover:border-teal-500 hover:text-petrol-800 cursor-pointer"
            >
              {q.label}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <textarea
            rows={2}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={`Responder por ${channelMeta[conv.channel].label}…`}
            className="min-h-[3.25rem] flex-1 rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            aria-label="Respuesta"
          />
          <AdminButton onClick={send} aria-label="Enviar respuesta">
            <PaperPlaneTiltIcon className="size-4" aria-hidden /> Enviar
          </AdminButton>
        </div>
      </div>
    </div>
  );
}

export function InboxView({ startCreating = false }: { startCreating?: boolean }) {
  const [items, setItems] = useState<Conversation[]>(seedConversations);
  const [activeId, setActiveId] = useState<string>(seedConversations[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [creating, setCreating] = useState(startCreating);
  const [query, setQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [advisorFilter, setAdvisorFilter] = useState("");
  const [draft, setDraft] = useState({ customer: "", channel: "telefono" as ConversationChannel, message: "" });
  const { showToast, toastNode } = useToast();

  const filtered = useMemo(
    () =>
      items.filter((c) => {
        const q = query.trim().toLowerCase();
        if (q && !`${c.customer} ${c.context} ${c.destination ?? ""}`.toLowerCase().includes(q)) return false;
        if (channelFilter && c.channel !== channelFilter) return false;
        if (statusFilter && c.status !== statusFilter) return false;
        if (advisorFilter && c.advisor !== advisorFilter) return false;
        return true;
      }),
    [items, query, channelFilter, statusFilter, advisorFilter],
  );

  const active = items.find((c) => c.id === activeId) ?? null;
  const updateActive = (updater: (c: Conversation) => Conversation) =>
    setItems((its) => its.map((c) => (c.id === activeId ? updater(c) : c)));

  const list = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-2 border-b border-graphite-100 pb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar conversaciones…"
          className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          aria-label="Buscar conversaciones"
        />
        <div className="flex gap-1.5">
          {(
            [
              { v: channelFilter, set: setChannelFilter, label: "Canal", opts: Object.keys(channelMeta) },
              { v: statusFilter, set: setStatusFilter, label: "Estado", opts: statusOptions },
              { v: advisorFilter, set: setAdvisorFilter, label: "Asesor", opts: advisors },
            ] as const
          ).map((f) => (
            <select
              key={f.label}
              value={f.v}
              onChange={(e) => f.set(e.target.value)}
              className="min-w-0 flex-1 rounded-[var(--radius-control)] border border-graphite-200 px-2 py-1.5 text-xs cursor-pointer focus:border-teal-500 focus:outline-none"
              aria-label={f.label}
            >
              <option value="">{f.label}</option>
              {f.opts.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>
      <ul className="min-h-0 flex-1 divide-y divide-graphite-100 overflow-y-auto">
        {filtered.length === 0 && (
          <li className="p-4">
            <EmptyState title="Sin conversaciones" detail="Probá quitar filtros o creá una consulta manual." />
          </li>
        )}
        {filtered.map((c) => {
          const Icon = channelMeta[c.channel].icon;
          const last = c.messages.at(-1);
          return (
            <li key={c.id}>
              <button
                onClick={() => {
                  setActiveId(c.id);
                  setMobileOpen(true);
                }}
                className={`flex w-full items-start gap-2.5 px-3 py-3 text-left transition-colors cursor-pointer ${
                  activeId === c.id ? "bg-petrol-50/60" : "hover:bg-sand-50"
                }`}
              >
                <Image src={`https://i.pravatar.cc/64?img=${c.avatarId}`} alt="" width={34} height={34} className="mt-0.5 rounded-full" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    {c.status === "nueva" && <span className="size-1.5 shrink-0 rounded-full bg-coral-500" aria-label="Nueva" />}
                    <span className="truncate text-sm font-semibold text-graphite-800">{c.customer}</span>
                    <Icon className="size-3.5 shrink-0 text-graphite-400" aria-hidden />
                    <span className="ml-auto shrink-0 text-[0.625rem] text-graphite-400 tabular">{c.date.slice(5).split("-").reverse().join("/")}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-graphite-500">{last?.text}</span>
                  <span className="mt-1 block">
                    <StatusBadge status={c.status} />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Consultas"
        description="Bandeja omnicanal: web, WhatsApp, correo, redes y teléfono en un solo lugar."
        breadcrumb={[{ label: "Consultas" }]}
        actions={<AdminButton onClick={() => setCreating(true)}>Crear consulta</AdminButton>}
      />

      <div className="grid h-[calc(100dvh-16rem)] min-h-[480px] grid-cols-1 overflow-hidden rounded-xl border border-graphite-200/70 bg-white lg:grid-cols-[360px_1fr]">
        <div className="min-h-0 border-r border-graphite-100 p-3">{list}</div>
        <div className="hidden min-h-0 p-4 lg:block">
          {active ? (
            <ConversationThread conv={active} onUpdate={updateActive} showToast={showToast} />
          ) : (
            <EmptyState title="Elegí una conversación" detail="Seleccioná una consulta de la lista para ver el hilo completo." />
          )}
        </div>
      </div>

      {/* Mobile: conversation in a drawer */}
      <div className="lg:hidden">
        <Drawer open={mobileOpen && Boolean(active)} onClose={() => setMobileOpen(false)} title={active?.customer ?? ""} wide>
          {active && (
            <div className="h-[70dvh]">
              <ConversationThread conv={active} onUpdate={updateActive} showToast={showToast} />
            </div>
          )}
        </Drawer>
      </div>

      {/* Manual consulta */}
      <Drawer open={creating} onClose={() => setCreating(false)} title="Crear consulta manual">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.customer.trim().length < 3 || draft.message.trim().length < 5) {
              showToast("Completá cliente y mensaje");
              return;
            }
            const nueva: Conversation = {
              id: `CV-${3102 + items.length}`,
              customer: draft.customer.trim(),
              avatarId: 7,
              channel: draft.channel,
              date: new Date().toISOString().slice(0, 10),
              advisor: "Sin asignar",
              context: draft.message.slice(0, 60),
              status: "nueva",
              priority: "media",
              tags: [],
              messages: [{ author: "cliente", text: draft.message.trim(), time: "ahora" }],
              internalNotes: [],
            };
            setItems((its) => [nueva, ...its]);
            setActiveId(nueva.id);
            setCreating(false);
            setDraft({ customer: "", channel: "telefono", message: "" });
            showToast("Consulta creada");
          }}
        >
          <div>
            <label htmlFor="mc-cliente" className="mb-1 block text-sm font-semibold text-graphite-800">
              Cliente
            </label>
            <input
              id="mc-cliente"
              value={draft.customer}
              onChange={(e) => setDraft((d) => ({ ...d, customer: e.target.value }))}
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="mc-canal" className="mb-1 block text-sm font-semibold text-graphite-800">
              Origen
            </label>
            <select
              id="mc-canal"
              value={draft.channel}
              onChange={(e) => setDraft((d) => ({ ...d, channel: e.target.value as ConversationChannel }))}
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm cursor-pointer focus:border-teal-500 focus:outline-none"
            >
              {Object.entries(channelMeta).map(([id, m]) => (
                <option key={id} value={id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="mc-msg" className="mb-1 block text-sm font-semibold text-graphite-800">
              Mensaje o motivo
            </label>
            <textarea
              id="mc-msg"
              rows={4}
              value={draft.message}
              onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))}
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              placeholder="Qué consultó el cliente y qué quedó pendiente."
            />
          </div>
          <AdminButton type="submit" className="w-full">
            Crear consulta
          </AdminButton>
        </form>
      </Drawer>
    </div>
  );
}
