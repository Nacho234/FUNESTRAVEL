"use client";

import { useState } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  DownloadSimpleIcon,
  FilePdfIcon,
  PaperPlaneTiltIcon,
  WarningCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { crmDocuments as seed, type CrmDocument, type DocumentStatus, type DocumentType } from "@/data/admin-crm";
import { formatDate } from "@/lib/format";
import {
  AdminButton,
  DataTable,
  Drawer,
  KVGrid,
  PageHeader,
  StatusBadge,
  useToast,
  type Column,
  type FilterDef,
} from "@/components/admin/ui";

/** Travel documents: review queue with approve / reject / re-request flow. */

const docTypes: DocumentType[] = ["pasaporte", "DNI", "visa", "autorización menor", "voucher", "factura", "itinerario"];

export function DocumentsView({ startCreating = false }: { startCreating?: boolean }) {
  const [items, setItems] = useState<CrmDocument[]>(seed);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [creating, setCreating] = useState(startCreating);
  const [draft, setDraft] = useState({ type: "pasaporte" as DocumentType, person: "", booking: "" });
  const { showToast, toastNode } = useToast();

  const selected = items.find((d) => d.id === selectedId) ?? null;

  const patch = (id: string, p: Partial<CrmDocument>) => setItems((its) => its.map((d) => (d.id === id ? { ...d, ...p } : d)));

  const tiles = [
    { label: "Para revisar", count: items.filter((d) => d.status === "en revisión" || d.status === "cargado").length, icon: ClockIcon, tone: "text-warning-700" },
    { label: "Aprobados", count: items.filter((d) => d.status === "aprobado").length, icon: CheckCircleIcon, tone: "text-positive-700" },
    { label: "Rechazados", count: items.filter((d) => d.status === "rechazado").length, icon: XCircleIcon, tone: "text-danger-700" },
    { label: "Vencidos", count: items.filter((d) => d.status === "vencido").length, icon: WarningCircleIcon, tone: "text-danger-700" },
  ];

  const columns: Column<CrmDocument>[] = [
    {
      id: "name",
      header: "Documento",
      essential: true,
      cell: (d) => (
        <div className="flex items-center gap-2">
          <FilePdfIcon className="size-4.5 shrink-0 text-graphite-400" aria-hidden />
          <div>
            <p className="max-w-xs truncate font-semibold text-graphite-800">{d.name}</p>
            <p className="text-xs capitalize text-graphite-500">{d.type}</p>
          </div>
        </div>
      ),
      sortValue: (d) => d.name,
    },
    { id: "person", header: "Pasajero / cliente", cell: (d) => d.person, sortValue: (d) => d.person },
    { id: "booking", header: "Reserva", cell: (d) => <span className="tabular text-xs">{d.booking ?? "—"}</span> },
    {
      id: "expiry",
      header: "Vencimiento",
      cell: (d) => (d.expiry ? <span className="tabular text-xs">{formatDate(d.expiry)}</span> : <span className="text-graphite-400">—</span>),
      sortValue: (d) => d.expiry ?? "9999",
    },
    { id: "reviewer", header: "Revisor", cell: (d) => d.reviewer ?? "—" },
    { id: "status", header: "Estado", essential: true, cell: (d) => <StatusBadge status={d.status} />, sortValue: (d) => d.status },
  ];

  const filters: FilterDef<CrmDocument>[] = [
    { id: "type", label: "Tipo", options: docTypes, matches: (d, v) => d.type === v },
    {
      id: "status",
      label: "Estado",
      options: ["pendiente", "cargado", "en revisión", "aprobado", "rechazado", "vencido"] satisfies DocumentStatus[],
      matches: (d, v) => d.status === v,
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Documentación"
        description="Pasaportes, visas, autorizaciones, vouchers y facturas: revisión y estados en un solo lugar."
        breadcrumb={[{ label: "Documentación" }]}
        actions={<AdminButton onClick={() => setCreating(true)}>Subir documento</AdminButton>}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="flex items-center gap-3 rounded-xl border border-graphite-200/70 bg-white px-4 py-3">
            <t.icon className={`size-5 shrink-0 ${t.count === 0 ? "text-graphite-300" : t.tone}`} aria-hidden />
            <div>
              <p className="font-display text-lg font-bold text-petrol-900 tabular">{t.count}</p>
              <p className="text-xs text-graphite-500">{t.label}</p>
            </div>
          </div>
        ))}
      </div>

      <DataTable
        rows={items}
        columns={columns}
        rowKey={(d) => d.id}
        searchKeys={(d) => `${d.name} ${d.person} ${d.booking ?? ""} ${d.type}`}
        searchPlaceholder="Buscar por nombre, pasajero o reserva…"
        filters={filters}
        exportName="documentacion"
        onRowClick={(d) => {
          setSelectedId(d.id);
          setRejecting(false);
          setRejectReason("");
        }}
        bulkActions={[
          {
            label: "Aprobar seleccionados",
            onApply: (rows) => {
              rows.forEach((r) => patch(r.id, { status: "aprobado", reviewer: "Sofía Gachet" }));
              showToast(`${rows.length} documentos aprobados`);
            },
          },
        ]}
        emptyTitle="Sin documentos con esos criterios"
        emptyDetail="Subí un documento o pedile al cliente que lo cargue desde su cuenta."
      />

      {/* Detail */}
      <Drawer open={Boolean(selected)} onClose={() => setSelectedId(null)} title={selected?.name ?? ""}>
        {selected && (
          <div className="space-y-5">
            {/* Preview placeholder */}
            <div className="grid h-44 place-items-center rounded-xl bg-sand-100">
              <div className="text-center">
                <FilePdfIcon className="mx-auto size-10 text-graphite-400" aria-hidden />
                <p className="mt-2 max-w-[16rem] truncate px-4 text-xs text-graphite-500">{selected.name}</p>
              </div>
            </div>

            <KVGrid
              items={[
                { label: "Tipo", value: <span className="capitalize">{selected.type}</span> },
                { label: "Pasajero / cliente", value: selected.person },
                { label: "Reserva", value: selected.booking ?? "—" },
                { label: "Estado", value: <StatusBadge status={selected.status} /> },
                { label: "Cargado", value: selected.uploadedAt ? formatDate(selected.uploadedAt) : "Pendiente" },
                { label: "Vencimiento", value: selected.expiry ? formatDate(selected.expiry) : "—" },
                { label: "Revisor", value: selected.reviewer ?? "—" },
              ]}
            />

            {selected.status === "rechazado" && selected.rejectReason && (
              <div className="rounded-xl border border-danger-100 bg-danger-100/40 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-danger-700">Motivo del rechazo</p>
                <p className="mt-1 text-sm text-graphite-700">{selected.rejectReason}</p>
              </div>
            )}

            {rejecting ? (
              <div className="rounded-xl border border-danger-100 p-4">
                <label htmlFor="doc-reject" className="mb-1 block text-sm font-semibold text-graphite-800">
                  Motivo del rechazo
                </label>
                <textarea
                  id="doc-reject"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="El cliente lo va a ver: explicá qué corregir."
                  className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
                <div className="mt-2 flex gap-2">
                  <AdminButton
                    variant="danger"
                    onClick={() => {
                      if (rejectReason.trim().length < 5) {
                        showToast("Explicá el motivo para que el cliente sepa qué corregir");
                        return;
                      }
                      patch(selected.id, { status: "rechazado", rejectReason: rejectReason.trim(), reviewer: "Sofía Gachet" });
                      setRejecting(false);
                      showToast("Documento rechazado, el cliente fue notificado");
                    }}
                  >
                    Confirmar rechazo
                  </AdminButton>
                  <AdminButton variant="ghost" onClick={() => setRejecting(false)}>
                    Cancelar
                  </AdminButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selected.status !== "aprobado" && (
                  <AdminButton
                    onClick={() => {
                      patch(selected.id, { status: "aprobado", reviewer: "Sofía Gachet" });
                      showToast("Documento aprobado");
                    }}
                  >
                    <CheckCircleIcon className="size-4" aria-hidden /> Aprobar
                  </AdminButton>
                )}
                {selected.status !== "rechazado" && (
                  <AdminButton variant="danger" onClick={() => setRejecting(true)}>
                    <XCircleIcon className="size-4" aria-hidden /> Rechazar
                  </AdminButton>
                )}
                <AdminButton
                  variant="secondary"
                  onClick={() => {
                    patch(selected.id, { status: "pendiente", uploadedAt: undefined });
                    showToast(`Se pidió nuevamente el documento a ${selected.person}`);
                  }}
                >
                  <PaperPlaneTiltIcon className="size-4" aria-hidden /> Solicitar nuevamente
                </AdminButton>
                <AdminButton variant="secondary" onClick={() => showToast("Descarga disponible al conectar el almacenamiento")}>
                  <DownloadSimpleIcon className="size-4" aria-hidden /> Descargar
                </AdminButton>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Upload */}
      <Drawer open={creating} onClose={() => setCreating(false)} title="Subir documento">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.person.trim().length < 3) {
              showToast("Indicá a qué pasajero o cliente pertenece");
              return;
            }
            const nuevo: CrmDocument = {
              id: `D-${5032 + items.length}`,
              name: `${draft.type} ${draft.person.trim()}.pdf`,
              type: draft.type,
              person: draft.person.trim(),
              booking: draft.booking.trim() || undefined,
              status: "en revisión",
              uploadedAt: new Date().toISOString().slice(0, 10),
              reviewer: "Sofía Gachet",
            };
            setItems((its) => [nuevo, ...its]);
            setCreating(false);
            setDraft({ type: "pasaporte", person: "", booking: "" });
            showToast("Documento cargado para revisión");
          }}
        >
          <div>
            <label htmlFor="up-type" className="mb-1 block text-sm font-semibold text-graphite-800">
              Tipo de documento
            </label>
            <select
              id="up-type"
              value={draft.type}
              onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value as DocumentType }))}
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm capitalize cursor-pointer focus:border-teal-500 focus:outline-none"
            >
              {docTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="up-person" className="mb-1 block text-sm font-semibold text-graphite-800">
              Pasajero o cliente
            </label>
            <input
              id="up-person"
              value={draft.person}
              onChange={(e) => setDraft((d) => ({ ...d, person: e.target.value }))}
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="up-booking" className="mb-1 block text-sm font-semibold text-graphite-800">
              Reserva (opcional)
            </label>
            <input
              id="up-booking"
              value={draft.booking}
              onChange={(e) => setDraft((d) => ({ ...d, booking: e.target.value }))}
              placeholder="FT-2026-…"
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="up-file" className="mb-1 block text-sm font-semibold text-graphite-800">
              Archivo
            </label>
            <input
              id="up-file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full rounded-[var(--radius-control)] border border-dashed border-graphite-200 px-3 py-4 text-sm text-graphite-500 file:mr-3 file:rounded-lg file:border-0 file:bg-petrol-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-petrol-800"
            />
            <p className="mt-1 text-xs text-graphite-500">JPG, PNG o PDF de hasta 10 MB. En demo el archivo no se sube.</p>
          </div>
          <AdminButton type="submit" className="w-full">
            Cargar documento
          </AdminButton>
        </form>
      </Drawer>
    </div>
  );
}
