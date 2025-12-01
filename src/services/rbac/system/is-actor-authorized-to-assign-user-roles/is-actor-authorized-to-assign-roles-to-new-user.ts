import { areRolesWithinActorAuthority } from '../../are-roles-within-actor-authority';
import { getSystemUserAccessibleRoles } from '../get-user-accessible-roles';
import { queryRoles } from './query-roles';

const isSystemActorAuthorizedToAssignRolesToNewUser = async (
  actorId: string,
  roleIds: string[]
): Promise<boolean> => {
  const [actorRoles, newUserRoles] = await Promise.all([
    getSystemUserAccessibleRoles(actorId),
    roleIds.length > 0 ? queryRoles(roleIds) : [],
  ]);

  const isActorAuthorizedToAssignUserModifiedRoles = areRolesWithinActorAuthority(
    actorRoles,
    newUserRoles
  );

  return isActorAuthorizedToAssignUserModifiedRoles;
};

export { isSystemActorAuthorizedToAssignRolesToNewUser };
