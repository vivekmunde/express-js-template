import { TPermission } from '@/types/rbac';
import { getSystemUserRoles } from '../get-user-roles';
import { getDistinctPermissions } from './get-distinct-permissions';

const getSystemUserPermissions = async <T extends string | TPermission = TPermission>(
  userId: string
) => {
  const userPermissions = getDistinctPermissions<T>(await getSystemUserRoles(userId));

  return userPermissions;
};

export { getSystemUserPermissions };
