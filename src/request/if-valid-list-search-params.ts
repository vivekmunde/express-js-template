import { TListParams } from '@/types/list-params';
import { Request, Response } from 'express';
import z from 'zod';
import { ifValidValues } from './if-valid-values';

const getValidationSchema = <TSortBy extends string>(
  req: Request,
  sortByFields: [TSortBy, ...TSortBy[]]
) => {
  return z.object({
    search: z.string().trim().optional(),
    sortBy: z
      .enum(sortByFields, {
        message: req.t('listSearchParams.sortBy.invalid', {
          sortByFields: sortByFields.join(', '),
          ns: 'validations',
        }),
      })
      .optional(),
    sortOrder: z
      .enum(['asc', 'desc'], {
        message: req.t('listSearchParams.sortOrder.invalid', {
          ns: 'validations',
        }),
      })
      .default('asc'),
    page: z
      .string()
      .default('1')
      .transform((val) => {
        const num = Number(val);
        return isNaN(num) || num < 1 ? 1 : num;
      })
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: req.t('listSearchParams.page.invalid', {
          ns: 'validations',
        }),
      }),
    size: z
      .string()
      .default('10')
      .transform((val) => {
        const num = Number(val);
        return isNaN(num) || num < 1 ? 10 : num;
      })
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0 && val < 101, {
        message: req.t('listSearchParams.size.invalid', {
          ns: 'validations',
        }),
      }),
  });
};

const ifValidListSearchParams = async <TSortBy extends string>(
  req: Request,
  res: Response,
  sortByFields: [TSortBy, ...TSortBy[]],
  fn: (data: TListParams<TSortBy>) => Promise<Response>
): Promise<Response> => {
  const values = Object.assign({}, req.query) as {
    page?: string;
    size?: string;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
  };

  return ifValidValues(req, res, values, getValidationSchema(req, sortByFields), fn);
};

export { ifValidListSearchParams };
