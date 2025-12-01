import { prisma } from '@/prisma';
import { ifValidListSearchParams } from '@/request/if-valid-list-search-params';
import { TResponseBody } from '@/types/response-body';
import { DocumentStatus, DocumentType, Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { TGetProjectsResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  return ifValidListSearchParams<'name' | 'createdAt' | 'updatedAt'>(
    req,
    res,
    ['name', 'createdAt', 'updatedAt'],
    async (args) => {
      const sortBy = args.sortBy ?? 'name';
      const organizationId = req.params.organizationId;

      const whereClause: Prisma.ProjectWhereInput = {
        organizationId,
        ...(args.search && {
          OR: [
            { name: { contains: args.search, mode: 'insensitive' } },
            { documentNumberPrefix: { contains: args.search, mode: 'insensitive' } },
          ],
        }),
      };

      const [projectsData, totalProjects, documentTypesData, documentStatusesData] =
        await Promise.all([
          prisma.project.findMany({
            where: whereClause,
            skip: (args.page - 1) * args.size,
            orderBy: { [sortBy]: args.sortOrder },
            take: args.size,
          }),
          prisma.project.count({ where: whereClause }),
          prisma.documentType.findMany({
            where: {
              organizationId,
            },
          }),
          prisma.documentStatus.findMany({
            where: {
              organizationId,
            },
          }),
        ]);

      const documentTypesMap = new Map<string, DocumentType>();
      documentTypesData.forEach((documentType) => {
        if (!documentType.disabled) {
          documentTypesMap.set(documentType.id, documentType);
        }
      });

      const documentStatusesMap = new Map<string, DocumentStatus>();
      documentStatusesData.forEach((documentStatus) => {
        if (!documentStatus.disabled) {
          documentStatusesMap.set(documentStatus.id, documentStatus);
        }
      });

      const projects = projectsData.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description ?? undefined,
        documentNumberPrefix: project.documentNumberPrefix,
        documentTypes: project.documentTypeIds.reduce<
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
        documentStatuses: project.documentStatusIds.reduce<
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
      }));

      const responseBody: TResponseBody<TGetProjectsResponseData> = {
        data: {
          items: projects,
          ...args,
          sortBy,
          total: totalProjects,
        },
      };

      return res.json(responseBody);
    }
  );
};

export { GET };
