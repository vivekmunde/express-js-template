import { TPermission } from '@/types/rbac';
import { queryUserRoles } from './query-user-roles';

const getUserRoles = async <T extends string | TPermission = TPermission>(
  userId: string,
  organizationId: string
) => {
  const userRoles = await queryUserRoles(userId, organizationId);

  return userRoles.map((it) => ({
    ...it,
    permissionKeys: it.permissionKeys as T[],
  }));
};

export { getUserRoles };
