import { prisma } from '@/prisma';
import { ifValidListSearchParams } from '@/request/if-valid-list-search-params';
import { TResponseBody } from '@/types/response-body';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { TGetDocumentCommentsResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  return ifValidListSearchParams<'createdAt'>(req, res, ['createdAt'], async (args) => {
    const sortBy = args.sortBy ?? 'createdAt';
    const organizationId = req.params.organizationId;
    const documentId = req.params.documentId;
    const projectId = req.params.projectId;

    const whereClause: Prisma.DocumentCommentWhereInput = {
      organizationId,
      documentId,
      projectId,
      ...(args.search && {
        comment: { contains: args.search, mode: 'insensitive' },
      }),
    };

    const [documentCommentsData, totalDocumentComments] = await Promise.all([
      prisma.documentComment.findMany({
        where: whereClause,
        skip: (args.page - 1) * args.size,
        orderBy: { [sortBy]: args.sortOrder },
        take: args.size,
      }),
      prisma.documentComment.count({ where: whereClause }),
    ]);

    const documentComments = documentCommentsData.map((documentComment) => ({
      id: documentComment.id,
      parentId: documentComment.parentId ?? undefined,
      toUserIds: documentComment.toUserIds,
      ccUserIds: documentComment.ccUserIds,
      comment: documentComment.comment,
      createdAt: documentComment.createdAt,
    }));

    const responseBody: TResponseBody<TGetDocumentCommentsResponseData> = {
      data: {
        items: documentComments,
        ...args,
        sortBy,
        total: totalDocumentComments,
      },
    };

    return res.json(responseBody);
  });
};

export { GET };
