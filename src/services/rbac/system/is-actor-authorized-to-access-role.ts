import { isSystemActorAuthorizedToModifyRole } from './is-actor-authorized-to-modify-role';

const isSystemActorAuthorizedToAccessRole = async (
  actorId: string,
  roleId: string
): Promise<boolean> => {
  return isSystemActorAuthorizedToModifyRole(actorId, roleId);
};

export { isSystemActorAuthorizedToAccessRole };
