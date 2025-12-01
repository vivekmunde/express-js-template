import { TErrorCode } from '@/types/error-code';

export type TGetDocumentSectionResponseData = {
  id: string;
  title?: string;
  description?: string;
};

export type TGetDocumentSectionResponseErrorCode = TErrorCode;

export type TPutDocumentSectionRequestData = {
  title: string;
  description?: string;
};

export type TPutDocumentSectionResponseData = {
  id: string;
  title: string;
  description?: string;
};

export type TPutDocumentSectionResponseErrorCode = TErrorCode;

export type TDeleteDocumentSectionResponseErrorCode = TErrorCode;
