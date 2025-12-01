import { ifDocumentSectionExists } from '@/request/if-exists';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TGetDocumentSectionResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  const organizationId = req.params.organizationId;
  const documentSectionId = req.params.documentSectionId;
  const projectId = req.params.projectId;

  return ifDocumentSectionExists(
    req,
    res,
    { id: documentSectionId, organizationId, projectId },
    async (documentSectionData) => {
      const responseBody: TResponseBody<TGetDocumentSectionResponseData> = {
        data: {
          id: documentSectionData.id,
          title: documentSectionData.title ?? undefined,
          description: documentSectionData.description ?? undefined,
        },
      };

      return res.json(responseBody);
    }
  );
};

export { GET };
