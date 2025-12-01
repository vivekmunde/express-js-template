import { TErrorCode } from '@/types/error-code';
import { TModelCollection } from '@/types/model-collection';

export type TGetDocumentComment = {
  id: string;
  parentId?: string;
  toUserIds: string[];
  ccUserIds: string[];
  comment: string;
};

export type TGetDocumentCommentsResponseData = TModelCollection<TGetDocumentComment>;

export type TGetDocumentCommentsResponseErrorCode = TErrorCode;

export type TPostDocumentCommentRequestData = {
  parentId?: string;
  toUserIds: string[];
  ccUserIds: string[];
  comment: string;
};

export type TPostDocumentCommentResponseData = {
  id: string;
  parentId?: string;
  toUserIds: string[];
  ccUserIds: string[];
  comment: string;
};

export type TPostDocumentCommentResponseErrorCode = TErrorCode;
