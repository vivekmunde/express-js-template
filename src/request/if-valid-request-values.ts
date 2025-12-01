import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { ZodType } from 'zod';
import { ifValidValues } from './if-valid-values';

const ifValidRequestValues = async <TInput, TOutput>(
  req: Request,
  res: Response,
  validationSchema: ZodType<TOutput, TInput>,
  fn: (data: TOutput) => Promise<Response<TResponseBody<TOutput>>>
): Promise<Response<TResponseBody<TOutput>>> => {
  const values = req.body;
  return ifValidValues(req, res, values, validationSchema, fn);
};

export { ifValidRequestValues };
