import { TLanguage } from '@/types/language';
import { TPublicRequestContext } from '@/types/request';
import { Request, Response } from 'express';
import { routeHandler } from './route-handler';

const publicRouteHandler = (
  fn: (req: Request, res: Response, context: TPublicRequestContext) => Promise<Response>
) => {
  return routeHandler(async (req: Request, res: Response) => {
    const sessionUser = req.sessionUser;

    return fn(req, res, { language: req.language as TLanguage, sessionUser });
  });
};

export { publicRouteHandler };
