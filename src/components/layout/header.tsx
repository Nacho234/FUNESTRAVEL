"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import {
  AirplaneTiltIcon,
  CaretDownIcon,
  HeartIcon,
  ListIcon,
  MagnifyingGlassIcon,
  SuitcaseRollingIcon,
  UserCircleIcon,
  WhatsappLogoIcon,
  XIcon,
} from "@phosphor-icons/react";
import { regions } from "@/data/destinations";
import { GlobalSearch } from "@/components/search/global-search";

const mainNav = [
  { label: "Paquetes", href: "/paquetes" },
  { label: "Vuelos", href: "/vuelos" },
  { label: "Hoteles", href: "/hoteles" },
  { label: "Promociones", href: "/promociones" },
];

const experienceLinks = [
  { label: "Excursiones y actividades", href: "/excursiones" },
  { label: "Viajes grupales acompañados", href: "/viajes-grupales" },
  { label: "Viajes a medida", href: "/viajes-a-medida" },
  { label: "Inspiración y guías", href: "/inspiracion" },
];

const regionSlug: Record<string, string> = {
  Argentina: "argentina",
  Brasil: "brasil",
  Caribe: "caribe",
  "Estados Unidos": "estados-unidos",
  Europa: "europa",
  Exóticos: "exoticos",
};

function Dropdown({
  label,
  solid,
  children,
}: {
  label: string;
  solid: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group">
      <button
        className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold cursor-pointer rounded-[var(--radius-control)] transition-colors ${solid ? "hover:bg-petrol-50" : "hover:bg-white/10"}`}
        aria-haspopup="true"
      >
        {label}
        <CaretDownIcon className="size-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden />
      </button>
      <div className="absolute left-0 top-full pt-2 opacity-0 pointer-events-none translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 z-50">
        <div className="min-w-56 rounded-2xl bg-white p-2 shadow-[var(--shadow-float)] border border-graphite-100 text-graphite-800">
          {children}
        </div>
      </div>
    </div>
  );
}

function DropdownLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-petrol-50 hover:text-petrol-800 transition-colors"
    >
      {children}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const overlay = pathname === "/";
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  const solid = !overlay || scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          solid ? "bg-ivory/95 backdrop-blur border-b border-graphite-100 shadow-[0_1px_12px_rgb(14_58_71_/_0.05)]" : "bg-transparent"
        }`}
      >
        {/* Utility bar: contact + financing, desktop only */}
        <div
          className={`hidden lg:block border-b transition-colors ${
            solid ? "border-graphite-100 text-graphite-600" : "border-white/15 text-white/85"
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs">
            <div className="flex items-center gap-5">
              <a href="https://wa.me/5493415550123" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:underline">
                <WhatsappLogoIcon className="size-3.5" aria-hidden /> +54 9 341 555-0123
              </a>
              <span>Lun a Vie 9 a 18 h · Sáb 9 a 13 h</span>
            </div>
            <div className="flex items-center gap-5">
              <span className="font-medium">Hasta 12 cuotas sin interés en salidas seleccionadas</span>
              <Link href="/sucursales" className="hover:underline">Nuestra oficina en Funes</Link>
              <Link href="/ayuda" className="hover:underline">Ayuda</Link>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div
          data-solid={solid}
          className={`mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 ${
            solid ? "text-petrol-900" : "text-white"
          }`}
        >
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Funes Travel, inicio">
            <span className={`grid size-9 place-items-center rounded-full ${solid ? "bg-petrol-900 text-ivory" : "bg-white/15 text-white backdrop-blur"}`}>
              <AirplaneTiltIcon weight="fill" className="size-5" aria-hidden />
            </span>
            <span className="font-display text-lg font-bold tracking-tight leading-none">
              Funes<span className={solid ? "text-teal-600" : "text-teal-100"}> Travel</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center" aria-label="Navegación principal" data-solid={solid}>
            <div>
              <Dropdown label="Destinos" solid={solid}>
                {regions.map((r) => (
                  <DropdownLink key={r} href={`/destinos?region=${regionSlug[r]}`}>
                    {r}
                  </DropdownLink>
                ))}
                <div className="my-1 border-t border-graphite-100" />
                <DropdownLink href="/destinos">Ver todos los destinos</DropdownLink>
              </Dropdown>
            </div>
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-semibold rounded-[var(--radius-control)] transition-colors ${
                  solid ? "hover:bg-petrol-50" : "hover:bg-white/10"
                } ${pathname.startsWith(item.href) ? (solid ? "text-teal-600" : "underline underline-offset-8") : ""}`}
              >
                {item.label}
              </Link>
            ))}
            <div>
              <Dropdown label="Experiencias" solid={solid}>
                {experienceLinks.map((l) => (
                  <DropdownLink key={l.href} href={l.href}>
                    {l.label}
                  </DropdownLink>
                ))}
              </Dropdown>
            </div>
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className={`grid size-10 place-items-center rounded-full cursor-pointer transition-colors ${solid ? "hover:bg-petrol-50" : "hover:bg-white/10"}`}
              aria-label="Buscar en todo el sitio"
            >
              <MagnifyingGlassIcon className="size-5" aria-hidden />
            </button>
            <Link
              href="/favoritos"
              className={`hidden sm:grid size-10 place-items-center rounded-full transition-colors ${solid ? "hover:bg-petrol-50" : "hover:bg-white/10"}`}
              aria-label="Mis favoritos"
            >
              <HeartIcon className="size-5" aria-hidden />
            </Link>
            <Link
              href="/reserva"
              className={`hidden sm:grid size-10 place-items-center rounded-full transition-colors ${solid ? "hover:bg-petrol-50" : "hover:bg-white/10"}`}
              aria-label="Mi reserva actual"
            >
              <SuitcaseRollingIcon className="size-5" aria-hidden />
            </Link>
            <Link
              href="/cuenta"
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-[var(--radius-control)] transition-colors ${solid ? "hover:bg-petrol-50" : "hover:bg-white/10"}`}
            >
              <UserCircleIcon className="size-5" aria-hidden /> Mi cuenta
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden grid size-10 place-items-center rounded-full cursor-pointer ${solid ? "hover:bg-petrol-50" : "hover:bg-white/10"}`}
              aria-label="Abrir menú"
            >
              <ListIcon className="size-6" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* Fixed-header spacer for every page except the home hero overlay */}
      {!overlay && <div className="h-16 lg:h-[5.9rem]" aria-hidden />}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
          <button
            className="absolute inset-0 bg-petrol-950/55 cursor-default"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-ivory p-6 shadow-[var(--shadow-float)]">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold text-petrol-900">Funes Travel</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="grid size-10 place-items-center rounded-full hover:bg-petrol-50 cursor-pointer"
                aria-label="Cerrar menú"
              >
                <XIcon className="size-5" aria-hidden />
              </button>
            </div>
            <nav
              className="mt-6 flex flex-col gap-1 text-graphite-800"
              aria-label="Menú móvil"
              onClick={(e) => {
                // Delegated close: any link tap inside the drawer dismisses it
                if ((e.target as HTMLElement).closest("a")) setMobileOpen(false);
              }}
            >
              <p className="px-3 pt-2 pb-1 text-xs font-bold uppercase tracking-wide text-graphite-500">Explorar</p>
              <Link href="/destinos" className="rounded-lg px-3 py-2.5 font-semibold hover:bg-petrol-50">Destinos</Link>
              {mainNav.map((i) => (
                <Link key={i.href} href={i.href} className="rounded-lg px-3 py-2.5 font-semibold hover:bg-petrol-50">
                  {i.label}
                </Link>
              ))}
              {experienceLinks.map((i) => (
                <Link key={i.href} href={i.href} className="rounded-lg px-3 py-2.5 font-semibold hover:bg-petrol-50">
                  {i.label}
                </Link>
              ))}
              <p className="px-3 pt-4 pb-1 text-xs font-bold uppercase tracking-wide text-graphite-500">Tu viaje</p>
              <Link href="/favoritos" className="rounded-lg px-3 py-2.5 font-semibold hover:bg-petrol-50">Favoritos</Link>
              <Link href="/reserva" className="rounded-lg px-3 py-2.5 font-semibold hover:bg-petrol-50">Mi reserva</Link>
              <Link href="/cuenta" className="rounded-lg px-3 py-2.5 font-semibold hover:bg-petrol-50">Mi cuenta</Link>
              <Link href="/ayuda" className="rounded-lg px-3 py-2.5 font-semibold hover:bg-petrol-50">Ayuda</Link>
              <a
                href="https://wa.me/5493415550123"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-[var(--radius-control)] bg-positive-700 px-4 py-3 font-semibold text-white"
              >
                <WhatsappLogoIcon className="size-5" aria-hidden /> Hablar con un asesor
              </a>
            </nav>
          </div>
        </div>
      )}

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
