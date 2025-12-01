import { TPermission } from '@/types/rbac';
import { Role } from '@prisma/client';
import { sanitizePermissionKeys } from '../../sanitize-permissions';

const getDistinctPermissions = <T extends string | TPermission = TPermission>(roles: Role[]) => {
  const permissionsSet = roles.reduce<Set<T>>((acc, role) => {
    role.permissionKeys.forEach((permissionKey) => {
      acc.add(permissionKey as T);
    });
    return acc;
  }, new Set());

  return sanitizePermissionKeys(Array.from(permissionsSet));
};

export { getDistinctPermissions };
