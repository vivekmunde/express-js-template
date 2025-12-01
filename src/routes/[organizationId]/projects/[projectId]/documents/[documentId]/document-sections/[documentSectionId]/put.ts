import { prisma } from '@/prisma';
import { ifDocumentSectionExists } from '@/request/if-exists';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createDocumentSectionChangeLog } from '@/services/change-log/document-section';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Request, Response } from 'express';
import { TPutDocumentSectionResponseData } from './interfaces';
import { getUpdateDocumentSectionValidationSchema } from './validation-schema';

const PUT = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(
    req,
    res,
    getUpdateDocumentSectionValidationSchema(req),
    async (data) => {
      const organizationId = req.params.organizationId;
      const documentSectionId = req.params.documentSectionId;
      const projectId = req.params.projectId;

      return ifDocumentSectionExists(
        req,
        res,
        { id: documentSectionId, organizationId, projectId },
        async () => {
          const updatedDocumentSectionData = await prisma.documentSection.update({
            where: { id: documentSectionId, projectId },
            data: {
              title: data.title,
              description: data.description,
              ...getUpdatedXFields(context.sessionUser),
            },
          });

          await createDocumentSectionChangeLog(updatedDocumentSectionData);

          const responseBody: TResponseBody<TPutDocumentSectionResponseData> = {
            data: {
              id: updatedDocumentSectionData.id,
              title: updatedDocumentSectionData.title,
              description: updatedDocumentSectionData.description ?? undefined,
            },
          };

          return res.json(responseBody);
        }
      );
    }
  );
};

export { PUT };
