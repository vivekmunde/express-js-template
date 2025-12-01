import { TErrorCode } from '@/types/error-code';

export type TGetDocumentStatusResponseData = {
  id: string;
  name?: string;
  description?: string;
  disabled: boolean;
  color?: {
    light: { background: string; foreground: string };
    dark: { background: string; foreground: string };
  };
};

export type TGetDocumentStatusResponseErrorCode = TErrorCode;

export type TPutDocumentStatusRequestData = {
  name: string;
  description?: string;
  lightColorBackground?: string;
  lightColorForeground?: string;
  darkColorBackground?: string;
  darkColorForeground?: string;
  colorForeground?: string;
};

export type TPutDocumentStatusResponseData = {
  id: string;
  name: string;
  description?: string;
  color?: {
    light: { background: string; foreground: string };
    dark: { background: string; foreground: string };
  };
};

export type TPutDocumentStatusResponseErrorCode = TErrorCode;

export type TDeleteDocumentStatusResponseErrorCode = TErrorCode | 'DOCUMENT_STATUS_IN_USE';
