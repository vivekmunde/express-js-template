import { prisma } from '@/prisma';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createUserChangeLog } from '@/services/change-log/user';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Request, Response } from 'express';
import { TPutNameResponseData } from './interfaces';
import { getUpdateNameValidationSchema } from './validation-schema';

const PUT = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(req, res, getUpdateNameValidationSchema(req), async (data) => {
    const sessionUser = context.sessionUser;

    const updatedMeData = await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        name: data.name,
        ...getUpdatedXFields(sessionUser),
      },
    });

    await createUserChangeLog(updatedMeData);

    const responseBody: TResponseBody<TPutNameResponseData> = {
      data: {
        id: updatedMeData.id,
        name: updatedMeData.name ?? undefined,
      },
    };

    return res.json(responseBody);
  });
};

export { PUT };
