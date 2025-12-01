import { TErrorCode } from '@/types/error-code';
import { TModelCollection } from '@/types/model-collection';

export type TGetDocumentType = {
  id: string;
  name: string;
  description?: string;
  disabled: boolean;
  color?: {
    light: { background: string; foreground: string };
    dark: { background: string; foreground: string };
  };
};

export type TGetDocumentTypesResponseData = TModelCollection<TGetDocumentType>;

export type TGetDocumentTypesResponseErrorCode = TErrorCode;

export type TPostDocumentTypeRequestData = {
  name: string;
  description?: string;
  lightColorBackground?: string;
  lightColorForeground?: string;
  darkColorBackground?: string;
  darkColorForeground?: string;
};

export type TPostDocumentTypeResponseData = {
  id: string;
  name: string;
  description?: string;
  color?: {
    light: { background: string; foreground: string };
    dark: { background: string; foreground: string };
  };
};

export type TPostDocumentTypeResponseErrorCode = TErrorCode;
