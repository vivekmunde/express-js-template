import { getSystemUserPermissions } from '@/services/rbac/system/get-user-permissions';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import {
  TGetSystemAccessiblePermissionsResponseData,
  TGetSystemAccessiblePermissionsResponseErrorCode,
} from './interfaces';

const GET = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  const permissions = await getSystemUserPermissions(context.sessionUser.id);

  const responseBody: TResponseBody<
    TGetSystemAccessiblePermissionsResponseData,
    TGetSystemAccessiblePermissionsResponseErrorCode
  > = {
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
