import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { ifDocumentTypeExists } from '@/request/if-exists';
import { createDocumentTypeChangeLog } from '@/services/change-log/document-type';
import { createProjectChangeLog } from '@/services/change-log/project';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { TDeleteDocumentTypeResponseErrorCode } from './interfaces';

const removeDocumentTypeFromProjects = async ({
  sessionUser,
  organizationId,
  documentTypeId,
}: {
  sessionUser: User;
  organizationId: string;
  documentTypeId: string;
}) => {
  const projectsUsingDocumentType = await prisma.project.findMany({
    where: { organizationId, documentTypeIds: { has: documentTypeId } },
  });

  await Promise.all(
    projectsUsingDocumentType.map(async (project) => {
      const updatedProject = await prisma.project.update({
        where: { id: project.id },
        data: {
          documentTypeIds: project.documentTypeIds.filter((id) => id !== documentTypeId),
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
  const documentTypeId = req.params.documentTypeId;

  return ifDocumentTypeExists(
    req,
    res,
    { id: documentTypeId, organizationId },
    async (documentTypeData) => {
      const documentUsingDocumentType = await prisma.document.findFirst({
        where: { typeId: documentTypeId, organizationId },
      });
      if (documentUsingDocumentType?.id) {
        const responseBody: TResponseBody<undefined, TDeleteDocumentTypeResponseErrorCode> = {
          data: undefined,
          error: {
            code: 'DOCUMENT_TYPE_IN_USE',
            message: req.t('DOCUMENT_TYPE_IN_USE', { ns: 'error-codes' }),
          },
        };

        return res.status(STATUS_CODES.FORBIDDEN).json(responseBody);
      }

      await Promise.all([
        removeDocumentTypeFromProjects({
          sessionUser,
          organizationId,
          documentTypeId,
        }),
        prisma.documentType.delete({
          where: { id: documentTypeData.id },
        }),
        await createDocumentTypeChangeLog({ ...documentTypeData, archivedBy: sessionUser.id }),
      ]);

      const responseBody: TResponseBody<undefined, TDeleteDocumentTypeResponseErrorCode> = {
        data: undefined,
      };

      return res.json(responseBody);
    }
  );
};

export { DELETE };
