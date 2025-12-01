import { isSystemActorAuthorizedToModifyUserRoles } from './is-actor-authorized-to-modify-user-roles';

const isSystemActorAuthorizedToArchiveUser = async (actorId: string, userId: string) => {
  return await isSystemActorAuthorizedToModifyUserRoles(actorId, userId);
};

export { isSystemActorAuthorizedToArchiveUser };
