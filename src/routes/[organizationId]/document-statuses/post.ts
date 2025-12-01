import { prisma } from '@/prisma';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createDocumentStatusChangeLog } from '@/services/change-log/document-status';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TPostDocumentStatusResponseData } from './interfaces';
import { getCreateDocumentStatusValidationSchema } from './validation-schema';

const POST = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(
    req,
    res,
    getCreateDocumentStatusValidationSchema(req),
    async (data) => {
      const organizationId = req.params.organizationId;

      const createdDocumentStatusData = await prisma.documentStatus.create({
        data: {
          organizationId,
          name: data.name,
          description: data.description,
          color:
            data.lightColorBackground &&
            data.lightColorForeground &&
            data.darkColorBackground &&
            data.darkColorForeground
              ? {
                  light: {
                    background: data.lightColorBackground,
                    foreground: data.lightColorForeground,
                  },
                  dark: {
                    background: data.darkColorBackground,
                    foreground: data.darkColorForeground,
                  },
                }
              : undefined,
          createdBy: context.sessionUser.id,
        },
      });

      await createDocumentStatusChangeLog(createdDocumentStatusData);

      const responseBody: TResponseBody<TPostDocumentStatusResponseData> = {
        data: {
          id: createdDocumentStatusData.id,
          name: createdDocumentStatusData.name,
          description: createdDocumentStatusData.description ?? undefined,
          color: createdDocumentStatusData.color ?? undefined,
        },
      };

      return res.json(responseBody);
    }
  );
};

export { POST };
