import { areRolesWithinActorAuthority } from '../../are-roles-within-actor-authority';
import { getUserAccessibleRoles } from '../get-user-accessible-roles';
import { queryRoles } from './query-roles';

const isActorAuthorizedToAssignRolesToNewUser = async (
  actorId: string,
  organizationId: string,
  roleIds: string[]
): Promise<boolean> => {
  const [actorRoles, newUserRoles] = await Promise.all([
    getUserAccessibleRoles(actorId, organizationId),
    roleIds.length > 0 ? queryRoles(roleIds) : [],
  ]);

  const isActorAuthorizedToAssignUserModifiedRoles = areRolesWithinActorAuthority(
    actorRoles,
    newUserRoles
  );

  return isActorAuthorizedToAssignUserModifiedRoles;
};

export { isActorAuthorizedToAssignRolesToNewUser };
