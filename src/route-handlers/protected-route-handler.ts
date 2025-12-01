import { STATUS_CODES } from '@/constants/status-codes';
import { TLanguage } from '@/types/language';
import { TProtectedRequestContext } from '@/types/request';
import { Request, Response } from 'express';
import { routeHandler } from './route-handler';

const protectedRouteHandler = (
  fn: (req: Request, res: Response, context: TProtectedRequestContext) => Promise<Response>
) => {
  return routeHandler(async (req: Request, res: Response) => {
    const sessionUser = req.sessionUser;

    if (!sessionUser?.id) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({});
    }

    return fn(req, res, { language: req.language as TLanguage, sessionUser });
  });
};

export { protectedRouteHandler };
