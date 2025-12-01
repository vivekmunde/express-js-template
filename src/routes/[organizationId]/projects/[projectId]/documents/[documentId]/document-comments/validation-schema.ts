import { Request } from 'express';
import z from 'zod';

const getCreateDocumentCommentValidationSchema = (req: Request) => {
  return z.object({
    comment: z
      .string()
      .trim()
      .default('')
      .refine((value) => value.length > 0, {
        message: req.t('comment.required', { ns: 'validations' }),
      }),
    parentId: z.string().optional(),
    toUserIds: z.array(z.string()).optional(),
    ccUserIds: z.array(z.string()).optional(),
  });
};

export { getCreateDocumentCommentValidationSchema };
