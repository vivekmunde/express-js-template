import { prisma } from '@/prisma';
import { ifValidListSearchParams } from '@/request/if-valid-list-search-params';
import { TResponseBody } from '@/types/response-body';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { TGetApiError, TGetApiErrorsResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  return ifValidListSearchParams<'createdAt'>(req, res, ['createdAt'], async (args) => {
    const sortBy = args.sortBy ?? 'createdAt';

    const whereClause: Prisma.ApiErrorLogWhereInput = {
      ...(args.search && {
        OR: [
          { errorMessage: { contains: args.search, mode: 'insensitive' } },
          { url: { contains: args.search, mode: 'insensitive' } },
          { userId: { contains: args.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [errorsData, errorsTotal] = await Promise.all([
      prisma.apiErrorLog.findMany({
        where: whereClause,
        orderBy: {
          [sortBy]: (args.sortOrder ?? sortBy === 'createdAt') ? 'desc' : 'asc',
        },
        skip: (args.page - 1) * args.size,
        take: args.size,
      }),
      prisma.apiErrorLog.count({
        where: whereClause,
      }),
    ]);

    const errors = errorsData.map((it) => {
      const errorDetails: TGetApiError = {
        id: it.id,
        error: {
          statusCode: it.statusCode ?? undefined,
          message: it.errorMessage ?? undefined,
          stack: it.errorStack ?? undefined,
        },
        url: it.url ?? '',
        request: {
          body: it.requestBody ?? undefined,
          method: it.requestMethod ?? undefined,
          mode: it.requestMode ?? undefined,
          text: it.requestText ?? undefined,
        },
        userId: it.userId ?? '',
        createdAt: it.createdAt,
      };
      return errorDetails;
    });

    const responseBody: TResponseBody<TGetApiErrorsResponseData> = {
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
