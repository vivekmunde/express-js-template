import { getUserSession } from '@/auth/user-session';
import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { User } from '@prisma/client';
import { Request, Response } from 'express';

const ifValidSessionUser = async (
  req: Request,
  res: Response,
  fn: (user: User) => Promise<void>
) => {
  const session = await getUserSession(req);

  if (session?.userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    });

    if (user) {
      await fn(user);
    } else {
      res.status(STATUS_CODES.UNAUTHORIZED).json({});
    }
  } else {
    res.status(STATUS_CODES.UNAUTHORIZED).json({});
  }
};

export { ifValidSessionUser };
