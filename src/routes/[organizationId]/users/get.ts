import { prisma } from '@/prisma';
import { ifValidListSearchParams } from '@/request/if-valid-list-search-params';
import { TResponseBody } from '@/types/response-body';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { TGetUsersResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  return ifValidListSearchParams<'name' | 'email'>(req, res, ['name', 'email'], async (args) => {
    const sortBy = args.sortBy ?? 'name';

    const whereClause: Prisma.UserWhereInput = {
      category: 'ORGANIZATION',
      rbacOrganizations: { some: { organizationId: req.params.organizationId } },
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

    const roleIds = [
      ...new Set(
        usersData.flatMap((user) => user.rbacOrganizations?.flatMap((rbac) => rbac.roleIds) || [])
      ),
    ];

    const rolesData = roleIds.length
      ? await prisma.role.findMany({
          where: { id: { in: roleIds } },
        })
      : [];

    const usersWithRoles = usersData.map((user) => ({
      id: user.id,
      name: user.name ?? undefined,
      email: user.email,
      category: user.category,
      roles: user.rbacOrganizations
        ?.find((it) => it.organizationId === req.params.organizationId)
        ?.roleIds.reduce<{ id: string; name: string }[]>((acc, roleId) => {
          const role = rolesData.find((role) => role.id === roleId);
          if (role) {
            acc.push({ id: role.id, name: role.name });
          }
          return acc;
        }, []),
    }));

    const responseBody: TResponseBody<TGetUsersResponseData> = {
      data: {
        items: usersWithRoles,
        ...args,
        sortBy,
        total: totalUsers,
      },
    };

    return res.json(responseBody);
  });
};

export { GET };
