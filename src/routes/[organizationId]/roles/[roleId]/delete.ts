import { STATUS_CODES } from '@/constants/status-codes';
import { prisma } from '@/prisma';
import { ifAuthorized } from '@/request/if-authorized';
import { ifRoleExists } from '@/request/if-exists';
import { createRoleChangeLog } from '@/services/change-log/role';
import { createUserChangeLog } from '@/services/change-log/user';
import { isActorAuthorizedToArchiveRole } from '@/services/rbac/organization/is-actor-authorized-to-archive-role';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import { TDeleteRoleResponseErrorCode } from './interfaces';

async function removeRoleFromUsers(sessionUserId: string, roleId: string) {
  const usersToUpdate = await prisma.user.findMany({
    where: {
      rbacOrganizations: {
        some: {
          roleIds: { has: roleId },
        },
      },
    },
  });

  await Promise.all(
    usersToUpdate.map(async (user) => {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          rbacOrganizations: user.rbacOrganizations.map((rbac) => ({
            organizationId: rbac.organizationId,
            roleIds: rbac.roleIds.filter((it) => it !== roleId),
          })),
          ...getUpdatedXFields({ id: sessionUserId }),
        },
      });

      await createUserChangeLog(updatedUser);
    })
  );
}

async function deleteTheRole(sessionUserId: string, roleData: Role) {
  await prisma.role.delete({
    where: { id: roleData.id },
  });

  await createRoleChangeLog({
    ...roleData,
    archivedBy: sessionUserId,
  });
}

const DELETE = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  const sessionUser = context.sessionUser;
  const organizationId = req.params.organizationId;
  const roleId = req.params.roleId;

  return ifAuthorized(
    req,
    res,
    () => {
      return isActorAuthorizedToArchiveRole(sessionUser.id, organizationId, roleId);
    },
    async () => {
      return ifRoleExists(req, res, { id: roleId }, async (roleData) => {
        if (roleData.organizationId === organizationId) {
          await Promise.all([
            removeRoleFromUsers(sessionUser.id, roleId),
            deleteTheRole(sessionUser.id, roleData),
          ]);

          const responseBody: TResponseBody<undefined, TDeleteRoleResponseErrorCode> = {
            data: undefined,
          };

          return res.json(responseBody);
        } else {
          return res.status(STATUS_CODES.NOT_FOUND);
        }
      });
    }
  );
};

export { DELETE };
