import { TErrorCode } from '@/types/error-code';
import { TModelCollection } from '@/types/model-collection';
import { TPermission } from '@/types/rbac';

export type TGetSystemAccessiblePermissionsResponseData = TModelCollection<TPermission>;

export type TGetSystemAccessiblePermissionsResponseErrorCode = TErrorCode;
