import { prisma } from '@/prisma';
import { ifValidListSearchParams } from '@/request/if-valid-list-search-params';
import { TPermission } from '@/types/rbac';
import { TResponseBody } from '@/types/response-body';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { TGetOrganization, TGetOrganizationsResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  return ifValidListSearchParams<'name' | 'code' | 'email'>(
    req,
    res,
    ['name', 'code', 'email'],
    async (args) => {
      const sortBy = args.sortBy ?? 'name';

      const whereClause: Prisma.OrganizationWhereInput = {
        ...(args.search && {
          OR: [
            { name: { contains: args.search, mode: 'insensitive' } },
            { code: { contains: args.search, mode: 'insensitive' } },
            { email: { contains: args.search, mode: 'insensitive' } },
          ],
        }),
      };

      const [organizationsData, organizationsTotal] = await Promise.all([
        prisma.organization.findMany({
          where: whereClause,
          orderBy: { [sortBy]: args.sortOrder },
          skip: (args.page - 1) * args.size,
          take: args.size,
        }),
        prisma.organization.count({
          where: whereClause,
        }),
      ]);

      const organizations = organizationsData.map((it) => {
        const organizationDetails: TGetOrganization = {
          id: it.id,
          name: it.name,
          code: it.code,
          email: it.email ?? undefined,
          permissionKeys: it.permissionKeys as TPermission[],
          theme: {
            light: {
              colors: {
                primary: it.theme?.light?.colors?.primary ?? undefined,
                primaryForeground: it.theme?.light?.colors?.primaryForeground ?? undefined,
                link: it.theme?.light?.colors?.link ?? undefined,
              },
            },
            dark: {
              colors: {
                primary: it.theme?.dark?.colors?.primary ?? undefined,
                primaryForeground: it.theme?.dark?.colors?.primaryForeground ?? undefined,
                link: it.theme?.dark?.colors?.link ?? undefined,
              },
            },
          },
        };
        return organizationDetails;
      });

      const responseBody: TResponseBody<TGetOrganizationsResponseData> = {
        data: {
          items: organizations,
          ...args,
          sortBy,
          total: organizationsTotal,
        },
      };

      return res.json(responseBody);
    }
  );
};

export { GET };
