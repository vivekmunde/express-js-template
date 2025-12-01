import { ifDocumentStatusExists } from '@/request/if-exists';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TGetDocumentStatusResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  const organizationId = req.params.organizationId;
  const documentStatusId = req.params.documentStatusId;

  return ifDocumentStatusExists(
    req,
    res,
    { id: documentStatusId, organizationId },
    async (documentStatusData) => {
      const responseBody: TResponseBody<TGetDocumentStatusResponseData> = {
        data: {
          id: documentStatusData.id,
          name: documentStatusData.name ?? undefined,
          description: documentStatusData.description ?? undefined,
          disabled: documentStatusData.disabled ?? false,
          color: documentStatusData.color ?? undefined,
        },
      };

      return res.json(responseBody);
    }
  );
};

export { GET };
