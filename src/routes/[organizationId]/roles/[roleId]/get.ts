import { ifAuthorized } from '@/request/if-authorized';
import { ifRoleExists } from '@/request/if-exists';
import { isActorAuthorizedToAccessRole } from '@/services/rbac/organization/is-actor-authorized-to-access-role';
import { sanitizePermissionKeys } from '@/services/rbac/sanitize-permissions';
import { TPermission } from '@/types/rbac';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TGetRoleResponseData } from './interfaces';

const GET = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  const sessionUser = context.sessionUser;
  const organizationId = req.params.organizationId;
  const roleId = req.params.roleId;

  return ifAuthorized(
    req,
    res,
    () => {
      return isActorAuthorizedToAccessRole(sessionUser.id, organizationId, roleId);
    },
    async () => {
      return ifRoleExists(req, res, { id: roleId }, async (roleData) => {
        const responseBody: TResponseBody<TGetRoleResponseData> = {
          data: {
            id: roleData.id,
            organizationId: roleData.organizationId ?? undefined,
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
