import { Request } from 'express';
import { z } from 'zod';

const getVerifyOtpValidationSchema = (req: Request) =>
  z.object({
    otp: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('otp.required', { ns: 'validations' }),
      }),
  });

export { getVerifyOtpValidationSchema };
