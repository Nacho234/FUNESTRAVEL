import { redirect } from "next/navigation";
import { AirplaneTiltIcon, GoogleLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { auth, oauthEnabled, signIn } from "@/lib/auth";

export const metadata = { title: "Acceso al panel", robots: { index: false } };

/** Google sign-in for the backoffice. Demo mode skips straight to /admin. */
export default async function AdminAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!oauthEnabled) redirect("/admin");
  const session = await auth();
  if (session) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="grid min-h-[100dvh] place-items-center bg-petrol-950 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[var(--shadow-float)]">
        <span className="grid size-10 place-items-center rounded-full bg-petrol-900 text-ivory">
          <AirplaneTiltIcon weight="fill" className="size-5" aria-hidden />
        </span>
        <p className="mt-4 font-display text-lg font-bold text-petrol-900">
          Funes Travel <span className="text-teal-600">· Admin</span>
        </p>
        <p className="mt-1 text-sm text-graphite-500">
          Panel interno del equipo. Ingresá con tu cuenta de Google autorizada.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-danger-100/60 px-3.5 py-2.5 text-sm text-danger-700" role="alert">
            {error === "AccessDenied"
              ? "Tu cuenta de Google no está autorizada para este panel. Pedile acceso a un administrador."
              : "No pudimos completar el ingreso. Probá de nuevo."}
          </p>
        )}

        <form
          className="mt-6"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2.5 rounded-[var(--radius-control)] border border-graphite-200 bg-white px-4 py-3 text-sm font-bold text-graphite-800 transition-colors hover:border-petrol-600 hover:text-petrol-900 cursor-pointer"
          >
            <GoogleLogoIcon weight="bold" className="size-5" aria-hidden />
            Continuar con Google
          </button>
        </form>

        <p className="mt-5 text-xs leading-relaxed text-graphite-500">
          Solo pueden entrar los correos autorizados por la agencia. La sesión se valida en el
          servidor en cada visita.
        </p>
      </div>
    </div>
  );
}
