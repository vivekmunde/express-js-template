import { TErrorCode } from '@/types/error-code';
import { TModelCollection } from '@/types/model-collection';

export type TGetOrganization = {
  id: string;
  name: string;
  code: string;
};

export type TGetOrganizationsResponseData = TModelCollection<TGetOrganization>;

export type TGetOrganizationsResponseErrorCode = TErrorCode;
