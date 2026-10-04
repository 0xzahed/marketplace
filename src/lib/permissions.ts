import type { Role } from "@/types";

export const ROLE_HOME: Record<Role, string> = {
  customer: "/customer/dashboard",
  provider: "/provider/dashboard",
  admin: "/admin/dashboard",
};

export function canAccess(userRole: Role | null, allowed: Role[]): boolean {
  if (!userRole) return false;
  return allowed.includes(userRole);
}
