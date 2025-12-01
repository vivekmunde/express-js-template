import { TErrorCode } from '@/types/error-code';
import { TModelCollection } from '@/types/model-collection';

export type TGetRole = {
  id: string;
  organizationId?: string;
  name: string;
  description?: string;
};

export type TGetRolesResponseData = TModelCollection<TGetRole>;

export type TGetRolesResponseErrorCode = TErrorCode;
