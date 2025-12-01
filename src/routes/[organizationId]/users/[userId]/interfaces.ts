import { TErrorCode } from '@/types/error-code';

export type TGetUserResponseData = {
  id: string;
  name?: string;
  email: string;
  roles?: {
    id: string;
    name: string;
  }[];
};

export type TGetUserResponseErrorCode = TErrorCode;

export type TPutUserRequestData = {
  email: string;
  roleIds: string[];
};

export type TPutUserResponseData = {
  id: string;
  email: string;
  roleIds: string[];
};

export type TPutUserResponseErrorCode = TErrorCode;
