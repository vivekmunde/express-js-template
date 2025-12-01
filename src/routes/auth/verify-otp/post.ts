import {
  destroyUserLoginSession,
  getUserLoginSession,
  isValidUserLoginSession,
  refreshUserLoginSession,
} from '@/auth/user-login-session';
import { destroyUserSession, updateUserSession } from '@/auth/user-session';
import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createUserLoginSessionChangeLog } from '@/services/change-log/user-login-session';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import {
  TPostVerifyOtpRequestData,
  TPostVerifyOtpResponseData,
  TPostVerifyOtpResponseErrorCode,
} from './interfaces';
import { getVerifyOtpValidationSchema } from './validation-schema';

const POST = async (req: Request, res: Response) => {
  destroyUserSession(res);

  return ifValidRequestValues(
    req,
    res,
    getVerifyOtpValidationSchema(req),
    async ({ otp }: TPostVerifyOtpRequestData) => {
      if (!isValidUserLoginSession(req)) {
        destroyUserLoginSession(res);

        const responseBody: TResponseBody<undefined, TPostVerifyOtpResponseErrorCode> = {
          error: {
            code: 'INVALID_TOKEN',
            message: req.t('INVALID_TOKEN', { ns: 'error-codes' }),
          },
        };

        return res.status(STATUS_CODES.BAD_REQUEST).json(responseBody);
      }

      refreshUserLoginSession(req, res);

      const userLoginSession = getUserLoginSession(req);

      const [userLoginData, userLoginAttempts] = await Promise.all([
        await prisma.userLoginSession.findUnique({
          where: { id: userLoginSession?.token },
        }),
        await prisma.userLoginAttempts.findMany({
          where: {
            sessionId: userLoginSession?.token,
          },
        }),
      ]);

      if (userLoginData?.id) {
        if (userLoginAttempts.length >= 5) {
          await Promise.all([
            createUserLoginSessionChangeLog({
              ...userLoginData,
              archivedBy: userLoginData.userId,
            }),

            prisma.userLoginSession.delete({
              where: { id: userLoginSession?.token },
            }),
          ]);

          const responseBody: TResponseBody<undefined, TPostVerifyOtpResponseErrorCode> = {
            error: {
              code: 'INVALID_TOKEN',
              message: req.t('INVALID_TOKEN', { ns: 'error-codes' }),
            },
          };

          return res.status(STATUS_CODES.BAD_REQUEST).json(responseBody);
        }

        if (userLoginData.otp === otp) {
          await Promise.all([
            createUserLoginSessionChangeLog({
              ...userLoginData,
              archivedBy: userLoginData.userId,
            }),

            prisma.userLoginSession.delete({
              where: { id: userLoginSession?.token },
            }),
          ]);

          const responseBody: TResponseBody<TPostVerifyOtpResponseData> = {
            data: undefined,
          };

          destroyUserLoginSession(res);
          updateUserSession(res, userLoginData.userId);

          return res.json(responseBody);
        }

        const responseBody: TResponseBody<undefined, TPostVerifyOtpResponseErrorCode> = {
          error: {
            code: 'INVALID_OTP',
            message: req.t('INVALID_OTP', { ns: 'error-codes' }),
          },
        };

        return res.status(STATUS_CODES.BAD_REQUEST).json(responseBody);
      }

      destroyUserLoginSession(res);

      const responseBody: TResponseBody<undefined, TPostVerifyOtpResponseErrorCode> = {
        error: {
          code: 'INVALID_TOKEN',
          message: req.t('INVALID_TOKEN', { ns: 'error-codes' }),
        },
      };

      return res.status(STATUS_CODES.BAD_REQUEST).json(responseBody);
    }
  );
};

export { POST };
