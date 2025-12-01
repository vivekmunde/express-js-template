import { prisma } from '@/prisma';
import { ifAuthorized } from '@/request/if-authorized';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { createRoleChangeLog } from '@/services/change-log/role';
import { isSystemActorAuthorizedToCreateRole } from '@/services/rbac/system/is-actor-authorized-to-create-role';
import { TPermission } from '@/types/rbac';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TPostRoleResponseData } from './interfaces';
import { getCreateRoleValidationSchema } from './validation-schema';

const POST = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifValidRequestValues(req, res, getCreateRoleValidationSchema(req), async (data) => {
    return ifAuthorized(
      req,
      res,
      () => {
        return isSystemActorAuthorizedToCreateRole(context.sessionUser.id, {
          permissionKeys: data.permissionKeys,
        });
      },
      async () => {
        const createdRoleData = await prisma.role.create({
          data: {
            name: data.name,
            organizationId: null,
            description: data.description,
            permissionKeys: data.permissionKeys,
            createdBy: context.sessionUser.id,
          },
        });

        await createRoleChangeLog(createdRoleData);

        const responseBody: TResponseBody<TPostRoleResponseData> = {
          data: {
            id: createdRoleData.id,
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
