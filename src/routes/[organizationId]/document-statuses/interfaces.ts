import { TErrorCode } from '@/types/error-code';
import { TModelCollection } from '@/types/model-collection';

export type TGetDocumentStatus = {
  id: string;
  name: string;
  description?: string;
  disabled: boolean;
  color?: {
    light: { background: string; foreground: string };
    dark: { background: string; foreground: string };
  };
};

export type TGetDocumentStatusResponseData = TModelCollection<TGetDocumentStatus>;

export type TGetDocumentStatusResponseErrorCode = TErrorCode;

export type TPostDocumentStatusRequestData = {
  name: string;
  description?: string;
  lightColorBackground?: string;
  lightColorForeground?: string;
  darkColorBackground?: string;
  darkColorForeground?: string;
  colorForeground?: string;
};

export type TPostDocumentStatusResponseData = {
  id: string;
  name: string;
  description?: string;
  color?: {
    light: { background: string; foreground: string };
    dark: { background: string; foreground: string };
  };
};

export type TPostDocumentStatusResponseErrorCode = TErrorCode;
