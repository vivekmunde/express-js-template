import { TPermission } from '@/types/rbac';
import { getOrganizationPermissions } from '../../get-organization-permissions';
import { sanitizePermissionKeys } from '../../sanitize-permissions';
import { getUserRoles } from '../get-user-roles';
import { getDistinctPermissions } from './get-distinct-permissions';
import { getOrganizationBasedPermissions } from './get-organization-based-permissions';

const getUserPermissions = async <T extends string | TPermission = TPermission>(
  userId: string,
  organizationId: string
) => {
  const organizationPermissions = await getOrganizationPermissions<T>(organizationId);

  const userPermissions = getDistinctPermissions<T>(await getUserRoles(userId, organizationId));

  return sanitizePermissionKeys(
    getOrganizationBasedPermissions(organizationPermissions, userPermissions)
  );
};

export { getUserPermissions };
