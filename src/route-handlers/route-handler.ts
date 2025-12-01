import { NextFunction, Request, Response } from 'express';

const routeHandler = (fn: (req: Request, res: Response) => Promise<Response>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res).catch(next);
  };
};

export { routeHandler };
