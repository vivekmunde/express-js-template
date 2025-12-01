import { getUserOrganizations } from '@/services/rbac/get-user-organizations';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TGetOrganizationsResponseData } from './interfaces';

const GET = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  const sessionUser = context.sessionUser;

  const organizationsData = await getUserOrganizations(sessionUser.id);

  const organizations = organizationsData.map((it) => ({
    id: it.id,
    name: it.name,
    code: it.code,
  }));

  const responseBody: TResponseBody<TGetOrganizationsResponseData> = {
    data: {
      items: organizations,
      page: 0,
      size: organizations.length,
      total: organizations.length,
    },
  };

  return res.json(responseBody);
};

export { GET };
