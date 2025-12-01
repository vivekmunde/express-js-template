import { ifAuthorized } from '@/request/if-authorized';
import { ifRoleExists } from '@/request/if-exists';
import { sanitizePermissionKeys } from '@/services/rbac/sanitize-permissions';
import { isSystemActorAuthorizedToAccessRole } from '@/services/rbac/system/is-actor-authorized-to-access-role';
import { TPermission } from '@/types/rbac';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TGetRoleResponseData } from './interfaces';

const GET = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifAuthorized(
    req,
    res,
    () => {
      return isSystemActorAuthorizedToAccessRole(context.sessionUser.id, req.params.roleId);
    },
    async () => {
      return ifRoleExists(req, res, { id: req.params.roleId }, async (roleData) => {
        const responseBody: TResponseBody<TGetRoleResponseData> = {
          data: {
            id: roleData.id,
            name: roleData.name,
            description: roleData.description ?? undefined,
            permissionKeys: sanitizePermissionKeys(roleData.permissionKeys as TPermission[]),
          },
        };

        return res.json(responseBody);
      });
    }
  );
};

export { GET };
