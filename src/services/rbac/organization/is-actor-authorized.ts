import { TPermission } from '@/types/rbac';
import { getUserPermissions } from './get-user-permissions';

const isActorAuthorized = async (
  userId: string,
  organizationId: string,
  permissions: TPermission[]
) => {
  const userPermissions = await getUserPermissions(userId, organizationId);

  const isAuthorized =
    permissions.length === 0 ||
    !!userPermissions.find((userPermission) => {
      return !!permissions.find((permission) => {
        return userPermission === permission;
      });
    });

  return isAuthorized;
};

export { isActorAuthorized };
