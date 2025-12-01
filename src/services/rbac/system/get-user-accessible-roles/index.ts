import { TPermission } from '@/types/rbac';
import { getSystemUserRoles } from '../get-user-roles';
import { filterUserAccessibleRoles } from './filter-user-accessible-roles';
import { queryRoles } from './query-roles';

const getSystemUserAccessibleRoles = async <T extends string | TPermission = TPermission>(
  userId: string
) => {
  const [userRoles, allRoles] = await Promise.all([getSystemUserRoles<T>(userId), queryRoles()]);

  return filterUserAccessibleRoles<T>(userRoles, allRoles) ?? [];
};

export { getSystemUserAccessibleRoles };
