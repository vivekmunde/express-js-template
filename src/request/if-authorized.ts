import { STATUS_CODES } from '@/constants/status-codes';
import { Request, Response } from 'express';

const ifAuthorized = async (
  req: Request,
  res: Response,
  access: () => Promise<boolean>,
  fn: () => Promise<Response>
) => {
  if (await access()) {
    return fn();
  }

  return res.status(STATUS_CODES.UNAUTHORIZED).json({});
};

export { ifAuthorized };
