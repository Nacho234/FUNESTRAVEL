"use client";

import { useState } from "react";
import { ArrowClockwiseIcon, PlugsIcon } from "@phosphor-icons/react";
import { integrationsList, type IntegrationInfo } from "@/data/admin-system";
import { AdminButton, Drawer, PageHeader, useToast } from "@/components/admin/ui";

/** Integration cards with status, masked credentials, logs and test actions. */

const statusTone: Record<IntegrationInfo["status"], string> = {
  conectada: "bg-positive-100 text-positive-700",
  "modo demo": "bg-graphite-100 text-graphite-600",
  error: "bg-danger-100 text-danger-700",
};

export function IntegrationsAdmin() {
  const [items, setItems] = useState<IntegrationInfo[]>(integrationsList);
  const [logsOf, setLogsOf] = useState<IntegrationInfo | null>(null);
  const [confirmDisconnect, setConfirmDisconnect] = useState<string | null>(null);
  const { showToast, toastNode } = useToast();

  const test = (it: IntegrationInfo) => {
    showToast(
      it.status === "error"
        ? `${it.name}: la prueba falló (${it.errorMessage ?? "error"})`
        : it.status === "conectada"
          ? `${it.name}: conexión OK`
          : `${it.name}: en modo demo, sin credenciales de producción`,
    );
  };

  const retry = (id: string) => {
    setItems((its) => its.map((i) => (i.id === id ? { ...i, status: "conectada", lastSync: "recién", errorMessage: undefined, logs: ["Reintento OK", ...i.logs] } : i)));
    showToast("Sincronización reintentada con éxito (demo)");
  };

  const disconnect = (id: string) => {
    setItems((its) => its.map((i) => (i.id === id ? { ...i, status: "modo demo", lastSync: "sin sincronizar" } : i)));
    setConfirmDisconnect(null);
    showToast("Integración desconectada");
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      {toastNode}
      <PageHeader
        title="Integraciones"
        description="Servicios externos conectados al panel. Las credenciales nunca se muestran completas."
        breadcrumb={[{ label: "Integraciones" }]}
      />

      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((it) => (
          <li key={it.id} className="flex flex-col rounded-xl border border-graphite-200/70 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-lg bg-petrol-50 text-petrol-700">
                  <PlugsIcon className="size-4.5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold text-graphite-800">{it.name}</p>
                  <p className="text-xs text-graphite-500">{it.category}</p>
                </div>
              </div>
              <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusTone[it.status]}`}>
                {it.status}
              </span>
            </div>

            <p className="mt-3 text-xs text-graphite-500">
              Última sincronización: <span className="font-semibold text-graphite-700 tabular">{it.lastSync}</span>
            </p>
            <p className="mt-1 rounded bg-graphite-100/70 px-2 py-1 font-mono text-[0.6875rem] text-graphite-600">
              {it.envVar} = ••••••••
            </p>
            {it.status === "error" && it.errorMessage && (
              <p className="mt-2 rounded-lg bg-danger-100/60 px-2.5 py-1.5 text-xs text-danger-700">{it.errorMessage}</p>
            )}

            <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
              <AdminButton size="sm" variant="secondary" onClick={() => test(it)}>
                Probar conexión
              </AdminButton>
              <AdminButton size="sm" variant="ghost" onClick={() => setLogsOf(it)}>
                Ver logs
              </AdminButton>
              {it.status === "error" && (
                <AdminButton size="sm" variant="secondary" onClick={() => retry(it.id)}>
                  <ArrowClockwiseIcon className="size-3.5" aria-hidden /> Reintentar
                </AdminButton>
              )}
              {it.status === "conectada" &&
                (confirmDisconnect === it.id ? (
                  <span className="flex items-center gap-1.5 text-xs text-danger-700">
                    ¿Desconectar?
                    <AdminButton size="sm" variant="danger" onClick={() => disconnect(it.id)}>
                      Sí
                    </AdminButton>
                    <AdminButton size="sm" variant="ghost" onClick={() => setConfirmDisconnect(null)}>
                      No
                    </AdminButton>
                  </span>
                ) : (
                  <AdminButton size="sm" variant="danger" onClick={() => setConfirmDisconnect(it.id)}>
                    Desconectar
                  </AdminButton>
                ))}
            </div>
          </li>
        ))}
      </ul>

      <Drawer open={Boolean(logsOf)} onClose={() => setLogsOf(null)} title={logsOf ? `Logs · ${logsOf.name}` : ""}>
        {logsOf && (
          <div className="space-y-3">
            <p className="text-xs text-graphite-500">Entorno: demo · variable {logsOf.envVar}</p>
            <pre className="overflow-x-auto rounded-xl bg-petrol-950 p-4 font-mono text-xs leading-relaxed text-teal-100">
              {logsOf.logs.join("\n")}
            </pre>
          </div>
        )}
      </Drawer>
    </div>
  );
}
