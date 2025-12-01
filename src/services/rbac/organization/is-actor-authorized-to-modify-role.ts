import { getRolePermissions } from '../get-role-permissions';
import { isRoleWithinActorAuthority } from '../is-role-within-actor-authority';
import { getUserRoles } from './get-user-roles';

const isActorAuthorizedToModifyRole = async (
  actorId: string,
  organizationId: string,
  roleId: string
): Promise<boolean> => {
  const [userRoles, rolePermissionKeys] = await Promise.all([
    getUserRoles(actorId, organizationId),
    getRolePermissions(roleId),
  ]);

  return isRoleWithinActorAuthority(userRoles, {
    permissionKeys: rolePermissionKeys,
  });
};

export { isActorAuthorizedToModifyRole };
