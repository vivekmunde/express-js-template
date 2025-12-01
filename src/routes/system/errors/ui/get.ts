import { prisma } from '@/prisma';
import { ifValidListSearchParams } from '@/request/if-valid-list-search-params';
import { TResponseBody } from '@/types/response-body';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { TGetUIError, TGetUIErrorsResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  return ifValidListSearchParams<'createdAt'>(req, res, ['createdAt'], async (args) => {
    const sortBy = args.sortBy ?? 'createdAt';

    const whereClause: Prisma.UiErrorLogWhereInput = {
      ...(args.search && {
        OR: [
          { errorMessage: { contains: args.search, mode: 'insensitive' } },
          { url: { contains: args.search, mode: 'insensitive' } },
          { userId: { contains: args.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [errorsData, errorsTotal] = await Promise.all([
      prisma.uiErrorLog.findMany({
        where: whereClause,
        orderBy: {
          [sortBy]: (args.sortOrder ?? sortBy === 'createdAt') ? 'desc' : 'asc',
        },
        skip: (args.page - 1) * args.size,
        take: args.size,
      }),
      prisma.uiErrorLog.count({
        where: whereClause,
      }),
    ]);

    const errors = errorsData.map((it) => {
      const errorDetails: TGetUIError = {
        id: it.id,
        error: {
          name: it.errorName ?? undefined,
          message: it.errorMessage ?? undefined,
          stack: it.errorStack ?? undefined,
          componentStack: it.errorComponentStack ?? undefined,
          digest: it.errorDigest ?? undefined,
        },
        url: it.url ?? '',
        userId: it.userId ?? '',
        createdAt: it.createdAt,
      };
      return errorDetails;
    });

    const responseBody: TResponseBody<TGetUIErrorsResponseData> = {
      data: {
        items: errors,
        ...args,
        sortBy,
        total: errorsTotal,
      },
    };

    return res.json(responseBody);
  });
};

export { GET };
