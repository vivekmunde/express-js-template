import {
  destroyUserLoginSession,
  getUserLoginSession,
  isValidUserLoginSession,
  refreshUserLoginSession,
} from '@/auth/user-login-session';
import { destroyUserSession } from '@/auth/user-session';
import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { createUserLoginSessionChangeLog } from '@/services/change-log/user-login-session';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Request, Response } from 'express';
import { OTP_INTERVAL_IN_SECONDS } from '../constants';
import { getOtp } from '../get-otp';
import { sendOtp } from '../send-otp';
import { TPostResendOtpResponseData, TPostResendOtpResponseErrorCode } from './interfaces';

const POST = async (req: Request, res: Response) => {
  destroyUserSession(res);

  if (!isValidUserLoginSession(req)) {
    destroyUserLoginSession(res);

    const responseBody: TResponseBody<undefined, TPostResendOtpResponseErrorCode> = {
      error: {
        code: 'INVALID_TOKEN',
        message: req.t('INVALID_TOKEN', { ns: 'error-codes' }),
      },
    };

    return res.status(STATUS_CODES.BAD_REQUEST).json(responseBody);
  }

  refreshUserLoginSession(req, res);

  const userLoginSession = getUserLoginSession(req);

  let userLoginData = await prisma.userLoginSession.findUnique({
    where: { id: userLoginSession?.token },
  });

  if (userLoginData?.id) {
    const userData = await prisma.user.findUnique({
      where: { id: userLoginData.userId },
    });

    if (userData?.id) {
      if (
        Date.now() - (userLoginData.updatedAt ?? userLoginData.createdAt).getTime() <
        OTP_INTERVAL_IN_SECONDS * 1000
      ) {
        const responseBody: TResponseBody<undefined, TPostResendOtpResponseErrorCode> = {
          error: {
            code: 'TOO_EARLY_TO_RESEND_OTP',
            message: req.t('TOO_EARLY_TO_RESEND_OTP', { ns: 'error-codes' }),
          },
        };

        return res.status(STATUS_CODES.BAD_REQUEST).json(responseBody);
      }

      userLoginData = await prisma.userLoginSession.update({
        data: {
          otp: getOtp(),
          ...getUpdatedXFields({ id: userLoginData.userId }),
        },
        where: { id: userLoginSession?.token },
      });

      await sendOtp(req, {
        otp: userLoginData.otp,
        toEmail: userData.email,
        toName: userData.name ?? userData.email,
        createdBy: userData.id,
      });

      await createUserLoginSessionChangeLog(userLoginData);

      const responseBody: TResponseBody<TPostResendOtpResponseData> = {
        data: undefined,
      };

      return res.json(responseBody);
    }
  }

  destroyUserLoginSession(res);

  const responseBody: TResponseBody<undefined, TPostResendOtpResponseErrorCode> = {
    error: {
      code: 'INVALID_TOKEN',
      message: req.t('INVALID_TOKEN', { ns: 'error-codes' }),
    },
  };

  return res.status(STATUS_CODES.BAD_REQUEST).json(responseBody);
};

export { POST };
