import { Request } from 'express';
import z from 'zod';

function getUpdateUserValidationSchema(req: Request) {
  return z.object({
    email: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('email.required', { ns: 'validations' }),
      }),
    roleIds: z.array(z.string()).default([]),
  });
}

export { getUpdateUserValidationSchema };
