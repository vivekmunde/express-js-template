import { TPermission } from '@/types/rbac';

const allPermissions: Record<TPermission, TPermission> = {
  READ_ERROR: 'READ_ERROR',
  READ_ORGANIZATION: 'READ_ORGANIZATION',
  MANAGE_ORGANIZATION: 'MANAGE_ORGANIZATION',
  READ_ROLE: 'READ_ROLE',
  MANAGE_ROLE: 'MANAGE_ROLE',
  READ_USER: 'READ_USER',
  MANAGE_USER: 'MANAGE_USER',
  READ_PROJECT: 'READ_PROJECT',
  MANAGE_PROJECT: 'MANAGE_PROJECT',
  READ_DOCUMENT_TYPE: 'READ_DOCUMENT_TYPE',
  MANAGE_DOCUMENT_TYPE: 'MANAGE_DOCUMENT_TYPE',
  READ_DOCUMENT_STATUS: 'READ_DOCUMENT_STATUS',
  MANAGE_DOCUMENT_STATUS: 'MANAGE_DOCUMENT_STATUS',
  READ_DOCUMENT: 'READ_DOCUMENT',
  MANAGE_DOCUMENT: 'MANAGE_DOCUMENT',
};

const permissionKeys: TPermission[] = Object.keys(allPermissions) as TPermission[];

const getPermissions = <T extends string | TPermission = TPermission>(): T[] => {
  return permissionKeys as T[];
};

export { getPermissions };
