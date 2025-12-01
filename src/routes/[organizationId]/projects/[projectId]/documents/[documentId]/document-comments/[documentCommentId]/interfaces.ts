import { TErrorCode } from '@/types/error-code';

export type TGetDocumentCommentResponseData = {
  id: string;
  parentId?: string;
  toUserIds: string[];
  ccUserIds: string[];
  comment: string;
};

export type TGetDocumentCommentResponseErrorCode = TErrorCode;

export type TPutDocumentCommentRequestData = {
  parentId?: string;
  toUserIds: string[];
  ccUserIds: string[];
  comment: string;
};

export type TPutDocumentCommentResponseData = {
  id: string;
  parentId?: string;
  toUserIds: string[];
  ccUserIds: string[];
  comment: string;
};

export type TPutDocumentCommentResponseErrorCode = TErrorCode;

export type TDeleteDocumentCommentResponseErrorCode = TErrorCode;
