import { STATUS_CODES } from '@/constants/status-codes';
import { isActorAuthorized } from '@/services/rbac/organization/is-actor-authorized';
import { TLanguage } from '@/types/language';
import { TPermission } from '@/types/rbac';
import { TProtectedRequestContext } from '@/types/request';
import { Request, Response } from 'express';
import { routeHandler } from './route-handler';

const protectedOrganizationRouteHandler = (
  fn: (req: Request, res: Response, context: TProtectedRequestContext) => Promise<Response>,
  permissions: TPermission[]
) => {
  return routeHandler(async (req: Request, res: Response) => {
    const sessionUser = req.sessionUser;

    if (!sessionUser?.id || !req.params.organizationId) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({});
    }

    const isAuthorized = await isActorAuthorized(
      sessionUser.id,
      req.params.organizationId,
      permissions
    );

    if (!isAuthorized) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({});
    }

    return fn(req, res, { language: req.language as TLanguage, sessionUser });
  });
};

export { protectedOrganizationRouteHandler };
