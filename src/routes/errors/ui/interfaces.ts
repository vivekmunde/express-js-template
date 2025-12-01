import { TErrorCode } from '@/types/error-code';

export type TPostUIErrorDetails = {
  message: string;
  name: string;
  stack?: string;
  componentStack?: string;
  digest?: string;
};

export type TPostUIErrorRequestData = {
  error: TPostUIErrorDetails;
  url: string;
};

export type TPostUIErrorResponseData = {
  id: string;
};

export type TPostUIErrorResponseErrorCode = TErrorCode;
