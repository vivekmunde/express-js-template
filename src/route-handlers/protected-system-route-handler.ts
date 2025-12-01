import { STATUS_CODES } from '@/constants/status-codes';
import { isSystemActorAuthorized } from '@/services/rbac/system/is-actor-authorized';
import { TLanguage } from '@/types/language';
import { TPermission } from '@/types/rbac';
import { TProtectedRequestContext } from '@/types/request';
import { Request, Response } from 'express';
import { routeHandler } from './route-handler';

const protectedSystemRouteHandler = (
  fn: (req: Request, res: Response, context: TProtectedRequestContext) => Promise<Response>,
  permissions: TPermission[]
) => {
  return routeHandler(async (req: Request, res: Response) => {
    const sessionUser = req.sessionUser;

    if (!sessionUser?.id) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({});
    }

    const isAuthorized = await isSystemActorAuthorized(sessionUser.id, permissions);

    if (!isAuthorized) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({});
    }

    return fn(req, res, { language: req.language as TLanguage, sessionUser });
  });
};

export { protectedSystemRouteHandler };
