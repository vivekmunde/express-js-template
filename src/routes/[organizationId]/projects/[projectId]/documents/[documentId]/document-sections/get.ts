import { prisma } from '@/prisma';
import { ifValidListSearchParams } from '@/request/if-valid-list-search-params';
import { TResponseBody } from '@/types/response-body';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { TGetDocumentSectionsResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  return ifValidListSearchParams<'title' | 'createdAt' | 'updatedAt'>(
    req,
    res,
    ['title', 'createdAt', 'updatedAt'],
    async (args) => {
      const sortBy = args.sortBy ?? 'title';
      const organizationId = req.params.organizationId;
      const documentId = req.params.documentId;
      const projectId = req.params.projectId;

      const whereClause: Prisma.DocumentSectionWhereInput = {
        organizationId,
        documentId,
        projectId,
        ...(args.search && {
          title: { contains: args.search, mode: 'insensitive' },
        }),
      };

      const [documentSectionsData, totalDocumentSections] = await Promise.all([
        prisma.documentSection.findMany({
          where: whereClause,
          skip: (args.page - 1) * args.size,
          orderBy: { [sortBy]: args.sortOrder },
          take: args.size,
        }),
        prisma.documentSection.count({ where: whereClause }),
      ]);

      const documentSections = documentSectionsData.map((documentSection) => ({
        id: documentSection.id,
        title: documentSection.title,
        description: documentSection.description ?? undefined,
      }));

      const responseBody: TResponseBody<TGetDocumentSectionsResponseData> = {
        data: {
          items: documentSections,
          ...args,
          sortBy,
          total: totalDocumentSections,
        },
      };

      return res.json(responseBody);
    }
  );
};

export { GET };
