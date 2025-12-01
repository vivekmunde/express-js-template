import { TPermission } from '@/types/rbac';
import { getSystemUserPermissions } from './get-user-permissions';

const isSystemActorAuthorized = async (userId: string, permissions: TPermission[]) => {
  const userPermissions = await getSystemUserPermissions(userId);

  const isAuthorized =
    permissions.length === 0 ||
    !!userPermissions.find((userPermission) => {
      return !!permissions.find((permission) => {
        return userPermission === permission;
      });
    });

  return isAuthorized;
};

export { isSystemActorAuthorized };
