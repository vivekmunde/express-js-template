import { prisma } from '@/prisma';
import { ifUserExists } from '@/request/if-exists';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TGetUserResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  return ifUserExists(req, res, { id: req.params.userId }, async (userData) => {
    const roles = await prisma.role.findMany({
      where: {
        id: {
          in: userData.rbacGlobalRoleIds ?? [],
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
