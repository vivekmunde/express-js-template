import { ifDocumentTypeExists } from '@/request/if-exists';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TGetDocumentTypeResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  const organizationId = req.params.organizationId;
  const documentTypeId = req.params.documentTypeId;

  return ifDocumentTypeExists(
    req,
    res,
    { id: documentTypeId, organizationId },
    async (documentTypeData) => {
      const responseBody: TResponseBody<TGetDocumentTypeResponseData> = {
        data: {
          id: documentTypeData.id,
          name: documentTypeData.name ?? undefined,
          description: documentTypeData.description ?? undefined,
          disabled: documentTypeData.disabled ?? false,
          color: documentTypeData.color ?? undefined,
        },
      };

      return res.json(responseBody);
    }
  );
};

export { GET };
