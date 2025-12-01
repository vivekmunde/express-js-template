import { TPermission } from '@/types/rbac';

const getOrganizationBasedPermissions = <T extends string | TPermission = TPermission>(
  organizationPermissions: T[],
  userPermissions: T[]
) => {
  const organizationPermissionsSet = new Set(organizationPermissions);

  const permissionsSet = userPermissions.reduce<Set<T>>((acc, permission) => {
    if (organizationPermissionsSet.has(permission)) {
      acc.add(permission);
    }
    return acc;
  }, new Set());

  return Array.from(permissionsSet);
};

export { getOrganizationBasedPermissions };
