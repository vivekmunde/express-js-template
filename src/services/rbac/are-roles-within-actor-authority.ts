import { TPermission } from '@/types/rbac';
import { isRoleWithinActorAuthority } from './is-role-within-actor-authority';

const areRolesWithinActorAuthority = <T extends string | TPermission = TPermission>(
  actorRoles: { permissionKeys: T[] }[],
  roles: { permissionKeys: T[] }[]
): boolean => {
  return roles.every((role) => isRoleWithinActorAuthority(actorRoles, role));
};

export { areRolesWithinActorAuthority };
