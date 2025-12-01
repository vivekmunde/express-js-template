import { prisma } from '@/prisma';
import { ifAuthorized } from '@/request/if-authorized';
import { ifRoleExists } from '@/request/if-exists';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createRoleChangeLog } from '@/services/change-log/role';
import { sanitizePermissionKeys } from '@/services/rbac/sanitize-permissions';
import { isSystemActorAuthorizedToModifyRole } from '@/services/rbac/system/is-actor-authorized-to-modify-role';
import { TPermission } from '@/types/rbac';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Request, Response } from 'express';
import { TPutRoleResponseData } from './interfaces';
import { getUpdateRoleValidationSchema } from './validation-schema';

const PUT = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(req, res, getUpdateRoleValidationSchema(req), async (data) => {
    return ifAuthorized(
      req,
      res,
      () => {
        return isSystemActorAuthorizedToModifyRole(context.sessionUser.id, req.params.roleId);
      },
      async () => {
        return ifRoleExists(req, res, { id: req.params.roleId }, async () => {
          const updatedRoleData = await prisma.role.update({
            where: { id: req.params.roleId },
            data: {
              name: data.name,
              description: data.description,
              permissionKeys: sanitizePermissionKeys(data.permissionKeys),
              ...getUpdatedXFields(context.sessionUser),
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
        });
      }
    );
  });
};

export { PUT };
