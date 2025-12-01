import { prisma } from '@/prisma';
import { ifValidListSearchParams } from '@/request/if-valid-list-search-params';
import { TResponseBody } from '@/types/response-body';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { TGetDocumentStatusResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  const organizationId = req.params.organizationId;

  return ifValidListSearchParams<'name' | 'createdAt' | 'updatedAt'>(
    req,
    res,
    ['name', 'createdAt', 'updatedAt'],
    async (args) => {
      const sortBy = args.sortBy ?? 'name';

      const whereClause: Prisma.DocumentStatusWhereInput = {
        organizationId,
        ...(args.search && {
          name: { contains: args.search, mode: 'insensitive' },
        }),
      };

      const [documentStatusesData, totalDocumentStatuses] = await Promise.all([
        prisma.documentStatus.findMany({
          where: whereClause,
          skip: (args.page - 1) * args.size,
          orderBy: { [sortBy]: args.sortOrder },
          take: args.size,
        }),
        prisma.documentStatus.count({ where: whereClause }),
      ]);

      const documentStatuses = documentStatusesData.map((documentStatus) => ({
        id: documentStatus.id,
        name: documentStatus.name,
        description: documentStatus.description ?? undefined,
        disabled: documentStatus.disabled ?? false,
        color: documentStatus.color ?? undefined,
      }));

      const responseBody: TResponseBody<TGetDocumentStatusResponseData> = {
        data: {
          items: documentStatuses,
          ...args,
          sortBy,
          total: totalDocumentStatuses,
        },
      };

      return res.json(responseBody);
    }
  );
};

export { GET };
