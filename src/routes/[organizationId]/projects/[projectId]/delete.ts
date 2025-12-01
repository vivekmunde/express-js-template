import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { ifProjectExists } from '@/request/if-exists';
import { createProjectChangeLog } from '@/services/change-log/project';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TDeleteProjectResponseErrorCode } from './interfaces';

const DELETE = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  const sessionUser = context.sessionUser;
  const organizationId = req.params.organizationId;
  const projectId = req.params.projectId;

  return ifProjectExists(req, res, { id: projectId }, async (projectData) => {
    if (projectData.organizationId === organizationId) {
      await Promise.all([
        prisma.project.delete({
          where: { id: projectData.id },
        }),
        await createProjectChangeLog({ ...projectData, archivedBy: sessionUser.id }),
      ]);

      const responseBody: TResponseBody<undefined, TDeleteProjectResponseErrorCode> = {
        data: undefined,
      };

      return res.json(responseBody);
    } else {
      return res.status(STATUS_CODES.NOT_FOUND);
    }
  });
};

export { DELETE };
