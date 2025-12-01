import { TPermission } from '@/types/rbac';
import { isRoleWithinActorAuthority } from '../is-role-within-actor-authority';
import { getSystemUserAccessibleRoles } from './get-user-accessible-roles';

const isSystemActorAuthorizedToCreateRole = async <T extends string | TPermission = TPermission>(
  actorId: string,
  role: { permissionKeys: T[] }
): Promise<boolean> => {
  const userRoles = await getSystemUserAccessibleRoles<T>(actorId);

  return isRoleWithinActorAuthority<T>(userRoles, {
    permissionKeys: role.permissionKeys,
  });
};

export { isSystemActorAuthorizedToCreateRole };
