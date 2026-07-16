"use client";

import { adminRoles } from "@/data/admin-core";
import type { AdminPermission } from "@/lib/admin-types";
import { useAdminSession } from "@/components/admin/admin-shell";

/** Permission check for the current demo session. Real checks live server-side. */
export function usePermissions() {
  const session = useAdminSession();
  const role = adminRoles.find((r) => r.id === session?.role);
  const can = (permission: AdminPermission) => Boolean(role?.permissions.includes(permission));
  return { session, role, can };
}
