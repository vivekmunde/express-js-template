import { destroyUserLoginSession, updateUserLoginSession } from '@/auth/user-login-session';
import { destroyUserSession } from '@/auth/user-session';
import { STATUS_CODES } from '@/constants/status-codes';
import { IS_DEVELOPMENT } from '@/env';
import { prisma } from '@/prisma';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createUserLoginSessionChangeLog } from '@/services/change-log/user-login-session';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { getOtp } from '../get-otp';
import { sendOtp } from '../send-otp';
import {
  TPostVerifyEmailRequestData,
  TPostVerifyEmailResponseData,
  TPostVerifyEmailResponseErrorCode,
} from './interfaces';
import { getVerifyEmailValidationSchema } from './validation-schema';

const POST = async (req: Request, res: Response) => {
  destroyUserLoginSession(res);
  destroyUserSession(res);

  return ifValidRequestValues(
    req,
    res,
    getVerifyEmailValidationSchema(req),
    async ({ email }: TPostVerifyEmailRequestData) => {
      const userData = await prisma.user.findUnique({
        where: { email },
      });

      if (userData?.id) {
        const userLoginData = await prisma.userLoginSession.create({
          data: {
            userId: userData.id,
            otp: getOtp(),
            createdBy: userData.id,
          },
        });

        if (IS_DEVELOPMENT) {
          await sendOtp(req, {
            otp: userLoginData.otp,
            toEmail: userData.email,
            toName: userData.name ?? userData.email,
            createdBy: userData.id,
          });
        }

        await createUserLoginSessionChangeLog(userLoginData);

        updateUserLoginSession(res, userLoginData.id);

        const responseBody: TResponseBody<TPostVerifyEmailResponseData> = {};

        return res.json(responseBody);
      }

      const responseBody: TResponseBody<undefined, TPostVerifyEmailResponseErrorCode> = {
        error: {
          code: 'USER_DOES_NOT_EXIST',
          message: req.t('USER_DOES_NOT_EXIST', { ns: 'error-codes', email }),
        },
      };

      return res.status(STATUS_CODES.NOT_FOUND).json(responseBody);
    }
  );
};

export { POST };
