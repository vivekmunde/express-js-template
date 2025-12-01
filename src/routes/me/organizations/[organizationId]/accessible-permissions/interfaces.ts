import { TErrorCode } from '@/types/error-code';
import { TModelCollection } from '@/types/model-collection';
import { TPermission } from '@/types/rbac';

export type TGetOrganizationResponseData = TModelCollection<TPermission>;

export type TGetOrganizationResponseErrorCode = TErrorCode;
