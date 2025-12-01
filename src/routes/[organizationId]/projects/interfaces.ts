import { TErrorCode } from '@/types/error-code';
import { TModelCollection } from '@/types/model-collection';

export type TGetProject = {
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

export type TGetProjectsResponseData = TModelCollection<TGetProject>;

export type TGetProjectsResponseErrorCode = TErrorCode;

export type TPostProjectRequestData = {
  name: string;
  description?: string;
  documentNumberPrefix: string;
  documentTypeIds: string[];
  documentStatusIds: string[];
};

export type TPostProjectResponseData = {
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

export type TPostProjectResponseErrorCode = TErrorCode;
