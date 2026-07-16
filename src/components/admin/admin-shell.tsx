"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AirplaneTiltIcon,
  ArrowLeftIcon,
  BellIcon,
  BedIcon,
  BusIcon,
  CalendarBlankIcon,
  CaretDownIcon,
  CaretUpDownIcon,
  ChartBarIcon,
  ChatsCircleIcon,
  CheckSquareIcon,
  ClipboardTextIcon,
  CompassIcon,
  CurrencyDollarIcon,
  FilesIcon,
  FirstAidIcon,
  GaugeIcon,
  GearIcon,
  GlobeIcon,
  HouseLineIcon,
  ImagesIcon,
  LifebuoyIcon,
  LinkIcon,
  ListChecksIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MegaphoneIcon,
  NewspaperIcon,
  PackageIcon,
  PlusIcon,
  ReceiptIcon,
  ScrollIcon,
  ShieldCheckIcon,
  SidebarSimpleIcon,
  SignOutIcon,
  TagIcon,
  TicketIcon,
  UserCircleIcon,
  UsersIcon,
  UsersThreeIcon,
  WalletIcon,
  XIcon,
} from "@phosphor-icons/react";
import { adminNotifications, adminRoles, branches } from "@/data/admin-core";
import type { AdminNotification, AdminRoleId } from "@/lib/admin-types";

/**
 * Backoffice shell: grouped collapsible sidebar with persisted state and
 * counters, topbar with global search / command palette (⌘K), quick-create
 * menu, notifications drawer, branch & currency selectors, and a demo auth
 * gate with role selection.
 */

/* ── navigation model ────────────────────────────────────────────── */

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

const navGroups: { id: string; label: string; items: NavItem[] }[] = [
  {
    id: "resumen",
    label: "Resumen",
    items: [
      { href: "/admin", label: "Resumen", icon: GaugeIcon },
      { href: "/admin/tareas", label: "Tareas", icon: CheckSquareIcon, count: 6 },
    ],
  },
  {
    id: "operacion",
    label: "Operación",
    items: [
      { href: "/admin/ventas", label: "Ventas", icon: CurrencyDollarIcon },
      { href: "/admin/reservas", label: "Reservas", icon: ClipboardTextIcon, count: 3 },
      { href: "/admin/cotizaciones", label: "Cotizaciones", icon: ReceiptIcon, count: 9 },
      { href: "/admin/consultas", label: "Consultas", icon: ChatsCircleIcon, count: 3 },
      { href: "/admin/tickets", label: "Tickets", icon: LifebuoyIcon },
      { href: "/admin/documentacion", label: "Documentación", icon: FilesIcon, count: 4 },
    ],
  },
  {
    id: "clientes",
    label: "Clientes",
    items: [
      { href: "/admin/clientes", label: "Clientes", icon: UsersIcon },
      { href: "/admin/pasajeros", label: "Pasajeros", icon: UsersThreeIcon },
    ],
  },
  {
    id: "catalogo",
    label: "Catálogo",
    items: [
      { href: "/admin/productos", label: "Productos", icon: PackageIcon },
      { href: "/admin/paquetes", label: "Paquetes", icon: AirplaneTiltIcon },
      { href: "/admin/destinos", label: "Destinos", icon: MapPinIcon },
      { href: "/admin/hoteles", label: "Hoteles", icon: BedIcon },
      { href: "/admin/vuelos", label: "Vuelos", icon: GlobeIcon },
      { href: "/admin/excursiones", label: "Excursiones", icon: CompassIcon },
      { href: "/admin/traslados", label: "Traslados", icon: BusIcon },
      { href: "/admin/seguros", label: "Seguros", icon: FirstAidIcon },
      { href: "/admin/disponibilidad", label: "Disponibilidad", icon: CalendarBlankIcon, count: 2 },
      { href: "/admin/tarifas", label: "Tarifas", icon: TagIcon },
      { href: "/admin/proveedores", label: "Proveedores", icon: ShieldCheckIcon },
    ],
  },
  {
    id: "marketing",
    label: "Marketing y contenido",
    items: [
      { href: "/admin/promociones", label: "Promociones", icon: MegaphoneIcon },
      { href: "/admin/cupones", label: "Cupones", icon: TicketIcon },
      { href: "/admin/contenido", label: "Contenido", icon: ScrollIcon },
      { href: "/admin/medios", label: "Medios", icon: ImagesIcon },
      { href: "/admin/editor-home", label: "Editor de home", icon: HouseLineIcon },
      { href: "/admin/blog", label: "Blog", icon: NewspaperIcon },
      { href: "/admin/seo", label: "SEO", icon: MagnifyingGlassIcon },
    ],
  },
  {
    id: "finanzas",
    label: "Finanzas",
    items: [
      { href: "/admin/pagos", label: "Pagos", icon: WalletIcon, count: 3 },
      { href: "/admin/finanzas", label: "Finanzas", icon: ChartBarIcon },
      { href: "/admin/reportes", label: "Reportes", icon: ListChecksIcon },
    ],
  },
  {
    id: "sistema",
    label: "Sistema",
    items: [
      { href: "/admin/usuarios", label: "Usuarios", icon: UserCircleIcon },
      { href: "/admin/roles", label: "Roles y permisos", icon: ShieldCheckIcon },
      { href: "/admin/integraciones", label: "Integraciones", icon: LinkIcon },
      { href: "/admin/configuracion", label: "Configuración", icon: GearIcon },
      { href: "/admin/auditoria", label: "Auditoría", icon: ScrollIcon },
    ],
  },
];

const quickCreate = [
  { label: "Nueva reserva", href: "/admin/reservas?nueva=1" },
  { label: "Nueva cotización", href: "/admin/cotizaciones?nueva=1" },
  { label: "Nuevo cliente", href: "/admin/clientes?nuevo=1" },
  { label: "Nuevo paquete", href: "/admin/paquetes?nuevo=1" },
  { label: "Nueva promoción", href: "/admin/promociones?nueva=1" },
  { label: "Registrar pago", href: "/admin/pagos?nuevo=1" },
  { label: "Crear consulta", href: "/admin/consultas?nueva=1" },
  { label: "Subir documento", href: "/admin/documentacion?nuevo=1" },
  { label: "Crear publicación", href: "/admin/blog?nueva=1" },
];

const allNavItems = navGroups.flatMap((g) => g.items);

/* ── auth (demo) ─────────────────────────────────────────────────── */

export interface AdminSession {
  name: string;
  role: AdminRoleId;
}

export function useAdminSession(): AdminSession | null {
  const [session, setSession] = useState<AdminSession | null>(null);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("ft-admin-session");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe localStorage read
      if (raw) setSession(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);
  return session;
}

function AdminLogin({ onEnter }: { onEnter: (s: AdminSession) => void }) {
  const [name, setName] = useState("Sofía Gachet");
  const [role, setRole] = useState<AdminRoleId>("superadmin");

  return (
    <div className="grid min-h-[100dvh] place-items-center bg-petrol-950 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[var(--shadow-float)]">
        <p className="font-display text-lg font-bold text-petrol-900">
          Funes Travel <span className="text-teal-600">· Admin</span>
        </p>
        <p className="mt-1 text-sm text-graphite-500">Backoffice interno del equipo.</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const session = { name: name.trim() || "Equipo", role };
            try {
              window.localStorage.setItem("ft-admin-session", JSON.stringify(session));
            } catch {
              // in-memory only
            }
            onEnter(session);
          }}
        >
          <div>
            <label htmlFor="adm-name" className="mb-1 block text-sm font-semibold text-graphite-800">
              Nombre
            </label>
            <input
              id="adm-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="adm-role" className="mb-1 block text-sm font-semibold text-graphite-800">
              Rol (demo)
            </label>
            <select
              id="adm-role"
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRoleId)}
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 px-3 py-2.5 text-sm cursor-pointer focus:border-teal-500 focus:outline-none"
            >
              {adminRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded-[var(--radius-control)] bg-coral-500 py-2.5 text-sm font-bold text-white hover:bg-coral-600 transition-colors cursor-pointer"
          >
            Ingresar (demo)
          </button>
        </form>
        <p className="mt-4 text-xs leading-relaxed text-graphite-500">
          Acceso simulado: en producción este ingreso usa autenticación real con 2FA opcional, sesiones
          seguras y permisos validados en el servidor.
        </p>
      </div>
    </div>
  );
}

/* ── command palette (⌘K) ────────────────────────────────────────── */

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const commands = useMemo(
    () => [
      ...quickCreate.map((c) => ({ label: c.label, hint: "Acción", href: c.href })),
      ...allNavItems.map((i) => ({ label: `Ir a ${i.label}`, hint: "Navegación", href: i.href })),
      { label: "Cambiar sucursal", hint: "Acción", href: "/admin/configuracion" },
      { label: "Cerrar sesión", hint: "Sesión", href: "#logout" },
    ],
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands.slice(0, 9);
    return commands.filter((c) => c.label.toLowerCase().includes(q)).slice(0, 9);
  }, [query, commands]);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset transient state when the dialog opens
      setQuery("");
      setActive(0);
    }
  }, [open]);

  if (!open) return null;

  const run = (href: string) => {
    onClose();
    if (href === "#logout") {
      window.localStorage.removeItem("ft-admin-session");
      window.location.reload();
      return;
    }
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Comandos rápidos">
      <button className="absolute inset-0 bg-petrol-950/55 cursor-default" onClick={onClose} aria-label="Cerrar comandos" />
      <div className="absolute left-1/2 top-[12vh] w-[92%] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-float)]">
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && results[active]) {
              run(results[active].href);
            } else if (e.key === "Escape") {
              onClose();
            }
          }}
          placeholder="Buscar reservas, clientes, acciones… (⌘K)"
          className="w-full border-b border-graphite-100 px-5 py-4 text-base focus:outline-none"
          aria-label="Buscar comandos"
        />
        <ul className="max-h-[46vh] overflow-y-auto p-2">
          {results.map((r, i) => (
            <li key={r.label}>
              <button
                onClick={() => run(r.href)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm cursor-pointer ${
                  i === active ? "bg-petrol-50 text-petrol-900" : "text-graphite-700"
                }`}
              >
                <span className="font-medium">{r.label}</span>
                <span className="text-xs text-graphite-400">{r.hint}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-graphite-500">Sin resultados para “{query}”.</li>}
        </ul>
      </div>
    </div>
  );
}

/* ── notifications drawer ────────────────────────────────────────── */

function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = useState<AdminNotification[]>(adminNotifications);
  const unread = items.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[65]" role="dialog" aria-modal="true" aria-label="Notificaciones">
          <button className="absolute inset-0 bg-petrol-950/40 cursor-default" onClick={onClose} aria-label="Cerrar notificaciones" />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-[var(--shadow-float)]"
          >
            <div className="flex items-center justify-between border-b border-graphite-100 px-5 py-4">
              <h2 className="font-display text-base font-bold text-petrol-900">
                Notificaciones {unread > 0 && <span className="text-coral-600">({unread})</span>}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setItems((its) => its.map((n) => ({ ...n, read: true })))}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-teal-600 hover:bg-teal-50 cursor-pointer"
                >
                  Marcar leídas
                </button>
                <button onClick={onClose} className="grid size-8 place-items-center rounded-full hover:bg-graphite-100 cursor-pointer" aria-label="Cerrar">
                  <XIcon className="size-4.5" aria-hidden />
                </button>
              </div>
            </div>
            <ul className="flex-1 divide-y divide-graphite-100 overflow-y-auto">
              {items.map((n) => (
                <li key={n.id}>
                  <Link href={n.href ?? "#"} onClick={onClose} className={`block px-5 py-3.5 hover:bg-petrol-50/40 ${n.read ? "" : "bg-teal-50/40"}`}>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-graphite-800">{n.title}</p>
                      <span className="shrink-0 text-[0.6875rem] text-graphite-400">{n.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs leading-snug text-graphite-500">{n.detail}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="border-t border-graphite-100 px-5 py-3 text-xs text-graphite-500">
              Configurá reglas y canales en{" "}
              <Link href="/admin/configuracion" onClick={onClose} className="font-semibold text-teal-600">
                Configuración
              </Link>
              .
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ── shell ───────────────────────────────────────────────────────── */

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [branch, setBranch] = useState(branches[0].id);
  const [currency, setCurrency] = useState<"USD" | "ARS">("USD");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("ft-admin-session");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe localStorage read
      if (raw) setSession(JSON.parse(raw));
      const ui = window.localStorage.getItem("ft-admin-ui");
      if (ui) {
        const parsed = JSON.parse(ui);
        setCollapsed(Boolean(parsed.collapsed));
        setOpenGroups(parsed.openGroups ?? {});
      } else {
        setOpenGroups(Object.fromEntries(navGroups.map((g) => [g.id, true])));
      }
    } catch {
      setOpenGroups(Object.fromEntries(navGroups.map((g) => [g.id, true])));
    }
    setReady(true);
  }, []);

  const persistUi = useCallback((next: { collapsed?: boolean; openGroups?: Record<string, boolean> }) => {
    try {
      const current = JSON.parse(window.localStorage.getItem("ft-admin-ui") ?? "{}");
      window.localStorage.setItem("ft-admin-ui", JSON.stringify({ ...current, ...next }));
    } catch {
      // best effort
    }
  }, []);

  // ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const roleName = useMemo(() => adminRoles.find((r) => r.id === session?.role)?.name ?? "", [session]);
  const unreadCount = adminNotifications.filter((n) => !n.read).length;

  if (!ready) return <div className="grid min-h-[100dvh] place-items-center bg-petrol-950" aria-busy="true" />;
  if (!session) return <AdminLogin onEnter={setSession} />;

  const logout = () => {
    window.localStorage.removeItem("ft-admin-session");
    setSession(null);
  };

  const navList = (
    <nav aria-label="Navegación del panel" className="space-y-4">
      {navGroups.map((group) => {
        const open = openGroups[group.id] ?? true;
        return (
          <div key={group.id}>
            {!collapsed && (
              <button
                onClick={() => {
                  const next = { ...openGroups, [group.id]: !open };
                  setOpenGroups(next);
                  persistUi({ openGroups: next });
                }}
                className="flex w-full items-center justify-between px-3 pb-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-petrol-100/50 hover:text-petrol-100/80 cursor-pointer"
                aria-expanded={open}
              >
                {group.label}
                <CaretDownIcon className={`size-3 transition-transform ${open ? "" : "-rotate-90"}`} aria-hidden />
              </button>
            )}
            {(open || collapsed) && (
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[0.8125rem] font-medium transition-colors ${
                          active ? "bg-white/10 text-ivory" : "text-petrol-100/70 hover:bg-white/5 hover:text-ivory"
                        } ${collapsed ? "justify-center px-0" : ""}`}
                        aria-current={active ? "page" : undefined}
                      >
                        <item.icon className="size-[18px] shrink-0" aria-hidden />
                        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                        {!collapsed && item.count && (
                          <span className="rounded-full bg-coral-500/90 px-1.5 text-[0.625rem] font-bold leading-4 text-white tabular">
                            {item.count}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-[100dvh] bg-ivory text-graphite-800">
      {/* Sidebar (desktop) */}
      <aside
        className={`sticky top-0 hidden h-[100dvh] shrink-0 flex-col bg-petrol-950 transition-[width] duration-200 lg:flex ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <div className={`flex items-center gap-2 px-4 py-4 ${collapsed ? "justify-center px-0" : ""}`}>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-ivory">
            <AirplaneTiltIcon weight="fill" className="size-4.5" aria-hidden />
          </span>
          {!collapsed && (
            <p className="font-display text-sm font-bold text-ivory">
              Funes Travel <span className="text-teal-100">· Admin</span>
            </p>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-2.5 pb-4 [scrollbar-width:thin]">{navList}</div>
        <div className="border-t border-white/10 p-2.5">
          <button
            onClick={() => {
              setCollapsed((c) => {
                persistUi({ collapsed: !c });
                return !c;
              });
            }}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[0.8125rem] font-medium text-petrol-100/70 hover:bg-white/5 hover:text-ivory cursor-pointer ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            <SidebarSimpleIcon className="size-[18px]" aria-hidden />
            {!collapsed && "Colapsar menú"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-40 border-b border-graphite-200/70 bg-white/95 backdrop-blur">
          <div className="flex h-14 items-center gap-2 px-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid size-9 place-items-center rounded-lg hover:bg-graphite-100 lg:hidden cursor-pointer"
              aria-label="Abrir menú"
            >
              <SidebarSimpleIcon className="size-5" aria-hidden />
            </button>

            <button
              onClick={() => setPaletteOpen(true)}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-control)] border border-graphite-200 bg-sand-50/60 px-3 py-2 text-sm text-graphite-400 hover:border-graphite-300 cursor-pointer sm:max-w-md"
            >
              <MagnifyingGlassIcon className="size-4 shrink-0" aria-hidden />
              <span className="truncate">Buscar o ejecutar una acción…</span>
              <kbd className="ml-auto hidden rounded border border-graphite-200 bg-white px-1.5 text-[0.625rem] font-semibold text-graphite-400 sm:block">
                ⌘K
              </kbd>
            </button>

            <div className="ml-auto flex items-center gap-1.5">
              {/* Branch */}
              <div className="relative hidden md:block">
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="appearance-none rounded-[var(--radius-control)] border border-graphite-200 bg-white py-2 pl-3 pr-7 text-xs font-semibold text-graphite-700 cursor-pointer focus:border-teal-500 focus:outline-none"
                  aria-label="Sucursal"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <CaretUpDownIcon className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-graphite-400" aria-hidden />
              </div>
              {/* Currency */}
              <button
                onClick={() => setCurrency((c) => (c === "USD" ? "ARS" : "USD"))}
                className="hidden rounded-[var(--radius-control)] border border-graphite-200 px-2.5 py-2 text-xs font-bold text-graphite-700 hover:border-teal-500 cursor-pointer md:block tabular"
                aria-label={`Moneda actual ${currency}, cambiar`}
              >
                {currency}
              </button>

              {/* Quick create */}
              <div className="relative">
                <button
                  onClick={() => setCreateOpen((o) => !o)}
                  className="flex items-center gap-1.5 rounded-[var(--radius-control)] bg-coral-500 px-3 py-2 text-xs font-bold text-white hover:bg-coral-600 transition-colors cursor-pointer"
                  aria-expanded={createOpen}
                  aria-haspopup="menu"
                >
                  <PlusIcon weight="bold" className="size-4" aria-hidden />
                  <span className="hidden sm:inline">Nueva acción</span>
                </button>
                <AnimatePresence>
                  {createOpen && (
                    <>
                      <button className="fixed inset-0 z-10 cursor-default" onClick={() => setCreateOpen(false)} aria-label="Cerrar menú" />
                      <motion.ul
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-graphite-100 bg-white p-1.5 shadow-[var(--shadow-float)]"
                        role="menu"
                      >
                        {quickCreate.map((c) => (
                          <li key={c.label} role="none">
                            <Link
                              role="menuitem"
                              href={c.href}
                              onClick={() => setCreateOpen(false)}
                              className="block rounded-lg px-3 py-2 text-sm font-medium text-graphite-700 hover:bg-petrol-50 hover:text-petrol-900"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications */}
              <button
                onClick={() => setNotifOpen(true)}
                className="relative grid size-9 place-items-center rounded-lg hover:bg-graphite-100 cursor-pointer"
                aria-label={`Notificaciones${unreadCount ? `, ${unreadCount} sin leer` : ""}`}
              >
                <BellIcon className="size-5 text-graphite-600" aria-hidden />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-coral-500" aria-hidden />
                )}
              </button>

              {/* User */}
              <div className="ml-1 flex items-center gap-2 border-l border-graphite-200 pl-3">
                <Image src="https://i.pravatar.cc/64?img=20" alt="" width={30} height={30} className="rounded-full" />
                <div className="hidden text-right leading-tight md:block">
                  <p className="text-xs font-bold text-graphite-800">{session.name}</p>
                  <p className="text-[0.625rem] text-graphite-500">{roleName}</p>
                </div>
                <button
                  onClick={logout}
                  className="grid size-8 place-items-center rounded-lg text-graphite-500 hover:bg-graphite-100 hover:text-danger-700 cursor-pointer"
                  aria-label="Cerrar sesión"
                >
                  <SignOutIcon className="size-4.5" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>

        <footer className="border-t border-graphite-200/70 px-6 py-3 text-xs text-graphite-500">
          Entorno de demostración · los cambios se guardan localmente ·{" "}
          <Link href="/" className="font-semibold text-teal-600 hover:underline">
            <ArrowLeftIcon className="mr-0.5 inline size-3" aria-hidden />
            Ver sitio público
          </Link>
        </footer>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menú del panel">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-petrol-950/55 cursor-default"
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-petrol-950 p-4"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a")) setMobileOpen(false);
              }}
            >
              <p className="mb-4 px-2 font-display text-sm font-bold text-ivory">
                Funes Travel <span className="text-teal-100">· Admin</span>
              </p>
              {navList}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
