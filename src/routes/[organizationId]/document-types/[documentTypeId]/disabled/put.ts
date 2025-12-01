import { prisma } from '@/prisma';
import { ifDocumentTypeExists } from '@/request/if-exists';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createDocumentTypeChangeLog } from '@/services/change-log/document-type';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Request, Response } from 'express';
import { TPutDocumentTypeDisabledResponseData } from './interfaces';
import { getUpdateDocumentTypeDisabledValidationSchema } from './validation-schema';

const PUT = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(
    req,
    res,
    getUpdateDocumentTypeDisabledValidationSchema(req),
    async (data) => {
      const organizationId = req.params.organizationId;
      const documentTypeId = req.params.documentTypeId;

      return ifDocumentTypeExists(req, res, { id: documentTypeId, organizationId }, async () => {
        const updatedDocumentTypeData = await prisma.documentType.update({
          where: { id: documentTypeId },
          data: {
            disabled: data.disabled,
            ...getUpdatedXFields(context.sessionUser),
          },
        });

        await createDocumentTypeChangeLog(updatedDocumentTypeData);

        const responseBody: TResponseBody<TPutDocumentTypeDisabledResponseData> = {
          data: {
            id: updatedDocumentTypeData.id,
            disabled: updatedDocumentTypeData.disabled,
          },
        };

        return res.json(responseBody);
      });
    }
  );
};

export { PUT };
