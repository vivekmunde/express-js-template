import { TErrorCode } from '@/types/error-code';

export type TGetDocumentTypeResponseData = {
  id: string;
  name?: string;
  description?: string;
  disabled: boolean;
  color?: {
    light: { background: string; foreground: string };
    dark: { background: string; foreground: string };
  };
};

export type TGetDocumentTypeResponseErrorCode = TErrorCode;

export type TPutDocumentTypeRequestData = {
  name: string;
  description?: string;
  lightColorBackground?: string;
  lightColorForeground?: string;
  darkColorBackground?: string;
  darkColorForeground?: string;
  colorForeground?: string;
};

export type TPutDocumentTypeResponseData = {
  id: string;
  name: string;
  description?: string;
  color?: {
    light: { background: string; foreground: string };
    dark: { background: string; foreground: string };
  };
};

export type TPutDocumentTypeResponseErrorCode = TErrorCode;

export type TDeleteDocumentTypeResponseErrorCode = TErrorCode | 'DOCUMENT_TYPE_IN_USE';
