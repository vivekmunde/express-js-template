import { prisma } from '@/prisma';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createUserChangeLog } from '@/services/change-log/user';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Request, Response } from 'express';
import { TPutThemeModePreferenceResponseData } from './interfaces';
import { getUpdateThemeModePreferenceValidationSchema } from './validation-schema';

const PUT = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(
    req,
    res,
    getUpdateThemeModePreferenceValidationSchema(req),
    async (data) => {
      const sessionUser = context.sessionUser;

      const updatedMeData = await prisma.user.update({
        where: { id: sessionUser.id },
        data: {
          preferences: {
            ...sessionUser.preferences,
            themeMode: data.themeMode,
          },
          ...getUpdatedXFields(sessionUser),
        },
      });

      await createUserChangeLog(updatedMeData);

      const responseBody: TResponseBody<TPutThemeModePreferenceResponseData> = {
        data: { themeMode: updatedMeData.preferences?.themeMode ?? undefined },
      };

      return res.json(responseBody);
    }
  );
};

export { PUT };
