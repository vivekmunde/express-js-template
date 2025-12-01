import { isActorAuthorizedToModifyRole } from './is-actor-authorized-to-modify-role';

const isActorAuthorizedToArchiveRole = async (
  actorId: string,
  organizationId: string,
  roleId: string
): Promise<boolean> => {
  return isActorAuthorizedToModifyRole(actorId, organizationId, roleId);
};

export { isActorAuthorizedToArchiveRole };
