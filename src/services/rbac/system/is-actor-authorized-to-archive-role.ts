import { isSystemActorAuthorizedToModifyRole } from './is-actor-authorized-to-modify-role';

const isSystemActorAuthorizedToArchiveRole = async (
  actorId: string,
  roleId: string
): Promise<boolean> => {
  return isSystemActorAuthorizedToModifyRole(actorId, roleId);
};

export { isSystemActorAuthorizedToArchiveRole };
