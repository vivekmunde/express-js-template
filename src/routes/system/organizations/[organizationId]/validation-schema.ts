import { Request } from 'express';
import { z } from 'zod';

function getUpdateOrganizationValidationSchema(req: Request) {
  return z.object({
    name: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('name.required', { ns: 'validations' }),
      }),
    code: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('code.required', { ns: 'validations' }),
      }),
    email: z
      .string()
      .trim()
      .default('')
      .refine((value) => value === '' || z.email().safeParse(value).success, {
        message: req.t('email.invalid', { ns: 'validations' }),
      }),
    permissionKeys: z.array(z.string()).optional().default([]),
    themeLightColorPrimary: z.string().optional(),
    themeLightColorPrimaryForeground: z.string().optional(),
    themeLightColorLink: z.string().optional(),
    themeDarkColorPrimary: z.string().optional(),
    themeDarkColorPrimaryForeground: z.string().optional(),
    themeDarkColorLink: z.string().optional(),
  });
}

export { getUpdateOrganizationValidationSchema };
