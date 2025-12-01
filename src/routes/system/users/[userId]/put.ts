import { prisma } from '@/prisma';
import { ifAuthorized } from '@/request/if-authorized';
import { ifUserExists } from '@/request/if-exists';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createUserChangeLog } from '@/services/change-log/user';
import { isSystemActorAuthorizedToAssignRolesToExistingUser } from '@/services/rbac/system/is-actor-authorized-to-assign-user-roles';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Request, Response } from 'express';
import { TPutUserResponseData } from './interfaces';
import { getUpdateUserValidationSchema } from './validation-schema';

const PUT = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(req, res, getUpdateUserValidationSchema(req), async (data) => {
    return ifAuthorized(
      req,
      res,
      () => {
        return isSystemActorAuthorizedToAssignRolesToExistingUser(
          context.sessionUser.id,
          req.params.userId,
          req.body.roleIds
        );
      },
      async () => {
        return ifUserExists(req, res, { id: req.params.userId }, async (userData) => {
          const updatedUserData = await prisma.user.update({
            where: { id: userData.id },
            data: {
              email: data.email,
              rbacOrganizations: [],
              rbacGlobalRoleIds: data.roleIds,
              ...getUpdatedXFields(context.sessionUser),
            },
          });

          await createUserChangeLog(updatedUserData);

          const responseBody: TResponseBody<TPutUserResponseData> = {
            data: {
              id: updatedUserData.id,
              email: updatedUserData.email,
              roleIds: updatedUserData.rbacGlobalRoleIds ?? [],
            },
          };

          return res.json(responseBody);
        });
      }
    );
  });
};

export { PUT };
