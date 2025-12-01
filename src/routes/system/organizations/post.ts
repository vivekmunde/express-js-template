import { STATUS_CODES } from '@/constants/status-codes';
import { generateOrganizationCode } from '@/organization/generate-code';
import { prisma } from '@/prisma';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createOrganizationChangeLog } from '@/services/change-log/organization';
import { TPermission } from '@/types/rbac';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { nonEmptyStringValue } from '@/utils/db';
import { Request, Response } from 'express';
import { TPostOrganizationResponseData } from './interfaces';
import { getCreateOrganizationValidationSchema } from './validation-schema';

const POST = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(
    req,
    res,
    getCreateOrganizationValidationSchema(req),
    async (data) => {
      if (data.code) {
        const existingOrganizationWithSameCode = await prisma.organization.findUnique({
          where: { code: data.code },
        });

        if (existingOrganizationWithSameCode?.id) {
          const responseBody: TResponseBody<TPostOrganizationResponseData> = {
            validationErrors: {
              code: req.t('DUPLICATE_ORGANIZATION_CODE', { ns: 'error-codes' }),
            },
            error: {
              code: 'DUPLICATE_ORGANIZATION_CODE',
              message: req.t('DUPLICATE_ORGANIZATION_CODE', { ns: 'error-codes' }),
            },
          };

          return res.status(STATUS_CODES.BAD_REQUEST).json(responseBody);
        }
      }

      const organizationCode =
        data.code && data.code.length > 0 ? data.code : await generateOrganizationCode(data.name);

      const createdOrganizationData = await prisma.organization.create({
        data: {
          name: data.name,
          code: organizationCode.toLowerCase(),
          email: data.email,
          permissionKeys: data.permissionKeys,
          theme: {
            light: {
              colors: {
                primary: nonEmptyStringValue(data.themeLightColorPrimary),
                primaryForeground: nonEmptyStringValue(data.themeLightColorPrimaryForeground),
                link: nonEmptyStringValue(data.themeLightColorLink),
              },
            },
            dark: {
              colors: {
                primary: nonEmptyStringValue(data.themeDarkColorPrimary),
                primaryForeground: nonEmptyStringValue(data.themeDarkColorPrimaryForeground),
                link: nonEmptyStringValue(data.themeDarkColorLink),
              },
            },
          },
          createdBy: context.sessionUser.id,
        },
      });

      await createOrganizationChangeLog(createdOrganizationData);

      const responseBody: TResponseBody<TPostOrganizationResponseData> = {
        data: {
          id: createdOrganizationData.id,
          name: createdOrganizationData.name,
          code: createdOrganizationData.code,
          email: createdOrganizationData.email ?? undefined,
          permissionKeys: createdOrganizationData.permissionKeys as TPermission[],
          theme: {
            light: {
              colors: {
                primary: createdOrganizationData.theme?.light?.colors?.primary ?? undefined,
                primaryForeground:
                  createdOrganizationData.theme?.light?.colors?.primaryForeground ?? undefined,
                link: createdOrganizationData.theme?.light?.colors?.link ?? undefined,
              },
            },
            dark: {
              colors: {
                primary: createdOrganizationData.theme?.dark?.colors?.primary ?? undefined,
                primaryForeground:
                  createdOrganizationData.theme?.dark?.colors?.primaryForeground ?? undefined,
                link: createdOrganizationData.theme?.dark?.colors?.link ?? undefined,
              },
            },
          },
        },
      };

      return res.json(responseBody);
    }
  );
};

export { POST };
