import { prisma } from '@/prisma';
import { ifDocumentTypeExists } from '@/request/if-exists';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createDocumentTypeChangeLog } from '@/services/change-log/document-type';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Request, Response } from 'express';
import { TPutDocumentTypeResponseData } from './interfaces';
import { getUpdateDocumentTypeValidationSchema } from './validation-schema';

const PUT = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(
    req,
    res,
    getUpdateDocumentTypeValidationSchema(req),
    async (data) => {
      const organizationId = req.params.organizationId;
      const documentTypeId = req.params.documentTypeId;

      return ifDocumentTypeExists(req, res, { id: documentTypeId, organizationId }, async () => {
        const updatedDocumentTypeData = await prisma.documentType.update({
          where: { id: documentTypeId },
          data: {
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
            ...getUpdatedXFields(context.sessionUser),
          },
        });

        await createDocumentTypeChangeLog(updatedDocumentTypeData);

        const responseBody: TResponseBody<TPutDocumentTypeResponseData> = {
          data: {
            id: updatedDocumentTypeData.id,
            name: updatedDocumentTypeData.name,
            description: updatedDocumentTypeData.description ?? undefined,
            color: updatedDocumentTypeData.color ?? undefined,
          },
        };

        return res.json(responseBody);
      });
    }
  );
};

export { PUT };
