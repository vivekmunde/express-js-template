import { TPermission } from '@/types/rbac';
import { Role } from '@prisma/client';
import { isRoleWithinActorAuthority } from '../../is-role-within-actor-authority';

const filterUserAccessibleRoles = <T extends string | TPermission = TPermission>(
  userRoles: Role[],
  roles: Role[]
) => {
  return roles
    .map((it) => ({
      ...it,
      permissionKeys: it.permissionKeys as T[],
    }))
    .filter((role) =>
      isRoleWithinActorAuthority<T>(
        userRoles.map((it) => ({
          ...it,
          permissionKeys: it.permissionKeys as T[],
        })),
        role
      )
    );
};

export { filterUserAccessibleRoles };
