import { TPermission } from '@/types/rbac';

const isRoleWithinActorAuthority = <T extends string | TPermission = TPermission>(
  actorRoles: { permissionKeys: T[] }[],
  role: { permissionKeys: T[] }
): boolean => {
  const actorPermissions = actorRoles.reduce<Set<string>>((acc, curr) => {
    curr.permissionKeys.forEach((permissionKey) => acc.add(permissionKey));
    return acc;
  }, new Set());

  return role.permissionKeys.every((permissionKey) => actorPermissions.has(permissionKey));
};

export { isRoleWithinActorAuthority };
