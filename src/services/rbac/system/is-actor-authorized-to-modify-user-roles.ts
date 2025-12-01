import { areRolesWithinActorAuthority } from '../are-roles-within-actor-authority';
import { getSystemUserAccessibleRoles } from './get-user-accessible-roles';
import { getSystemUserRoles } from './get-user-roles';

const isSystemActorAuthorizedToModifyUserRoles = async (
  actorId: string,
  userId: string
): Promise<boolean> => {
  const [actorRoles, userRoles] = await Promise.all([
    getSystemUserAccessibleRoles(actorId),
    getSystemUserRoles(userId),
  ]);

  return areRolesWithinActorAuthority(actorRoles, userRoles);
};

export { isSystemActorAuthorizedToModifyUserRoles };
