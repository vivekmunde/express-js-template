import { areRolesWithinActorAuthority } from '../are-roles-within-actor-authority';
import { getUserAccessibleRoles } from './get-user-accessible-roles';
import { getUserRoles } from './get-user-roles';

const isActorAuthorizedToModifyUserRoles = async (
  actorId: string,
  organizationId: string,
  userId: string
): Promise<boolean> => {
  const [actorRoles, userRoles] = await Promise.all([
    getUserAccessibleRoles(actorId, organizationId),
    getUserRoles(userId, organizationId),
  ]);

  return areRolesWithinActorAuthority(actorRoles, userRoles);
};

export { isActorAuthorizedToModifyUserRoles };
