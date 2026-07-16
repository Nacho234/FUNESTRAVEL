"use client";

import { adminRoles } from "@/data/admin-core";
import type { AdminPermission } from "@/lib/admin-types";
import { useAdminSession } from "../admin-shell";

/**
 * Demo permission check derived from the logged-in role. UI-gating only:
 * in production every permission is re-validated on the server.
 */
export function usePermissions() {
  const session = useAdminSession();
  const role = adminRoles.find((r) => r.id === session?.role);
  return {
    can: (p: AdminPermission) => role?.permissions.includes(p) ?? false,
    roleName: role?.name ?? "",
  };
}
