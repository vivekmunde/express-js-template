import { ifValidListSearchParams } from '@/request/if-valid-list-search-params';
import { filterRoles, paginateRoles, sortRoles } from '@/response/responsify-roles';
import { getUserAccessibleRoles } from '@/services/rbac/organization/get-user-accessible-roles';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import { TGetRole, TGetRolesResponseData } from './interfaces';

const transformRoles = (roles: Role[]): TGetRole[] => {
  return roles.map((role) => {
    const roleToReturn: TGetRole = {
      id: role.id,
      name: role.name,
      description: role.description ?? undefined,
    };
    return roleToReturn;
  });
};

const GET = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidListSearchParams<'name'>(req, res, ['name'], async (args) => {
    const sessionUser = context.sessionUser;
    const accessibleRoles = await getUserAccessibleRoles(sessionUser.id, req.params.organizationId);

    const filteredRoles = filterRoles(accessibleRoles, args);
    const sortedRoles = sortRoles(filteredRoles, args);
    const paginatedRoles = paginateRoles(sortedRoles, args);
    const transformedRoles = transformRoles(paginatedRoles);

    const responseBody: TResponseBody<TGetRolesResponseData> = {
      data: {
        items: transformedRoles,
        ...args,
        total: sortedRoles.length,
      },
    };

    return res.json(responseBody);
  });
};

export { GET };
