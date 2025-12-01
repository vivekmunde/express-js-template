import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { ifAuthorized } from '@/request/if-authorized';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createUserChangeLog } from '@/services/change-log/user';
import { isActorAuthorizedToAssignRolesToNewUser } from '@/services/rbac/organization/is-actor-authorized-to-assign-user-roles';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Request, Response } from 'express';
import { TPostUserResponseData, TPostUserResponseErrorCode } from './interfaces';
import { getCreateUserValidationSchema } from './validation-schema';

const POST = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(req, res, getCreateUserValidationSchema(req), async (data) => {
    const organizationId = req.params.organizationId;

    return ifAuthorized(
      req,
      res,
      () => {
        return isActorAuthorizedToAssignRolesToNewUser(
          context.sessionUser.id,
          organizationId,
          data.roleIds
        );
      },
      async () => {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
        });

        if (existingUser?.category === 'SYSTEM') {
          const responseBody: TResponseBody<undefined, TPostUserResponseErrorCode> = {
            error: {
              code: 'SYSTEM_USER_EXISTS',
              message: req.t('SYSTEM_USER_EXISTS', { ns: 'error-codes' }),
            },
          };

          return res.status(STATUS_CODES.BAD_REQUEST).json(responseBody);
        }

        const existingUserHasOrganizationAccess = existingUser?.rbacOrganizations.find(
          (it) => it.organizationId === organizationId
        );

        if (existingUserHasOrganizationAccess) {
          const responseBody: TResponseBody<undefined, TPostUserResponseErrorCode> = {
            error: {
              code: 'USER_EXISTS',
              message: req.t('USER_EXISTS', { ns: 'error-codes' }),
            },
          };

          return res.status(STATUS_CODES.BAD_REQUEST).json(responseBody);
        }

        const createdUserData = await (existingUser?.id
          ? prisma.user.update({
              where: { id: existingUser.id },
              data: {
                email: data.email,
                rbacOrganizations: [
                  ...existingUser.rbacOrganizations.filter(
                    (it) => it.organizationId !== organizationId
                  ),
                  { organizationId, roleIds: data.roleIds },
                ],
                ...getUpdatedXFields(context.sessionUser),
              },
            })
          : prisma.user.create({
              data: {
                email: data.email,
                category: 'ORGANIZATION',
                rbacGlobalRoleIds: [],
                rbacOrganizations: [
                  {
                    organizationId,
                    roleIds: data.roleIds,
                  },
                ],
                createdBy: context.sessionUser.id,
              },
            }));

        await createUserChangeLog(createdUserData);

        const responseBody: TResponseBody<TPostUserResponseData> = {
          data: {
            id: createdUserData.id,
            email: createdUserData.email,
            roleIds: createdUserData.rbacOrganizations[0].roleIds,
          },
        };

        return res.json(responseBody);
      }
    );
  });
};

export { POST };
