import { TErrorCode } from '@/types/error-code';
import { TOrganizationTheme } from '@/types/organization';

export type TGetOrganizationResponseData = {
  id: string;
  name: string;
  code: string;
  theme?: TOrganizationTheme;
};

export type TGetOrganizationResponseErrorCode = TErrorCode;
