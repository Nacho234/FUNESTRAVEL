"use client";

import { adminRoles } from "@/data/admin-core";
import type { AdminPermission } from "@/lib/admin-types";
import { useAdminSession } from "../admin-shell";

/** Permission helper for catalog modules (demo: real checks live server-side). */
export function usePerms() {
  const session = useAdminSession();
  const permissions = adminRoles.find((r) => r.id === session?.role)?.permissions ?? [];
  return {
    has: (p: AdminPermission) => permissions.includes(p),
    role: session?.role,
    name: session?.name,
  };
}
