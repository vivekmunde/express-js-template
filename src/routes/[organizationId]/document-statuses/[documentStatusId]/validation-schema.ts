import { Request } from 'express';
import z from 'zod';

const getUpdateDocumentStatusValidationSchema = (req: Request) => {
  return z.object({
    name: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('name.required', { ns: 'validations' }),
      }),
    description: z.string().optional(),
    lightColorBackground: z.string().optional(),
    lightColorForeground: z.string().optional(),
    darkColorBackground: z.string().optional(),
    darkColorForeground: z.string().optional(),
  });
};

export { getUpdateDocumentStatusValidationSchema };
