import {
  destroyUserLoginSession,
  getUserLoginSession,
  isValidUserLoginSession,
} from '@/auth/user-login-session';
import { prisma } from '@/prisma';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { OTP_INTERVAL_IN_SECONDS } from '../constants';
import { TGetSessionResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  if (isValidUserLoginSession(req)) {
    const userLoginSession = getUserLoginSession(req);
    const userLoginData = userLoginSession?.token
      ? await prisma.userLoginSession.findUnique({
          where: {
            id: userLoginSession.token,
          },
        })
      : undefined;

    const responseBody: TResponseBody<TGetSessionResponseData> = {
      data: {
        step: 'verify-otp',
        otpSentAt: (userLoginData?.updatedAt ?? userLoginData?.createdAt)?.getTime(),
        otpInterval: OTP_INTERVAL_IN_SECONDS,
      },
    };

    return res.json(responseBody);
  }

  destroyUserLoginSession(res);

  const responseBody: TResponseBody<TGetSessionResponseData> = {
    data: {
      step: 'verify-email',
    },
  };

  return res.json(responseBody);
};

export { GET };
