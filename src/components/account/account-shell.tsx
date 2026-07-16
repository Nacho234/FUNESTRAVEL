"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AirplaneTakeoffIcon,
  FilesIcon,
  GaugeIcon,
  HeartIcon,
  SignOutIcon,
  UserCircleIcon,
  ReceiptIcon,
} from "@phosphor-icons/react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";

const nav = [
  { href: "/cuenta", label: "Resumen", icon: GaugeIcon },
  { href: "/cuenta/viajes", label: "Mis viajes", icon: AirplaneTakeoffIcon },
  { href: "/cuenta/cotizaciones", label: "Cotizaciones", icon: ReceiptIcon },
  { href: "/cuenta/documentos", label: "Documentación", icon: FilesIcon },
  { href: "/favoritos", label: "Favoritos", icon: HeartIcon },
  { href: "/cuenta/perfil", label: "Mis datos", icon: UserCircleIcon },
];

function LoginGate() {
  const { login } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (name.trim().length < 2) errs.name = "Contanos tu nombre para personalizar el panel.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = "Ingresá un correo válido.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => login(name.trim(), email.trim()), 500);
  };

  return (
    <div className="mx-auto max-w-md py-14">
      <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-float)]">
        <h1 className="font-display text-2xl font-bold text-petrol-900">Ingresá a tu cuenta</h1>
        <p className="mt-1.5 text-sm text-graphite-600">
          Acá vas a ver tus viajes, pagos, documentación y cotizaciones.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
          <TextField label="Nombre" required autoComplete="name" value={name} error={errors.name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Correo electrónico" required type="email" autoComplete="email" value={email} error={errors.email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" className="w-full" loading={loading}>
            Ingresar
          </Button>
        </form>
        <p className="mt-4 text-xs leading-relaxed text-graphite-500">
          Demo: el acceso es simulado y tus datos quedan solo en este navegador. En producción, este ingreso
          usa correo con código de verificación o contraseña con recuperación segura.
        </p>
      </div>
    </div>
  );
}

export function AccountShell({ children }: { children: React.ReactNode }) {
  const { user, logout, ready } = useStore();
  const pathname = usePathname();

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="h-64 animate-pulse rounded-2xl bg-graphite-100" />
      </div>
    );
  }

  if (!user) return <LoginGate />;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 pb-20">
      <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside>
          <div className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-lift)] lg:sticky lg:top-28">
            <p className="px-3 pt-1 text-sm text-graphite-500">Hola,</p>
            <p className="px-3 pb-2 font-display text-lg font-bold text-petrol-900 truncate">{user.name}</p>
            <nav aria-label="Secciones de la cuenta" className="mt-1 flex lg:flex-col gap-1 overflow-x-auto">
              {nav.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      active ? "bg-petrol-900 text-ivory" : "text-graphite-600 hover:bg-petrol-50 hover:text-petrol-900"
                    }`}
                  >
                    <Icon className="size-4.5" aria-hidden />
                    {label}
                  </Link>
                );
              })}
              <button
                onClick={logout}
                className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-graphite-500 hover:bg-danger-100/50 hover:text-danger-700 transition-colors cursor-pointer lg:mt-2 lg:border-t lg:border-graphite-100 lg:pt-3"
              >
                <SignOutIcon className="size-4.5" aria-hidden />
                Cerrar sesión
              </button>
            </nav>
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
