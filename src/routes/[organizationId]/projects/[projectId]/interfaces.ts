import { TErrorCode } from '@/types/error-code';

export type TGetProjectResponseData = {
  id: string;
  name?: string;
  description?: string;
  documentNumberPrefix: string;
  documentTypes: {
    id: string;
    name: string;
    description?: string;
    color?: {
      light: { background: string; foreground: string };
      dark: { background: string; foreground: string };
    };
  }[];
  documentStatuses: {
    id: string;
    name: string;
    description?: string;
    color?: {
      light: { background: string; foreground: string };
      dark: { background: string; foreground: string };
    };
  }[];
};

export type TGetProjectResponseErrorCode = TErrorCode;

export type TPutProjectRequestData = {
  name: string;
  description?: string;
  documentNumberPrefix: string;
  documentTypeIds: string[];
  documentStatusIds: string[];
};

export type TPutProjectResponseData = {
  id: string;
  name: string;
  description?: string;
  documentNumberPrefix: string;
  documentTypes: {
    id: string;
    name: string;
    description?: string;
    color?: {
      light: { background: string; foreground: string };
      dark: { background: string; foreground: string };
    };
  }[];
  documentStatuses: {
    id: string;
    name: string;
    description?: string;
    color?: {
      light: { background: string; foreground: string };
      dark: { background: string; foreground: string };
    };
  }[];
};

export type TPutProjectResponseErrorCode = TErrorCode;

export type TDeleteProjectResponseErrorCode = TErrorCode;
