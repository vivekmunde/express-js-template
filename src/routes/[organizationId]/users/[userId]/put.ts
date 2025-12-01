import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { ifAuthorized } from '@/request/if-authorized';
import { ifUserExists } from '@/request/if-exists';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createUserChangeLog } from '@/services/change-log/user';
import { isActorAuthorizedToAssignRolesToExistingUser } from '@/services/rbac/organization/is-actor-authorized-to-assign-user-roles';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Request, Response } from 'express';
import { TPutUserResponseData } from './interfaces';
import { getUpdateUserValidationSchema } from './validation-schema';

const PUT = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(req, res, getUpdateUserValidationSchema(req), async (data) => {
    const sessionUser = context.sessionUser;
    const organizationId = req.params.organizationId;
    const userId = req.params.userId;

    return ifAuthorized(
      req,
      res,
      () => {
        return isActorAuthorizedToAssignRolesToExistingUser(
          sessionUser.id,
          organizationId,
          userId,
          data.roleIds
        );
      },
      async () => {
        return ifUserExists(req, res, { id: userId }, async (userData) => {
          if (userData.category === 'ORGANIZATION') {
            const rbacToUpdate = userData.rbacOrganizations.filter(
              (it) => it.organizationId !== organizationId
            );
            if (data.roleIds.length > 0) {
              rbacToUpdate.push({
                organizationId,
                roleIds: data.roleIds,
              });
            }

            const updatedUserData = await prisma.user.update({
              where: { id: userId },
              data: {
                email: data.email,
                rbacOrganizations: rbacToUpdate,
                ...getUpdatedXFields(sessionUser),
              },
            });

            await createUserChangeLog(updatedUserData);

            const responseBody: TResponseBody<TPutUserResponseData> = {
              data: {
                id: updatedUserData.id,
                email: updatedUserData.email,
                roleIds:
                  updatedUserData.rbacOrganizations.find(
                    (it) => it.organizationId === organizationId
                  )?.roleIds ?? [],
              },
            };

            return res.json(responseBody);
          } else {
            return res.status(STATUS_CODES.NOT_FOUND);
          }
        });
      }
    );
  });
};

export { PUT };
