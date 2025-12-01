import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { ifDocumentStatusExists } from '@/request/if-exists';
import { createDocumentStatusChangeLog } from '@/services/change-log/document-status';
import { createProjectChangeLog } from '@/services/change-log/project';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { TDeleteDocumentStatusResponseErrorCode } from './interfaces';

const removeDocumentStatusFromProjects = async ({
  sessionUser,
  organizationId,
  documentStatusId,
}: {
  sessionUser: User;
  organizationId: string;
  documentStatusId: string;
}) => {
  const projectsUsingDocumentStatus = await prisma.project.findMany({
    where: { organizationId, documentStatusIds: { has: documentStatusId } },
  });

  await Promise.all(
    projectsUsingDocumentStatus.map(async (project) => {
      const updatedProject = await prisma.project.update({
        where: { id: project.id },
        data: {
          documentStatusIds: project.documentStatusIds.filter((id) => id !== documentStatusId),
        },
      });

      await createProjectChangeLog({
        ...updatedProject,
        ...getUpdatedXFields(sessionUser),
      });
    })
  );
};

const DELETE = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  const sessionUser = context.sessionUser;
  const organizationId = req.params.organizationId;
  const documentStatusId = req.params.documentStatusId;

  return ifDocumentStatusExists(
    req,
    res,
    { id: documentStatusId, organizationId },
    async (documentStatusData) => {
      const documentUsingDocumentStatus = await prisma.document.findFirst({
        where: { statusId: documentStatusId, organizationId },
      });
      if (documentUsingDocumentStatus?.id) {
        const responseBody: TResponseBody<undefined, TDeleteDocumentStatusResponseErrorCode> = {
          data: undefined,
          error: {
            code: 'DOCUMENT_STATUS_IN_USE',
            message: req.t('DOCUMENT_STATUS_IN_USE', { ns: 'error-codes' }),
          },
        };

        return res.status(STATUS_CODES.FORBIDDEN).json(responseBody);
      }

      await Promise.all([
        removeDocumentStatusFromProjects({
          sessionUser,
          organizationId,
          documentStatusId,
        }),
        prisma.documentStatus.delete({
          where: { id: documentStatusData.id },
        }),
        await createDocumentStatusChangeLog({ ...documentStatusData, archivedBy: sessionUser.id }),
      ]);

      const responseBody: TResponseBody<undefined, TDeleteDocumentStatusResponseErrorCode> = {
        data: undefined,
      };

      return res.json(responseBody);
    }
  );
};

export { DELETE };
