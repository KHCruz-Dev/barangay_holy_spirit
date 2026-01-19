import { useMemo } from "react";
import { ROLES } from "../../../../../config/navigation/roles";

export function useRoleAccess(user) {
  const roles = useMemo(() => {
    if (!user) return [];

    // Backend sends single role
    if (typeof user.role === "string") {
      return [user.role];
    }

    // Backend sends multiple roles
    if (Array.isArray(user.roles)) {
      return user.roles;
    }

    return [];
  }, [user]);

  const canManageID =
    roles.includes(ROLES.ADMINISTRATOR) || roles.includes(ROLES.ID_PRINTER);

  return { roles, canManageID };
}
