import { prisma } from '@/prisma';
import { ifValidListSearchParams } from '@/request/if-valid-list-search-params';
import { TResponseBody } from '@/types/response-body';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { TGetUsersResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  return ifValidListSearchParams<'name'>(req, res, ['name'], async (args) => {
    const sortBy = args.sortBy ?? 'name';

    const whereClause: Prisma.UserWhereInput = {
      rbacOrganizations: { equals: [] },
      rbacGlobalRoleIds: { equals: [] },
      ...(args.search && {
        OR: [
          { name: { contains: args.search, mode: 'insensitive' } },
          { email: { contains: args.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [usersData, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip: (args.page - 1) * args.size,
        orderBy: { [sortBy]: args.sortOrder },
        take: args.size,
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    const users = usersData.map((user) => ({
      id: user.id,
      name: user.name ?? undefined,
      email: user.email,
      category: user.category,
    }));

    const responseBody: TResponseBody<TGetUsersResponseData> = {
      data: {
        items: users,
        ...args,
        sortBy,
        total: totalUsers,
      },
    };

    return res.json(responseBody);
  });
};

export { GET };
