import { prisma } from '@/prisma';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createDocumentCommentChangeLog } from '@/services/change-log/document-comment';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TPostDocumentCommentResponseData } from './interfaces';
import { getCreateDocumentCommentValidationSchema } from './validation-schema';

const POST = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(
    req,
    res,
    getCreateDocumentCommentValidationSchema(req),
    async (data) => {
      const organizationId = req.params.organizationId;
      const documentId = req.params.documentId;
      const projectId = req.params.projectId;

      const createdDocumentCommentData = await prisma.documentComment.create({
        data: {
          documentId,
          organizationId,
          projectId,
          parentId: data.parentId,
          toUserIds: data.toUserIds,
          ccUserIds: data.ccUserIds,
          comment: data.comment,
          createdBy: context.sessionUser.id,
        },
      });

      await createDocumentCommentChangeLog(createdDocumentCommentData);

      const responseBody: TResponseBody<TPostDocumentCommentResponseData> = {
        data: {
          id: createdDocumentCommentData.id,
          parentId: createdDocumentCommentData.parentId ?? undefined,
          toUserIds: createdDocumentCommentData.toUserIds,
          ccUserIds: createdDocumentCommentData.ccUserIds,
          comment: createdDocumentCommentData.comment,
        },
      };

      return res.json(responseBody);
    }
  );
};

export { POST };
