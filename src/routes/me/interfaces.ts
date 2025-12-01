import { TErrorCode } from '@/types/error-code';
import { TLanguage } from '@/types/language';
import { TUserCategory } from '@/types/user';

export type TGetUserResponseData = {
  id: string;
  email: string;
  name?: string;
  category: TUserCategory;
  preferences?: {
    language?: TLanguage;
    themeMode?: 'light' | 'dark';
  };
  rbac: {
    organizationRoles?: {
      organizationId: string;
      roles: {
        id: string;
        name: string;
      }[];
    }[];
    globalRoles?: {
      roleId: string;
      name: string;
    }[];
  };
};

export type TGetUserResponseErrorCode = TErrorCode;
