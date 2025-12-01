import { Request } from 'express';
import { z } from 'zod';

async function getCreateAnalyticsEventValidationSchema(req: Request) {
  return z.object({
    organizationId: z.string().trim().optional(),
    view: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('view.required', { ns: 'validations' }),
      }),
    event: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('event.required', { ns: 'validations' }),
      }),
    label: z.string().trim().optional().default(''),
    metadata: z.record(z.string(), z.unknown()).optional().default({}),
  });
}

export { getCreateAnalyticsEventValidationSchema };
