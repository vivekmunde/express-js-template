import { prisma } from '@/prisma';
import { ifProjectExists } from '@/request/if-exists';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createProjectChangeLog } from '@/services/change-log/project';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { DocumentStatus, DocumentType } from '@prisma/client';
import { Request, Response } from 'express';
import { TPutProjectResponseData } from './interfaces';
import { getUpdateProjectValidationSchema } from './validation-schema';

const PUT = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(req, res, getUpdateProjectValidationSchema(req), async (data) => {
    const organizationId = req.params.organizationId;
    const projectId = req.params.projectId;

    return ifProjectExists(req, res, { id: projectId, organizationId }, async () => {
      const [documentTypesData, documentStatusesData] = await Promise.all([
        prisma.documentType.findMany({ where: { organizationId } }),
        prisma.documentStatus.findMany({ where: { organizationId } }),
      ]);

      const documentTypesMap = new Map<string, DocumentType>();
      documentTypesData.forEach((documentType) => {
        documentTypesMap.set(documentType.id, documentType);
      });

      const documentStatusesMap = new Map<string, DocumentStatus>();
      documentStatusesData.forEach((documentStatus) => {
        documentStatusesMap.set(documentStatus.id, documentStatus);
      });

      const updatedProjectData = await prisma.project.update({
        where: { id: projectId },
        data: {
          name: data.name,
          description: data.description,
          documentNumberPrefix: data.documentNumberPrefix.toUpperCase(),
          documentTypeIds: data.documentTypeIds,
          documentStatusIds: data.documentStatusIds,
          ...getUpdatedXFields(context.sessionUser),
        },
      });

      await createProjectChangeLog(updatedProjectData);

      const responseBody: TResponseBody<TPutProjectResponseData> = {
        data: {
          id: updatedProjectData.id,
          name: updatedProjectData.name,
          description: updatedProjectData.description ?? undefined,
          documentNumberPrefix: updatedProjectData.documentNumberPrefix,
          documentTypes: updatedProjectData.documentTypeIds.reduce<
            {
              id: string;
              name: string;
              description?: string;
              color?: {
                light: { background: string; foreground: string };
                dark: { background: string; foreground: string };
              };
            }[]
          >((acc, documentTypeId) => {
            const documentType = documentTypesMap.get(documentTypeId);

            if (documentType) {
              acc.push({
                id: documentTypeId,
                name: documentType.name,
                description: documentType.description ?? undefined,
                color: documentType.color ?? undefined,
              });
            }

            return acc;
          }, []),
          documentStatuses: updatedProjectData.documentStatusIds.reduce<
            {
              id: string;
              name: string;
              description?: string;
              color?: {
                light: { background: string; foreground: string };
                dark: { background: string; foreground: string };
              };
            }[]
          >((acc, documentStatusId) => {
            const documentStatus = documentStatusesMap.get(documentStatusId);

            if (documentStatus) {
              acc.push({
                id: documentStatusId,
                name: documentStatus.name,
                description: documentStatus.description ?? undefined,
                color: documentStatus.color ?? undefined,
              });
            }

            return acc;
          }, []),
        },
      };

      return res.json(responseBody);
    });
  });
};

export { PUT };
