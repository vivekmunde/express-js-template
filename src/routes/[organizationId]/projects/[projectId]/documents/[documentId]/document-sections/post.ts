import { prisma } from '@/prisma';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createDocumentSectionChangeLog } from '@/services/change-log/document-section';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TPostDocumentSectionResponseData } from './interfaces';
import { getCreateDocumentSectionValidationSchema } from './validation-schema';

const POST = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(
    req,
    res,
    getCreateDocumentSectionValidationSchema(req),
    async (data) => {
      const organizationId = req.params.organizationId;
      const documentId = req.params.documentId;
      const projectId = req.params.projectId;

      const createdDocumentSectionData = await prisma.documentSection.create({
        data: {
          documentId,
          organizationId,
          projectId,
          title: data.title,
          description: data.description,
          createdBy: context.sessionUser.id,
        },
      });

      await createDocumentSectionChangeLog(createdDocumentSectionData);

      const responseBody: TResponseBody<TPostDocumentSectionResponseData> = {
        data: {
          id: createdDocumentSectionData.id,
          title: createdDocumentSectionData.title,
          description: createdDocumentSectionData.description ?? undefined,
        },
      };

      return res.json(responseBody);
    }
  );
};

export { POST };
