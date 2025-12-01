import { prisma } from '@/prisma';
import { TLanguage } from '@/types/language';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TGetUserResponseData } from './interfaces';

const GET = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  const sessionUser = context.sessionUser;

  const rolesData = await prisma.role.findMany({
    where: {
      id: {
        in: Array.from(
          new Set([
            ...sessionUser.rbacGlobalRoleIds,
            ...(sessionUser.rbacOrganizations?.flatMap((organization) => organization.roleIds) ??
              []),
          ])
        ),
      },
    },
  });

  const roles = new Map<string, { id: string; name: string }>();
  rolesData.forEach((role) => {
    roles.set(role.id, { id: role.id, name: role.name });
  });

  const responseBody: TResponseBody<TGetUserResponseData> = {
    data: {
      id: sessionUser.id,
      email: sessionUser.email,
      name: sessionUser.name ?? undefined,
      category: sessionUser.category,
      preferences: {
        language: sessionUser.preferences?.language as TLanguage | undefined,
        themeMode: sessionUser.preferences?.themeMode as 'light' | 'dark' | undefined,
      },
      rbac: {
        organizationRoles: sessionUser.rbacOrganizations?.map((organization) => ({
          organizationId: organization.organizationId,
          roles: organization.roleIds.map((roleId) => ({
            id: roleId,
            name: roles.get(roleId)?.name ?? roleId,
          })),
        })),
        globalRoles: sessionUser.rbacGlobalRoleIds.map((roleId) => ({
          roleId,
          name: roles.get(roleId)?.name ?? roleId,
        })),
      },
    },
  };

  return res.json(responseBody);
};

export { GET };
