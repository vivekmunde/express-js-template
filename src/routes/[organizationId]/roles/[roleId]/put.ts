import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { ifAuthorized } from '@/request/if-authorized';
import { ifRoleExists } from '@/request/if-exists';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { getUpdateRoleValidationSchema } from '@/routes/system/roles/[roleId]/validation-schema';
import { createRoleChangeLog } from '@/services/change-log/role';
import { isActorAuthorizedToModifyRole } from '@/services/rbac/organization/is-actor-authorized-to-modify-role';
import { sanitizePermissionKeys } from '@/services/rbac/sanitize-permissions';
import { TPermission } from '@/types/rbac';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Request, Response } from 'express';
import { TPutRoleResponseData } from './interfaces';

const PUT = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(req, res, getUpdateRoleValidationSchema(req), async (data) => {
    const sessionUser = context.sessionUser;
    const organizationId = req.params.organizationId;
    const roleId = req.params.roleId;

    return ifAuthorized(
      req,
      res,
      () => {
        return isActorAuthorizedToModifyRole(sessionUser.id, organizationId, roleId);
      },
      async () => {
        return ifRoleExists(req, res, { id: roleId }, async (roleData) => {
          if (roleData.organizationId === organizationId) {
            const updatedRoleData = await prisma.role.update({
              where: { id: roleId },
              data: {
                name: data.name,
                description: data.description,
                permissionKeys: sanitizePermissionKeys(data.permissionKeys),
                ...getUpdatedXFields(sessionUser),
              },
            });

            await createRoleChangeLog(updatedRoleData);

            const responseBody: TResponseBody<TPutRoleResponseData> = {
              data: {
                id: updatedRoleData.id,
                name: updatedRoleData.name,
                description: updatedRoleData.description ?? undefined,
                permissionKeys: updatedRoleData.permissionKeys as TPermission[],
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
