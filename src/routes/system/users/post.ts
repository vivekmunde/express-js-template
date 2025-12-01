import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { ifAuthorized } from '@/request/if-authorized';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createUserChangeLog } from '@/services/change-log/user';
import { isSystemActorAuthorizedToAssignRolesToNewUser } from '@/services/rbac/system/is-actor-authorized-to-assign-user-roles';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Request, Response } from 'express';
import { TPostUserResponseData, TPostUserResponseErrorCode } from './interfaces';
import { getCreateUserValidationSchema } from './validation-schema';

const POST = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(req, res, getCreateUserValidationSchema(req), async (data) => {
    return ifAuthorized(
      req,
      res,
      () => {
        return isSystemActorAuthorizedToAssignRolesToNewUser(context.sessionUser.id, data.roleIds);
      },
      async () => {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
        });

        if (existingUser?.id && existingUser.rbacGlobalRoleIds.length > 0) {
          const responseBody: TResponseBody<undefined, TPostUserResponseErrorCode> = {
            error: {
              code: 'USER_EXISTS',
              message: req.t('USER_EXISTS', { ns: 'error-codes' }),
            },
          };

          return res.status(STATUS_CODES.BAD_REQUEST).json(responseBody);
        }

        const createdUserData = existingUser?.id
          ? await prisma.user.update({
              where: {
                email: data.email,
              },
              data: {
                category: 'SYSTEM',
                rbacGlobalRoleIds: data.roleIds,
                ...getUpdatedXFields(context.sessionUser),
              },
            })
          : await prisma.user.create({
              data: {
                email: data.email,
                category: 'SYSTEM',
                rbacOrganizations: [],
                rbacGlobalRoleIds: data.roleIds,
                createdBy: context.sessionUser.id,
              },
            });

        await createUserChangeLog(createdUserData);

        const responseBody: TResponseBody<TPostUserResponseData> = {
          data: {
            id: createdUserData.id,
            email: createdUserData.email,
            roleIds: createdUserData.rbacGlobalRoleIds,
          },
        };

        return res.json(responseBody);
      }
    );
  });
};

export { POST };
