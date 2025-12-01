import { TPermission } from '@/types/rbac';
import { isRoleWithinActorAuthority } from '../is-role-within-actor-authority';
import { getUserAccessibleRoles } from './get-user-accessible-roles';

const isActorAuthorizedToCreateRole = async <T extends string | TPermission = TPermission>(
  actorId: string,
  organizationId: string,
  role: { permissionKeys: T[] }
): Promise<boolean> => {
  const userRoles = await getUserAccessibleRoles<T>(actorId, organizationId);

  return isRoleWithinActorAuthority<T>(userRoles, {
    permissionKeys: role.permissionKeys,
  });
};

export { isActorAuthorizedToCreateRole };
