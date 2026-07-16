import Link from "next/link";
import { CompassIcon } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center bg-ivory px-6 py-24">
      <div className="max-w-md text-center">
        <CompassIcon className="mx-auto size-14 text-teal-500" aria-hidden />
        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-petrol-900">
          Esta página no existe (o cambió de lugar)
        </h1>
        <p className="mt-3 text-graphite-600 leading-relaxed">
          Puede que el enlace esté vencido o que el paquete ya no se publique. Lo importante: tu viaje
          sigue estando a unos clics.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-[var(--radius-control)] bg-coral-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-600 transition-colors"
          >
            Ir al inicio
          </Link>
          <Link
            href="/paquetes"
            className="rounded-[var(--radius-control)] border border-graphite-200 bg-white px-5 py-2.5 text-sm font-semibold text-petrol-900 hover:border-petrol-600 transition-colors"
          >
            Ver paquetes
          </Link>
        </div>
        <a
          href="https://wa.me/5493415550123?text=Hola,%20llegué%20a%20una%20página%20que%20no%20existe%20y%20estaba%20buscando%20algo."
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block text-sm font-semibold text-positive-700 hover:underline"
        >
          ¿Buscabas algo puntual? Escribinos por WhatsApp
        </a>
      </div>
    </div>
  );
}
