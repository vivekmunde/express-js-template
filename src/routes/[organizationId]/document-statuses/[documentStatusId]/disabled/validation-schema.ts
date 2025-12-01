import { Request } from 'express';
import z from 'zod';

const getUpdateDocumentStatusDisabledValidationSchema = (req: Request) => {
  return z.object({
    disabled: z
      .boolean()
      .refine((value) => value !== undefined && value !== null, {
        message: req.t('disabled.required', { ns: 'validations' }),
      })
      .refine((value) => typeof value === 'boolean', {
        message: req.t('boolean.invalid', { ns: 'validations' }),
      }),
  });
};

export { getUpdateDocumentStatusDisabledValidationSchema };
