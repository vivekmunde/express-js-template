import { STATUS_CODES } from '@/constants/status-codes';
import { TResponseBody, TValidationError } from '@/types/response-body';
import { Request, Response } from 'express';
import { ZodType } from 'zod';

const ifValidValues = async <TInput, TOutput>(
  req: Request,
  res: Response,
  values: TInput,
  validationSchema: ZodType<TOutput, TInput>,
  fn: (data: TOutput) => Promise<Response<TResponseBody<TOutput>>>
): Promise<Response<TResponseBody<TOutput>>> => {
  const { success, error, data } = validationSchema.safeParse(values);

  if (success) {
    return await fn(data);
  }

  const fieldErrors: TValidationError = {};

  for (const issue of error.issues) {
    let current: TValidationError = fieldErrors;

    for (let i = 0; i < issue.path.length; i++) {
      const rawKey = issue.path[i];

      if (typeof rawKey !== 'string' && typeof rawKey !== 'number') {
        continue;
      }

      const key = rawKey.toString();

      if (i === issue.path.length - 1) {
        current[key] = issue.message;
      } else {
        if (!(current[key] && typeof current[key] === 'object')) {
          current[key] = {};
        }
        current = current[key];
      }
    }
  }

  const responseBody: TResponseBody<TOutput> = {
    validationErrors: fieldErrors,
  };

  return res.status(STATUS_CODES.BAD_REQUEST).json(responseBody);
};

export { ifValidValues };
