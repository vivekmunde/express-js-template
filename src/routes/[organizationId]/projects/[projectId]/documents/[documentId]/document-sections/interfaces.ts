import { TErrorCode } from '@/types/error-code';
import { TModelCollection } from '@/types/model-collection';

export type TGetDocumentSection = {
  id: string;
  title: string;
  description?: string;
};

export type TGetDocumentSectionsResponseData = TModelCollection<TGetDocumentSection>;

export type TGetDocumentSectionsResponseErrorCode = TErrorCode;

export type TPostDocumentSectionRequestData = {
  title: string;
  description?: string;
};

export type TPostDocumentSectionResponseData = {
  id: string;
  title: string;
  description?: string;
};

export type TPostDocumentSectionResponseErrorCode = TErrorCode;
