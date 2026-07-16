import type { Metadata } from "next";
import { CheckIcon, PlugsIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Configuración" };

const staff = [
  { name: "Sofía Gachet", email: "sofia@funestravel.com.ar", role: "Administradora" },
  { name: "Marcela Buttini", email: "marcela@funestravel.com.ar", role: "Ventas" },
  { name: "Diego Anselmi", email: "diego@funestravel.com.ar", role: "Reservas" },
  { name: "Estudio Contable Perotti", email: "contable@funestravel.com.ar", role: "Finanzas" },
];

const permissions = [
  { area: "Ver reservas", roles: { Administradora: true, Ventas: true, Reservas: true, Finanzas: true, Marketing: true } },
  { area: "Crear y editar reservas", roles: { Administradora: true, Ventas: true, Reservas: true, Finanzas: false, Marketing: false } },
  { area: "Registrar pagos y devoluciones", roles: { Administradora: true, Ventas: false, Reservas: true, Finanzas: true, Marketing: false } },
  { area: "Editar productos y tarifas", roles: { Administradora: true, Ventas: false, Reservas: false, Finanzas: false, Marketing: false } },
  { area: "Publicar promociones y contenido", roles: { Administradora: true, Ventas: false, Reservas: false, Finanzas: false, Marketing: true } },
  { area: "Ver reportes", roles: { Administradora: true, Ventas: true, Reservas: true, Finanzas: true, Marketing: true } },
  { area: "Administrar usuarios y roles", roles: { Administradora: true, Ventas: false, Reservas: false, Finanzas: false, Marketing: false } },
] as const;

const roleNames = ["Administradora", "Ventas", "Reservas", "Finanzas", "Marketing"] as const;

const integrations = [
  {
    name: "Mercado Pago",
    detail: "Cobros online con tarjeta, cuotas y dinero en cuenta. Redirección segura: la tarjeta nunca toca nuestros servidores.",
    envVar: "MP_ACCESS_TOKEN",
  },
  {
    name: "Correo transaccional (Resend)",
    detail: "Confirmaciones de reserva, recordatorios de pago y vouchers por email.",
    envVar: "RESEND_API_KEY",
  },
  {
    name: "WhatsApp Business API",
    detail: "Notificaciones de estado de reserva y línea de soporte durante el viaje.",
    envVar: "WHATSAPP_TOKEN",
  },
  {
    name: "GDS aéreo (Amadeus)",
    detail: "Búsqueda y emisión de vuelos con tarifas en tiempo real en lugar del inventario de demostración.",
    envVar: "AMADEUS_KEY",
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-bold tracking-tight text-petrol-900">Configuración</h1>
      <p className="mt-1 text-sm text-graphite-500">Usuarios internos, permisos por rol e integraciones externas.</p>

      <section className="mt-6 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
        <h2 className="font-display text-base font-bold text-petrol-900">Usuarios internos</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-graphite-500 border-b border-graphite-100">
              <th className="py-2.5 pr-4 font-semibold">Usuario</th>
              <th className="py-2.5 pr-4 font-semibold">Correo</th>
              <th className="py-2.5 font-semibold text-right">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-graphite-100">
            {staff.map((s) => (
              <tr key={s.email}>
                <td className="py-3 pr-4 font-semibold text-graphite-800">{s.name}</td>
                <td className="py-3 pr-4 text-graphite-600">{s.email}</td>
                <td className="py-3 text-right">
                  <Badge tone={s.role === "Administradora" ? "petrol" : "neutral"}>{s.role}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-6 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
        <h2 className="font-display text-base font-bold text-petrol-900">Permisos por rol</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-graphite-500 border-b border-graphite-100">
                <th className="py-2.5 pr-4 font-semibold">Permiso</th>
                {roleNames.map((r) => (
                  <th key={r} className="py-2.5 px-2 text-center font-semibold">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-100">
              {permissions.map((p) => (
                <tr key={p.area}>
                  <td className="py-2.5 pr-4 text-graphite-800">{p.area}</td>
                  {roleNames.map((r) => (
                    <td key={r} className="py-2.5 px-2 text-center">
                      {p.roles[r] ? (
                        <CheckIcon weight="bold" className="mx-auto size-4 text-positive-700" aria-label={`${r}: permitido`} />
                      ) : (
                        <XIcon className="mx-auto size-4 text-graphite-300" aria-label={`${r}: sin permiso`} />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-graphite-500">
          En producción los permisos son granulares por acción y cada cambio queda registrado en el log de auditoría.
        </p>
      </section>

      <section className="mt-6 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-lift)]">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-petrol-900">
          <PlugsIcon className="size-5 text-teal-600" aria-hidden /> Integraciones
        </h2>
        <p className="mt-1 text-sm text-graphite-500">
          Cada servicio externo tiene su adaptador desacoplado. Sin credenciales, el sistema opera en modo demo con datos simulados.
        </p>
        <ul className="mt-4 divide-y divide-graphite-100">
          {integrations.map((i) => (
            <li key={i.name} className="flex flex-wrap items-start justify-between gap-3 py-4">
              <div className="max-w-xl">
                <p className="font-semibold text-graphite-800">{i.name}</p>
                <p className="mt-0.5 text-sm text-graphite-600">{i.detail}</p>
                <p className="mt-1 text-xs text-graphite-500">
                  Variable de entorno: <code className="rounded bg-graphite-100 px-1.5 py-0.5 font-mono text-[0.75rem]">{i.envVar}</code>
                </p>
              </div>
              <Badge tone="warning">Modo demo</Badge>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
