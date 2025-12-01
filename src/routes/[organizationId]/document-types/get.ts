import { prisma } from '@/prisma';
import { ifValidListSearchParams } from '@/request/if-valid-list-search-params';
import { TResponseBody } from '@/types/response-body';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { TGetDocumentTypesResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  const organizationId = req.params.organizationId;

  return ifValidListSearchParams<'name' | 'createdAt' | 'updatedAt'>(
    req,
    res,
    ['name', 'createdAt', 'updatedAt'],
    async (args) => {
      const sortBy = args.sortBy ?? 'name';

      const whereClause: Prisma.DocumentTypeWhereInput = {
        organizationId,
        ...(args.search && {
          name: { contains: args.search, mode: 'insensitive' },
        }),
      };

      const [documentTypesData, totalDocumentTypes] = await Promise.all([
        prisma.documentType.findMany({
          where: whereClause,
          skip: (args.page - 1) * args.size,
          orderBy: { [sortBy]: args.sortOrder },
          take: args.size,
        }),
        prisma.documentType.count({ where: whereClause }),
      ]);

      const documentTypes = documentTypesData.map((documentType) => ({
        id: documentType.id,
        name: documentType.name,
        description: documentType.description ?? undefined,
        disabled: documentType.disabled ?? false,
        color: documentType.color ?? undefined,
      }));

      const responseBody: TResponseBody<TGetDocumentTypesResponseData> = {
        data: {
          items: documentTypes,
          ...args,
          sortBy,
          total: totalDocumentTypes,
        },
      };

      return res.json(responseBody);
    }
  );
};

export { GET };
