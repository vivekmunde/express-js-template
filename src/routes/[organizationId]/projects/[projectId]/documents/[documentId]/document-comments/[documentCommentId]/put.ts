import { prisma } from '@/prisma';
import { ifDocumentCommentExists } from '@/request/if-exists';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createDocumentCommentChangeLog } from '@/services/change-log/document-comment';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Request, Response } from 'express';
import { TPutDocumentCommentResponseData } from './interfaces';
import { getUpdateDocumentCommentValidationSchema } from './validation-schema';

const PUT = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(
    req,
    res,
    getUpdateDocumentCommentValidationSchema(req),
    async (data) => {
      const organizationId = req.params.organizationId;
      const documentCommentId = req.params.documentCommentId;
      const projectId = req.params.projectId;

      return ifDocumentCommentExists(
        req,
        res,
        { id: documentCommentId, organizationId, projectId },
        async () => {
          const updatedDocumentCommentData = await prisma.documentComment.update({
            where: { id: documentCommentId, projectId },
            data: {
              comment: data.comment,
              parentId: data.parentId,
              toUserIds: data.toUserIds,
              ccUserIds: data.ccUserIds,
              ...getUpdatedXFields(context.sessionUser),
            },
          });

          await createDocumentCommentChangeLog(updatedDocumentCommentData);

          const responseBody: TResponseBody<TPutDocumentCommentResponseData> = {
            data: {
              id: updatedDocumentCommentData.id,
              comment: updatedDocumentCommentData.comment,
              parentId: updatedDocumentCommentData.parentId ?? undefined,
              toUserIds: updatedDocumentCommentData.toUserIds,
              ccUserIds: updatedDocumentCommentData.ccUserIds,
            },
          };

          return res.json(responseBody);
        }
      );
    }
  );
};

export { PUT };
