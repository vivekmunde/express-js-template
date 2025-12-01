import { getRolePermissions } from '../get-role-permissions';
import { isRoleWithinActorAuthority } from '../is-role-within-actor-authority';
import { getSystemUserRoles } from './get-user-roles';

const isSystemActorAuthorizedToModifyRole = async (
  actorId: string,
  roleId: string
): Promise<boolean> => {
  const [userRoles, rolePermissionKeys] = await Promise.all([
    getSystemUserRoles(actorId),
    getRolePermissions(roleId),
  ]);

  return isRoleWithinActorAuthority(userRoles, {
    permissionKeys: rolePermissionKeys,
  });
};

export { isSystemActorAuthorizedToModifyRole };
