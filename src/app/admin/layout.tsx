import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell, type OAuthUser } from "@/components/admin/admin-shell";
import { auth, oauthEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Panel administrativo · Funes Travel",
    template: "%s · Admin Funes Travel",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // With Google OAuth configured, every /admin request is validated on the
  // server; without credentials, the shell falls back to the local demo gate.
  let oauthUser: OAuthUser | undefined;
  if (oauthEnabled) {
    const session = await auth();
    if (!session?.user) redirect("/acceso");
    oauthUser = {
      name: session.user.name ?? session.user.email ?? "Equipo",
      email: session.user.email ?? "",
      role: session.role ?? "lectura",
      image: session.user.image ?? undefined,
    };
  }
  return <AdminShell oauthUser={oauthUser}>{children}</AdminShell>;
}
