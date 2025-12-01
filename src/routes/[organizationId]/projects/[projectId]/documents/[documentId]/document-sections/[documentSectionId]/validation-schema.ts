import { Request } from 'express';
import z from 'zod';

const getUpdateDocumentSectionValidationSchema = (req: Request) => {
  return z.object({
    title: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('title.required', { ns: 'validations' }),
      }),
    description: z.string().optional(),
  });
};

export { getUpdateDocumentSectionValidationSchema };
