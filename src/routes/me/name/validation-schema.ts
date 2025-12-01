import { Request } from 'express';
import { z } from 'zod';

function getUpdateNameValidationSchema(req: Request) {
  return z.object({
    name: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('name.required', { ns: 'validations' }),
      }),
  });
}

export { getUpdateNameValidationSchema };
