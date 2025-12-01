import { ifDocumentCommentExists } from '@/request/if-exists';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TGetDocumentCommentResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  const organizationId = req.params.organizationId;
  const documentCommentId = req.params.documentCommentId;
  const projectId = req.params.projectId;

  return ifDocumentCommentExists(
    req,
    res,
    { id: documentCommentId, organizationId, projectId },
    async (documentCommentData) => {
      const responseBody: TResponseBody<TGetDocumentCommentResponseData> = {
        data: {
          id: documentCommentData.id,
          parentId: documentCommentData.parentId ?? undefined,
          toUserIds: documentCommentData.toUserIds,
          ccUserIds: documentCommentData.ccUserIds,
          comment: documentCommentData.comment,
        },
      };

      return res.json(responseBody);
    }
  );
};

export { GET };
