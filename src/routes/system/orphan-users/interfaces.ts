import { TErrorCode } from '@/types/error-code';
import { TModelCollection } from '@/types/model-collection';

export type TGetUser = {
  id: string;
  name?: string;
  email: string;
  roles?: {
    id: string;
    name: string;
  }[];
};

export type TGetUsersResponseData = TModelCollection<TGetUser>;

export type TGetUsersResponseErrorCode = TErrorCode;

export type TPostUserRequestData = {
  email: string;
  roleIds: string[];
};

export type TPostUserResponseData = {
  id: string;
  email: string;
  roleIds: string[];
};

export type TPostUserResponseErrorCode = TErrorCode | 'USER_EXISTS';
