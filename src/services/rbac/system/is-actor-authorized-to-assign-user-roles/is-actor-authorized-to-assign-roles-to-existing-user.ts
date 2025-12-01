import { areRolesWithinActorAuthority } from '../../are-roles-within-actor-authority';
import { getSystemUserAccessibleRoles } from '../get-user-accessible-roles';
import { getSystemUserRoles } from '../get-user-roles';
import { queryRoles } from './query-roles';

const isSystemActorAuthorizedToAssignRolesToExistingUser = async (
  actorId: string,
  userId: string,
  roleIds: string[]
): Promise<boolean> => {
  const [actorRoles, userCurrentRoles, userUpdatedRoles] = await Promise.all([
    getSystemUserAccessibleRoles(actorId),
    getSystemUserRoles(userId),
    roleIds.length > 0 ? queryRoles(roleIds) : [],
  ]);

  const isActorAuthorizedToModifyUserCurrentRoles = areRolesWithinActorAuthority(
    actorRoles,
    userCurrentRoles
  );

  const isActorAuthorizedToAssignUserModifiedRoles = areRolesWithinActorAuthority(
    actorRoles,
    userUpdatedRoles
  );

  return isActorAuthorizedToModifyUserCurrentRoles && isActorAuthorizedToAssignUserModifiedRoles;
};

export { isSystemActorAuthorizedToAssignRolesToExistingUser };
