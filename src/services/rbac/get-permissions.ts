import { TPermission } from '@/types/rbac';

const allPermissions: Record<TPermission, TPermission> = {
  READ_ERROR: 'READ_ERROR',
  READ_ORGANIZATION: 'READ_ORGANIZATION',
  MANAGE_ORGANIZATION: 'MANAGE_ORGANIZATION',
  READ_ROLE: 'READ_ROLE',
  MANAGE_ROLE: 'MANAGE_ROLE',
  READ_USER: 'READ_USER',
  MANAGE_USER: 'MANAGE_USER',
};

const permissionKeys: TPermission[] = Object.keys(allPermissions) as TPermission[];

const getPermissions = <T extends string | TPermission = TPermission>(): T[] => {
  return permissionKeys as T[];
};

export { getPermissions };
