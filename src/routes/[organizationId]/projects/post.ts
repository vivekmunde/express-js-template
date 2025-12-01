import { prisma } from '@/prisma';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createProjectChangeLog } from '@/services/change-log/project';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { DocumentStatus, DocumentType } from '@prisma/client';
import { Request, Response } from 'express';
import { TPostProjectResponseData } from './interfaces';
import { getCreateProjectValidationSchema } from './validation-schema';

const POST = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(req, res, getCreateProjectValidationSchema(req), async (data) => {
    const organizationId = req.params.organizationId;

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

    const createdProjectData = await prisma.project.create({
      data: {
        organizationId,
        name: data.name,
        description: data.description,
        documentNumberPrefix: data.documentNumberPrefix.toUpperCase(),
        documentTypeIds: data.documentTypeIds,
        documentStatusIds: data.documentStatusIds,
        createdBy: context.sessionUser.id,
      },
    });

    await createProjectChangeLog(createdProjectData);

    const responseBody: TResponseBody<TPostProjectResponseData> = {
      data: {
        id: createdProjectData.id,
        name: createdProjectData.name,
        description: createdProjectData.description ?? undefined,
        documentNumberPrefix: createdProjectData.documentNumberPrefix,
        documentTypes: createdProjectData.documentTypeIds.reduce<
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
        documentStatuses: createdProjectData.documentStatusIds.reduce<
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
};

export { POST };
