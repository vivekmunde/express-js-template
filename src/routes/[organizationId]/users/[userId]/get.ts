import { prisma } from '@/prisma';
import { ifUserExists } from '@/request/if-exists';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TGetUserResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  const organizationId = req.params.organizationId;
  const userId = req.params.userId;

  return ifUserExists(req, res, { id: userId }, async (userData) => {
    const roles = await prisma.role.findMany({
      where: {
        id: {
          in:
            userData.rbacOrganizations.find((it) => it.organizationId === organizationId)
              ?.roleIds ?? [],
        },
      },
    });

    const responseBody: TResponseBody<TGetUserResponseData> = {
      data: {
        id: userData.id,
        name: userData.name ?? undefined,
        email: userData.email,
        roles: roles.map((it) => ({
          id: it.id,
          name: it.name,
        })),
      },
    };

    return res.json(responseBody);
  });
};

export { GET };
