import { Request } from 'express';
import { z } from 'zod';

function getUpdateThemeModePreferenceValidationSchema(req: Request) {
  return z.object({
    themeMode: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('themeMode.required', { ns: 'validations' }),
      }),
  });
}

export { getUpdateThemeModePreferenceValidationSchema };
