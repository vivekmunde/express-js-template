import { TPermission } from '@/types/rbac';
import { getPermissions } from './get-permissions';

const sanitizePermissionKeys = <T extends string | TPermission = TPermission>(
  permissionKeys: T[]
): T[] => {
  const permissionKeysSet = new Set(getPermissions<T>());

  return permissionKeys.filter((key) => permissionKeysSet.has(key));
};

export { sanitizePermissionKeys };
