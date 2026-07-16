"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AirplaneTiltIcon,
  ChartBarIcon,
  GearIcon,
  HandshakeIcon,
  ListIcon,
  MegaphoneIcon,
  PackageIcon,
  ReceiptIcon,
  SignOutIcon,
  SuitcaseRollingIcon,
  TagIcon,
  UsersIcon,
  XIcon,
} from "@phosphor-icons/react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: ChartBarIcon },
  { href: "/admin/reservas", label: "Reservas", icon: SuitcaseRollingIcon },
  { href: "/admin/cotizaciones", label: "Cotizaciones", icon: ReceiptIcon },
  { href: "/admin/clientes", label: "Clientes", icon: UsersIcon },
  { href: "/admin/productos", label: "Productos", icon: PackageIcon },
  { href: "/admin/tarifas", label: "Tarifas", icon: TagIcon },
  { href: "/admin/promociones", label: "Promociones", icon: MegaphoneIcon },
  { href: "/admin/proveedores", label: "Proveedores", icon: HandshakeIcon },
  { href: "/admin/configuracion", label: "Configuración", icon: GearIcon },
];

function AdminLogin({ onEnter }: { onEnter: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div className="grid min-h-[100dvh] place-items-center bg-petrol-950 px-4">
      <div className="w-full max-w-sm rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-float)]">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-petrol-900 text-ivory">
            <AirplaneTiltIcon weight="fill" className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-display text-lg font-bold leading-none text-petrol-900">Funes Travel</p>
            <p className="text-xs text-graphite-500">Panel administrativo</p>
          </div>
        </div>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onEnter();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-user" className="text-sm font-semibold text-graphite-800">
              Usuario
            </label>
            <input
              id="admin-user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 bg-white px-3.5 py-2.5 text-[0.9375rem] focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/25"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-pass" className="text-sm font-semibold text-graphite-800">
              Contraseña
            </label>
            <input
              id="admin-pass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-[var(--radius-control)] border border-graphite-200 bg-white px-3.5 py-2.5 text-[0.9375rem] focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/25"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-[var(--radius-control)] bg-coral-500 py-2.5 font-semibold text-white transition-colors hover:bg-coral-600 cursor-pointer"
          >
            Ingresar (demo)
          </button>
        </form>
        <p className="mt-4 text-xs leading-relaxed text-graphite-500">
          Acceso de demostración: cualquier usuario y contraseña ingresan. En producción, este panel usa
          autenticación real con roles y permisos por área, sesiones con expiración y registro de auditoría.
        </p>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Hydration-safe localStorage read: the server can't know the auth flag,
    // so it must be applied after mount.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthed(window.localStorage.getItem("ft-admin") === "1");
    } catch {
      // storage unavailable: keep gate closed, login still works in-memory
    }
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="grid min-h-[100dvh] place-items-center bg-petrol-950" aria-busy="true" />;
  }

  if (!authed) {
    return (
      <AdminLogin
        onEnter={() => {
          try {
            window.localStorage.setItem("ft-admin", "1");
          } catch {
            // in-memory only
          }
          setAuthed(true);
        }}
      />
    );
  }

  const logout = () => {
    try {
      window.localStorage.removeItem("ft-admin");
    } catch {
      // ignore
    }
    setAuthed(false);
  };

  const navList = (
    <nav aria-label="Navegación del panel" className="flex flex-col gap-0.5">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              active ? "bg-white/10 text-ivory" : "text-petrol-100/70 hover:bg-white/5 hover:text-ivory"
            }`}
          >
            <Icon className="size-4.5" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-[100dvh] bg-ivory">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-petrol-950 px-4 py-6 sticky top-0 h-[100dvh]">
        <Link href="/admin" className="flex items-center gap-2 px-2" aria-label="Dashboard del panel">
          <span className="grid size-8 place-items-center rounded-full bg-white/10 text-ivory">
            <AirplaneTiltIcon weight="fill" className="size-4.5" aria-hidden />
          </span>
          <span className="font-display text-sm font-bold text-ivory leading-tight">
            Funes Travel
            <span className="block text-[0.6875rem] font-medium text-petrol-100/60">Admin</span>
          </span>
        </Link>
        <div className="mt-6 flex-1 overflow-y-auto">{navList}</div>
        <div className="border-t border-white/10 pt-4">
          <p className="px-3 text-sm font-semibold text-ivory">Sofía Gachet</p>
          <p className="px-3 text-xs text-petrol-100/60">Administradora</p>
          <button
            onClick={logout}
            className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-petrol-100/70 hover:bg-white/5 hover:text-ivory transition-colors cursor-pointer"
          >
            <SignOutIcon className="size-4.5" aria-hidden />
            Salir
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-petrol-950 px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2 text-ivory">
          <AirplaneTiltIcon weight="fill" className="size-5" aria-hidden />
          <span className="font-display text-sm font-bold">Funes Travel · Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="grid size-9 place-items-center rounded-lg text-ivory hover:bg-white/10 cursor-pointer"
          aria-label="Abrir menú del panel"
        >
          <ListIcon className="size-5" aria-hidden />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú del panel">
          <button
            className="absolute inset-0 bg-petrol-950/70 cursor-default"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-petrol-950 p-5 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-bold text-ivory">Funes Travel · Admin</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="grid size-9 place-items-center rounded-lg text-ivory hover:bg-white/10 cursor-pointer"
                aria-label="Cerrar menú"
              >
                <XIcon className="size-5" aria-hidden />
              </button>
            </div>
            <div
              className="mt-5"
              onClick={(e) => {
                // Delegated close: navigating from the drawer dismisses it
                if ((e.target as HTMLElement).closest("a")) setMobileOpen(false);
              }}
            >
              {navList}
            </div>
            <button
              onClick={logout}
              className="mt-4 flex w-full items-center gap-2.5 rounded-lg border-t border-white/10 px-3 pt-4 pb-2 text-sm font-semibold text-petrol-100/70 hover:text-ivory transition-colors cursor-pointer"
            >
              <SignOutIcon className="size-4.5" aria-hidden />
              Salir
            </button>
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1 px-4 sm:px-8 pb-16 pt-16 lg:pt-8">{children}</main>
    </div>
  );
}
