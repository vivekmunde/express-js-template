import { Request } from 'express';
import z from 'zod';

const getUpdateProjectValidationSchema = (req: Request) => {
  return z.object({
    name: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('name.required', { ns: 'validations' }),
      }),
    description: z.string().optional(),
    documentNumberPrefix: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('documentNumberPrefix.required', { ns: 'validations' }),
      }),
    documentTypeIds: z.array(z.string()).min(1, {
      message: req.t('documentTypes.required', { ns: 'validations' }),
    }),
    documentStatusIds: z.array(z.string()).min(1, {
      message: req.t('documentStatuses.required', { ns: 'validations' }),
    }),
  });
};

export { getUpdateProjectValidationSchema };
