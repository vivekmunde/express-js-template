import { TPermission } from '@/types/rbac';
import { queryOrganizationPermissions } from './query-organization-permissions';

const getOrganizationPermissions = async <T extends string | TPermission = TPermission>(
  organizationId: string
) => {
  const organizationPermissions = await queryOrganizationPermissions(organizationId);
  return organizationPermissions as T[];
};

export { getOrganizationPermissions };
