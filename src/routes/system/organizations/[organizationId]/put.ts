import { generateOrganizationCode } from '@/organization/generate-code';
import { prisma } from '@/prisma';
import { ifOrganizationExists } from '@/request/if-exists';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createOrganizationChangeLog } from '@/services/change-log/organization';
import { TPermission } from '@/types/rbac';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { nonEmptyStringValue } from '@/utils/db';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Request, Response } from 'express';
import { TPutOrganizationResponseData } from './interfaces';
import { getUpdateOrganizationValidationSchema } from './validation-schema';

const PUT = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(
    req,
    res,
    getUpdateOrganizationValidationSchema(req),
    async (data) => {
      return ifOrganizationExists(
        req,
        res,
        { id: req.params.organizationId },
        async (organizationData) => {
          if (data.code && organizationData.code.toLowerCase() !== data.code.toLowerCase()) {
            const existingOrganizationWithSameCode = await prisma.organization.findUnique({
              where: { code: data.code.toLowerCase() },
            });

            if (existingOrganizationWithSameCode?.id) {
              const responseBody: TResponseBody<TPutOrganizationResponseData> = {
                validationErrors: {
                  code: req.t('errorMessages.DUPLICATE_ORGANIZATION_CODE', { ns: 'validations' }),
                },
                error: {
                  code: 'DUPLICATE_ORGANIZATION_CODE',
                  message: req.t('errorMessages.DUPLICATE_ORGANIZATION_CODE', {
                    ns: 'validations',
                  }),
                },
              };
              return res.status(400).json(responseBody);
            }
          }

          const organizationCode =
            data.code && data.code.length > 0
              ? data.code
              : organizationData.name.toLowerCase() !== data.name.toLowerCase()
                ? await generateOrganizationCode(data.name)
                : organizationData.code;

          const updatedOrganizationData = await prisma.organization.update({
            where: {
              id: req.params.organizationId,
            },
            data: {
              name: data.name,
              email: data.email,
              code: organizationCode.toLowerCase(),
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
              ...getUpdatedXFields(context.sessionUser),
            },
          });

          await createOrganizationChangeLog(updatedOrganizationData);

          const responseBody: TResponseBody<TPutOrganizationResponseData> = {
            data: {
              id: updatedOrganizationData.id,
              name: updatedOrganizationData.name,
              code: updatedOrganizationData.code,
              email: updatedOrganizationData.email ?? undefined,
              permissionKeys: updatedOrganizationData.permissionKeys as TPermission[],
              theme: {
                light: {
                  colors: {
                    primary: updatedOrganizationData.theme?.light?.colors?.primary ?? undefined,
                    primaryForeground:
                      updatedOrganizationData.theme?.light?.colors?.primaryForeground ?? undefined,
                    link: updatedOrganizationData.theme?.light?.colors?.link ?? undefined,
                  },
                },
                dark: {
                  colors: {
                    primary: updatedOrganizationData.theme?.dark?.colors?.primary ?? undefined,
                    primaryForeground:
                      updatedOrganizationData.theme?.dark?.colors?.primaryForeground ?? undefined,
                    link: updatedOrganizationData.theme?.dark?.colors?.link ?? undefined,
                  },
                },
              },
            },
          };

          return res.json(responseBody);
        }
      );
    }
  );
};

export { PUT };
