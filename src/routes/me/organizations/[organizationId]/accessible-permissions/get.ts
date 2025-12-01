import { getUserPermissions } from '@/services/rbac/organization/get-user-permissions';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TGetOrganizationResponseData } from './interfaces';

const GET = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  const sessionUser = context.sessionUser;
  const organizationId = req.params.organizationId;

  const permissions = await getUserPermissions(sessionUser.id, organizationId);

  const responseBody: TResponseBody<TGetOrganizationResponseData> = {
    data: {
      items: permissions,
      page: 0,
      size: permissions.length,
      total: permissions.length,
    },
  };

  return res.json(responseBody);
};

export { GET };
