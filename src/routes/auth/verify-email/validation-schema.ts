import { Request } from 'express';
import { z } from 'zod';

const getVerifyEmailValidationSchema = (req: Request) =>
  z.object({
    email: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('email.required', { ns: 'validations' }),
      })
      .refine((value) => value === '' || z.email().safeParse(value).success, {
        message: req.t('email.invalid', { ns: 'validations' }),
      }),
  });

export { getVerifyEmailValidationSchema };
