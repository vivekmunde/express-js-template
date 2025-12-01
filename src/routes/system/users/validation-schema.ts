import { Request } from 'express';
import z from 'zod';

const getCreateUserValidationSchema = (req: Request) => {
  return z.object({
    email: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('email.required', { ns: 'validations' }),
      }),
    roleIds: z
      .array(z.string())
      .default([])
      .refine((value) => value.length > 0, {
        message: req.t('role.required', { ns: 'validations' }),
      }),
  });
};

export { getCreateUserValidationSchema };
