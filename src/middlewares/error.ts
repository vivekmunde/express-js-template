import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { NextFunction, Request, Response } from 'express';

const errorHandlerMiddleware = async (
  err: { statusCode?: number; message?: string; stack?: string; url?: string },
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  try {
    const statusCode = err.statusCode ?? STATUS_CODES.INTERNAL_SERVER_ERROR;

    await prisma.apiErrorLog.create({
      data: {
        statusCode,
        errorMessage: err.message ?? 'Internal Server Error',
        errorStack: err.stack,
        userId: req.sessionUser?.id,
        url: req.url,
        requestBody: JSON.stringify(req?.body),
        requestMethod: req?.method,
        createdBy: req.sessionUser?.id,
      },
    });

    return res.status(statusCode).json({});
  } catch (error) {
    console.error('Error while logging error:', error);

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({});
  }
};

export { errorHandlerMiddleware };
