import { TPermission } from '@/types/rbac';
import { queryUserRoles } from './query-user-roles';

const getSystemUserRoles = async <T extends string | TPermission = TPermission>(userId: string) => {
  const userRoles = await queryUserRoles(userId);

  return userRoles.map((it) => ({
    ...it,
    permissionKeys: it.permissionKeys as T[],
  }));
};

export { getSystemUserRoles };
