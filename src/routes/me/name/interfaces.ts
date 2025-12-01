import { TErrorCode } from '@/types/error-code';

export type TPutNameRequestData = {
  name: string;
};

export type TPutNameResponseData = {
  id: string;
  name?: string;
};

export type TPutNameResponseErrorCode = TErrorCode;
