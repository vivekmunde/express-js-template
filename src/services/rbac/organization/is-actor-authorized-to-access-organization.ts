import { getUserOrganizations } from '../get-user-organizations';

const isActorAuthorizedToAccessOrganization = async (
  actorId: string,
  organizationId: string
): Promise<boolean> => {
  const userOrganizations = await getUserOrganizations(actorId);

  return userOrganizations.some((userOrganization) => {
    return userOrganization.id === organizationId;
  });
};

export { isActorAuthorizedToAccessOrganization };
