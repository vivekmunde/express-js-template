import { prisma } from '@/prisma';
import { ifAuthorized } from '@/request/if-authorized';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createRoleChangeLog } from '@/services/change-log/role';
import { isActorAuthorizedToCreateRole } from '@/services/rbac/organization/is-actor-authorized-to-create-role';
import { TPermission } from '@/types/rbac';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TPostRoleResponseData, TPostRoleResponseErrorCode } from './interfaces';
import { getCreateRoleValidationSchema } from './validation-schema';

const POST = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(req, res, getCreateRoleValidationSchema(req), async (data) => {
    const sessionUser = context.sessionUser;
    const organizationId = req.params.organizationId;

    return ifAuthorized(
      req,
      res,
      () => {
        return isActorAuthorizedToCreateRole(sessionUser.id, organizationId, {
          permissionKeys: data.permissionKeys,
        });
      },
      async () => {
        const createdRoleData = await prisma.role.create({
          data: {
            organizationId,
            name: data.name,
            description: data.description,
            permissionKeys: data.permissionKeys,
            createdBy: sessionUser.id,
          },
        });

        await createRoleChangeLog(createdRoleData);

        const responseBody: TResponseBody<TPostRoleResponseData, TPostRoleResponseErrorCode> = {
          data: {
            id: createdRoleData.id,
            organizationId: createdRoleData.organizationId ?? undefined,
            name: createdRoleData.name,
            description: createdRoleData.description ?? undefined,
            permissionKeys: (createdRoleData.permissionKeys ?? []) as TPermission[],
          },
        };

        return res.json(responseBody);
      }
    );
  });
};

export { POST };
