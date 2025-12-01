import { TErrorCode } from '@/types/error-code';
import { TModelCollection } from '@/types/model-collection';

export type TGetUIErrorDetails = {
  message?: string;
  name?: string;
  stack?: string;
  componentStack?: string;
  digest?: string;
};

export type TGetUIError = {
  id: string;
  error: TGetUIErrorDetails;
  url: string;
  userId?: string;
  createdAt: Date;
};

export type TGetUIErrorsResponseData = TModelCollection<TGetUIError>;

export type TGetUIErrorsResponseErrorCode = TErrorCode;
