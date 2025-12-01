import { TErrorCode } from '@/types/error-code';
import { TOrganizationTheme } from '@/types/organization';
import { TPermission } from '@/types/rbac';

export type TGetOrganizationResponseData = {
  id: string;
  name: string;
  code: string;
  email?: string;
  permissionKeys: TPermission[];
  theme?: TOrganizationTheme;
};

export type TGetOrganizationResponseErrorCode = TErrorCode;

export type TPutOrganizationRequestData = {
  name: string;
  code: string;
  email?: string;
  permissionKeys: TPermission[];
  themeLightColorPrimary?: string;
  themeLightColorPrimaryForeground?: string;
  themeLightColorLink?: string;
  themeDarkColorPrimary?: string;
  themeDarkColorPrimaryForeground?: string;
  themeDarkColorLink?: string;
};

export type TPutOrganizationResponseData = {
  id: string;
  name: string;
  code: string;
  email?: string;
  permissionKeys: TPermission[];
  theme?: TOrganizationTheme;
};

export type TPutOrganizationResponseErrorCode = TErrorCode | 'DUPLICATE_ORGANIZATION_CODE';

export type TDeleteOrganizationResponseErrorCode = TErrorCode;
