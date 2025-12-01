import { TPermission } from '@/types/rbac';
import { getUserRoles } from '../get-user-roles';
import { filterUserAccessibleRoles } from './filter-user-accessible-roles';
import { queryRoles } from './query-roles';

const getUserAccessibleRoles = async <T extends string | TPermission = TPermission>(
  userId: string,
  organizationId: string
) => {
  const [userRoles, allRoles] = await Promise.all([
    getUserRoles<T>(userId, organizationId),
    queryRoles(organizationId),
  ]);

  return filterUserAccessibleRoles<T>(userRoles, allRoles) ?? [];
};

export { getUserAccessibleRoles };
