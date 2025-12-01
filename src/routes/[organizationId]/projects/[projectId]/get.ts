import { prisma } from '@/prisma';
import { ifProjectExists } from '@/request/if-exists';
import { TResponseBody } from '@/types/response-body';
import { DocumentStatus, DocumentType } from '@prisma/client';
import { Request, Response } from 'express';
import { TGetProjectResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  const organizationId = req.params.organizationId;
  const projectId = req.params.projectId;

  return ifProjectExists(req, res, { id: projectId, organizationId }, async (projectData) => {
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

    const responseBody: TResponseBody<TGetProjectResponseData> = {
      data: {
        id: projectData.id,
        name: projectData.name ?? undefined,
        description: projectData.description ?? undefined,
        documentNumberPrefix: projectData.documentNumberPrefix,
        documentTypes: projectData.documentTypeIds.reduce<
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
        documentStatuses: projectData.documentStatusIds.reduce<
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

export { GET };
