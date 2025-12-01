import { prisma } from '@/prisma';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createDocumentTypeChangeLog } from '@/services/change-log/document-type';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TPostDocumentTypeResponseData } from './interfaces';
import { getCreateDocumentTypeValidationSchema } from './validation-schema';

const POST = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(
    req,
    res,
    getCreateDocumentTypeValidationSchema(req),
    async (data) => {
      const organizationId = req.params.organizationId;

      const createdDocumentTypeData = await prisma.documentType.create({
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

      await createDocumentTypeChangeLog(createdDocumentTypeData);

      const responseBody: TResponseBody<TPostDocumentTypeResponseData> = {
        data: {
          id: createdDocumentTypeData.id,
          name: createdDocumentTypeData.name,
          description: createdDocumentTypeData.description ?? undefined,
          color: createdDocumentTypeData.color ?? undefined,
        },
      };

      return res.json(responseBody);
    }
  );
};

export { POST };
