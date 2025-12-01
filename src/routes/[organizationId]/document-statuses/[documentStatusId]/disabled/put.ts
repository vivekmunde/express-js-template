import { prisma } from '@/prisma';
import { ifDocumentStatusExists } from '@/request/if-exists';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createDocumentStatusChangeLog } from '@/services/change-log/document-status';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Request, Response } from 'express';
import { TPutDocumentStatusDisabledResponseData } from './interfaces';
import { getUpdateDocumentStatusDisabledValidationSchema } from './validation-schema';

const PUT = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(
    req,
    res,
    getUpdateDocumentStatusDisabledValidationSchema(req),
    async (data) => {
      const organizationId = req.params.organizationId;
      const documentStatusId = req.params.documentStatusId;

      return ifDocumentStatusExists(
        req,
        res,
        { id: documentStatusId, organizationId },
        async () => {
          const updatedDocumentStatusData = await prisma.documentStatus.update({
            where: { id: documentStatusId },
            data: {
              disabled: data.disabled,
              ...getUpdatedXFields(context.sessionUser),
            },
          });

          await createDocumentStatusChangeLog(updatedDocumentStatusData);

          const responseBody: TResponseBody<TPutDocumentStatusDisabledResponseData> = {
            data: {
              id: updatedDocumentStatusData.id,
              disabled: updatedDocumentStatusData.disabled,
            },
          };

          return res.json(responseBody);
        }
      );
    }
  );
};

export { PUT };
