import {
  destroyUserSession,
  getUserSession,
  isValidUserSession,
  refreshUserSession,
} from '@/auth/user-session';
import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { NextFunction, Request, Response } from 'express';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    /**
     * Public Routes
     * - Starting with /:lng/auth
     * - Starting with /:lng/heart-beat
     */
    if (req.path.match(/^\/[a-zA-Z]{2}\/(auth|heart-beat)/)) {
      return next();
    }

    /**
     * Protected Routes
     */
    if (isValidUserSession(req)) {
      const userSession = getUserSession(req);

      const userDetails = await prisma.user.findUnique({
        where: {
          id: userSession?.userId,
        },
      });

      if (userDetails?.id) {
        req.sessionUser = userDetails;

        refreshUserSession(req, res);

        return next();
      }
    }

    destroyUserSession(res);

    return res.status(STATUS_CODES.UNAUTHORIZED).json({});
  } catch (error) {
    next(error);
  }
};

export { authMiddleware };
