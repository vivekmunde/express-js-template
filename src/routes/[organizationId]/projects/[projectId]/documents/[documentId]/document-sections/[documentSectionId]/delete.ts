import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { ifDocumentSectionExists } from '@/request/if-exists';
import { createDocumentSectionChangeLog } from '@/services/change-log/document-section';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TDeleteDocumentSectionResponseErrorCode } from './interfaces';

const DELETE = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  const sessionUser = context.sessionUser;
  const organizationId = req.params.organizationId;
  const projectId = req.params.projectId;
  const documentSectionId = req.params.documentSectionId;

  return ifDocumentSectionExists(
    req,
    res,
    { id: documentSectionId, projectId },
    async (documentSectionData) => {
      if (
        documentSectionData.organizationId === organizationId &&
        documentSectionData.projectId === projectId
      ) {
        await Promise.all([
          prisma.documentSection.delete({
            where: { id: documentSectionData.id, projectId },
          }),
          await createDocumentSectionChangeLog({
            ...documentSectionData,
            archivedBy: sessionUser.id,
          }),
        ]);

        const responseBody: TResponseBody<undefined, TDeleteDocumentSectionResponseErrorCode> = {
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
