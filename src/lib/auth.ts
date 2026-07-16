import NextAuth, { type NextAuthResult } from "next-auth";
import Google from "next-auth/providers/google";
import type { AdminRoleId } from "@/lib/admin-types";

/**
 * Google OAuth for the /admin backoffice (Auth.js v5, JWT sessions — no
 * database required yet).
 *
 * - Enabled only when AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET exist; otherwise the
 *   panel keeps its local demo gate so development works without credentials.
 * - Access is restricted to the ADMIN_EMAILS allowlist (comma-separated).
 * - The role for each email comes from ADMIN_ROLE_MAP
 *   ("mail@dominio.com=superadmin,otra@dominio.com=ventas"); anyone allowed
 *   but unmapped enters as "lectura".
 */

export const oauthEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

const allowlist = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const roleMap: Record<string, AdminRoleId> = Object.fromEntries(
  (process.env.ADMIN_ROLE_MAP ?? "")
    .split(",")
    .map((pair) => pair.split("=").map((s) => s.trim().toLowerCase()))
    .filter((pair): pair is [string, string] => pair.length === 2 && Boolean(pair[0]) && Boolean(pair[1]))
    .map(([email, role]) => [email, role as AdminRoleId]),
);

declare module "next-auth" {
  interface Session {
    role?: AdminRoleId;
  }
}

function buildAuth(): Pick<NextAuthResult, "handlers" | "auth" | "signIn" | "signOut"> {
  if (!oauthEnabled) {
    // Stub so the app builds and runs without credentials (demo mode).
    const notConfigured = async () =>
      new Response("OAuth de Google no configurado. Definí AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET y ADMIN_EMAILS.", {
        status: 404,
      });
    return {
      handlers: { GET: notConfigured, POST: notConfigured },
      auth: (async () => null) as NextAuthResult["auth"],
      signIn: (async () => {
        throw new Error("OAuth no configurado");
      }) as NextAuthResult["signIn"],
      signOut: (async () => {
        throw new Error("OAuth no configurado");
      }) as NextAuthResult["signOut"],
    };
  }

  return NextAuth({
    providers: [Google],
    trustHost: true,
    session: { strategy: "jwt" },
    pages: { signIn: "/acceso" },
    callbacks: {
      signIn({ user }) {
        const email = user.email?.toLowerCase();
        // Empty allowlist means nobody enters: access must be explicit.
        return Boolean(email && allowlist.includes(email));
      },
      jwt({ token }) {
        const email = String(token.email ?? "").toLowerCase();
        token.role = roleMap[email] ?? "lectura";
        return token;
      },
      session({ session, token }) {
        session.role = (token.role as AdminRoleId) ?? "lectura";
        return session;
      },
    },
  });
}

export const { handlers, auth, signIn, signOut } = buildAuth();
