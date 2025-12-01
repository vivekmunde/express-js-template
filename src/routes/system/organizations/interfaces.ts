import { TErrorCode } from '@/types/error-code';
import { TModelCollection } from '@/types/model-collection';
import { TOrganizationTheme } from '@/types/organization';
import { TPermission } from '@/types/rbac';

export type TGetOrganization = {
  id: string;
  name: string;
  code: string;
  email?: string;
  permissionKeys: TPermission[];
  theme?: TOrganizationTheme;
};

export type TGetOrganizationsResponseData = TModelCollection<TGetOrganization>;

export type TGetOrganizationsResponseErrorCode = TErrorCode;

export type TPostOrganizationRequestData = {
  name: string;
  code?: string;
  email?: string;
  permissionKeys: TPermission[];
  themeLightColorPrimary?: string;
  themeLightColorPrimaryForeground?: string;
  themeLightColorLink?: string;
  themeDarkColorPrimary?: string;
  themeDarkColorPrimaryForeground?: string;
  themeDarkColorLink?: string;
};

export type TPostOrganizationResponseData = {
  id: string;
  name: string;
  code: string;
  email?: string;
  permissionKeys: TPermission[];
  theme?: TOrganizationTheme;
};

export type TPostOrganizationResponseErrorCode = TErrorCode | 'DUPLICATE_ORGANIZATION_CODE';
