import { areRolesWithinActorAuthority } from '../../are-roles-within-actor-authority';
import { getUserAccessibleRoles } from '../get-user-accessible-roles';
import { getUserRoles } from '../get-user-roles';
import { queryRoles } from './query-roles';

const isActorAuthorizedToAssignRolesToExistingUser = async (
  actorId: string,
  organizationId: string,
  userId: string,
  roleIds: string[]
): Promise<boolean> => {
  const [actorRoles, userCurrentRoles, userUpdatedRoles] = await Promise.all([
    getUserAccessibleRoles(actorId, organizationId),
    getUserRoles(userId, organizationId),
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

export { isActorAuthorizedToAssignRolesToExistingUser };
