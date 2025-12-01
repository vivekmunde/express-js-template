import { isActorAuthorizedToModifyUserRoles } from './is-actor-authorized-to-modify-user-roles';

const isActorAuthorizedToArchiveUser = async (
  actorId: string,
  organizationId: string,
  userId: string
) => {
  return await isActorAuthorizedToModifyUserRoles(actorId, organizationId, userId);
};

export { isActorAuthorizedToArchiveUser };
