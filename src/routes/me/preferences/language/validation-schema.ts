import { Request } from 'express';
import { z } from 'zod';

function getUpdateLanguagePreferenceValidationSchema(req: Request) {
  return z.object({
    language: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('language.required', { ns: 'validations' }),
      }),
  });
}

export { getUpdateLanguagePreferenceValidationSchema };
