import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';

const GET = async (req: Request, res: Response) => {
  const responseBody: TResponseBody<number> = {
    data: Date.now(),
  };

  return res.json(responseBody);
};

export { GET };
