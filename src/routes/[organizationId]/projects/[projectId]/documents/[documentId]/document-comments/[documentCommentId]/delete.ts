import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { ifDocumentCommentExists } from '@/request/if-exists';
import { createDocumentCommentChangeLog } from '@/services/change-log/document-comment';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TDeleteDocumentCommentResponseErrorCode } from './interfaces';

const DELETE = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  const sessionUser = context.sessionUser;
  const organizationId = req.params.organizationId;
  const documentCommentId = req.params.documentCommentId;
  const projectId = req.params.projectId;

  return ifDocumentCommentExists(
    req,
    res,
    { id: documentCommentId, projectId },
    async (documentCommentData) => {
      if (
        documentCommentData.organizationId === organizationId &&
        documentCommentData.projectId === projectId
      ) {
        await Promise.all([
          prisma.documentComment.delete({
            where: { id: documentCommentData.id, projectId },
          }),
          await createDocumentCommentChangeLog({
            ...documentCommentData,
            archivedBy: sessionUser.id,
          }),
        ]);

        const responseBody: TResponseBody<undefined, TDeleteDocumentCommentResponseErrorCode> = {
          data: undefined,
        };

        return res.json(responseBody);
      } else {
        return res.status(STATUS_CODES.NOT_FOUND);
      }
    }
  );
};

export { DELETE };
