import { Request } from 'express';
import { z } from 'zod';

function getCreateRoleValidationSchema(req: Request) {
  return z.object({
    name: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('name.required', {
          ns: 'validations',
        }),
      }),
    description: z.string().trim().optional(),
    permissionKeys: z.array(z.string()).min(1, {
      message: req.t('permission.required', {
        ns: 'validations',
      }),
    }),
  });
}

export { getCreateRoleValidationSchema };
