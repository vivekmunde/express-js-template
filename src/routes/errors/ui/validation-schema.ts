import { Request } from 'express';
import { z } from 'zod';

const getCreateErrorValidationSchema = (req: Request) => {
  return z.object({
    error: z.object({
      message: z.string().trim().default(''),
      name: z.string().trim().default(''),
      stack: z.string().trim().default(''),
      componentStack: z.string().trim().default(''),
      digest: z.string().trim().default(''),
    }),
    url: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('url.required', { ns: 'validations' }),
      }),
  });
};

export { getCreateErrorValidationSchema };
