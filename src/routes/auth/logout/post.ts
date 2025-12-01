import { destroyUserLoginSession } from '@/auth/user-login-session';
import { destroyUserSession } from '@/auth/user-session';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TPostLogoutResponseData } from './interfaces';

const POST = async (req: Request, res: Response) => {
  destroyUserSession(res);
  destroyUserLoginSession(res);

  const responseBody: TResponseBody<TPostLogoutResponseData> = {
    data: undefined,
  };

  return res.json(responseBody);
};

export { POST };
