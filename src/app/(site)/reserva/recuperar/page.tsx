import type { Metadata } from "next";
import { RecoverForm } from "@/components/checkout/recover-form";

export const metadata: Metadata = {
  title: "Recuperar una reserva",
  description: "Recuperá el acceso a tu reserva de Funes Travel con tu código y correo electrónico.",
};

export default function RecoverPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 pb-20">
      <h1 className="font-display text-3xl font-bold tracking-tight text-petrol-900">Recuperar una reserva</h1>
      <p className="mt-2 text-graphite-600">
        Ingresá el código que te llegó por correo y el email con el que reservaste.
      </p>
      <div className="mt-6">
        <RecoverForm />
      </div>
    </div>
  );
}
