import { prisma } from '@/prisma';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { TPublicRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TPostUIErrorResponseData } from './interfaces';
import { getCreateErrorValidationSchema } from './validation-schema';

const POST = async (req: Request, res: Response, context: TPublicRequestContext) => {
  return ifValidRequestValues(req, res, getCreateErrorValidationSchema(req), async (data) => {
    const createdErrorData = await prisma.uiErrorLog.create({
      data: {
        errorMessage: data.error.message,
        errorName: data.error.name,
        errorStack: data.error.stack,
        errorComponentStack: data.error.componentStack,
        errorDigest: data.error.digest,
        userId: context.sessionUser?.id,
        url: data.url,
        createdBy: context.sessionUser?.id,
      },
    });

    const responseBody: TResponseBody<TPostUIErrorResponseData> = {
      data: {
        id: createdErrorData.id,
      },
    };

    return res.json(responseBody);
  });
};

export { POST };
