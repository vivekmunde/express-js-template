import { TErrorCode } from '@/types/error-code';
import { TModelCollection } from '@/types/model-collection';
import { TPermission } from '@/types/rbac';

export type TGetRole = {
  id: string;
  organizationId?: string;
  name: string;
  description?: string;
  permissionKeys: TPermission[];
};

export type TGetRolesResponseData = TModelCollection<TGetRole>;

export type TGetRolesResponseErrorCode = TErrorCode;

export type TPostRoleRequestData<T extends string | TPermission = TPermission> = {
  name: string;
  description?: string;
  permissionKeys: T[];
};

export type TPostRoleResponseData<T extends string | TPermission = TPermission> = {
  id: string;
  organizationId?: string;
  name: string;
  description?: string;
  permissionKeys: T[];
};

export type TPostRoleResponseErrorCode = TErrorCode;
