import { TPermission } from '@/types/rbac';
import { sanitizePermissionKeys } from '../sanitize-permissions';
import { queryRole } from './query-role';

const getRolePermissions = async <T extends string | TPermission = TPermission>(roleId: string) => {
  const roleData = await queryRole(roleId);
  return sanitizePermissionKeys((roleData?.permissionKeys ?? []) as T[]);
};

export { getRolePermissions };
