import { getUserPermissions } from './get-user-permissions';
import { isActorAuthorizedToAccessOrganization } from './is-actor-authorized-to-access-organization';

async function isActorAuthorizedToModifyOrganization(
  actorId: string,
  organizationId: string
): Promise<boolean> {
  const [userPermissions, isAuthorizedToAccessOrganization] = await Promise.all([
    getUserPermissions(actorId, organizationId),
    await isActorAuthorizedToAccessOrganization(actorId, organizationId),
  ]);

  return (
    isAuthorizedToAccessOrganization &&
    !!userPermissions.find((permission) => permission === 'MANAGE_ORGANIZATION')
  );
}

export { isActorAuthorizedToModifyOrganization };
