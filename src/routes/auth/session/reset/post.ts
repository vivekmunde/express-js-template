import {
  destroyUserLoginSession,
  getUserLoginSession,
  isValidUserLoginSession,
} from '@/auth/user-login-session';
import { prisma } from '@/prisma';
import { createUserLoginSessionChangeLog } from '@/services/change-log/user-login-session';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TPostSessionResetResponseData } from './interfaces';

const POST = async (req: Request, res: Response) => {
  if (isValidUserLoginSession(req)) {
    const userLoginSession = getUserLoginSession(req);

    const userLoginData = await prisma.userLoginSession.findUnique({
      where: { id: userLoginSession?.token },
    });

    if (userLoginData?.id) {
      await Promise.all([
        createUserLoginSessionChangeLog({
          ...userLoginData,
          archivedBy: userLoginData.userId,
        }),

        prisma.userLoginSession.delete({
          where: { id: userLoginSession?.token },
        }),
      ]);
    }
  }

  destroyUserLoginSession(res);

  const responseBody: TResponseBody<TPostSessionResetResponseData> = {
    data: undefined,
  };

  return res.json(responseBody);
};

export { POST };
