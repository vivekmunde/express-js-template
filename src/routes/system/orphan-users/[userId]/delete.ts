import { prisma } from '@/prisma';
import { ifUserExists } from '@/request/if-exists';
import { createUserChangeLog } from '@/services/change-log/user';
import { TProtectedRequestContext } from '@/types/request';
import { Request, Response } from 'express';

const DELETE = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifUserExists(req, res, { id: req.params.userId }, async (userData) => {
    await prisma.user.delete({
      where: { id: userData.id },
    });

    await createUserChangeLog({
      ...userData,
      archivedBy: context.sessionUser.id,
    });

    return res.json({});
  });
};

export { DELETE };
