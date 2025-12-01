import { prisma } from '@/prisma';
import { ifAuthorized } from '@/request/if-authorized';
import { ifRoleExists } from '@/request/if-exists';
import { createRoleChangeLog } from '@/services/change-log/role';
import { createUserChangeLog } from '@/services/change-log/user';
import { isSystemActorAuthorizedToArchiveRole } from '@/services/rbac/system/is-actor-authorized-to-archive-role';
import { TProtectedRequestContext } from '@/types/request';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Role } from '@prisma/client';
import { Request, Response } from 'express';

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
          rbacGlobalRoleIds: user.rbacGlobalRoleIds.filter((it) => it !== roleId),
          ...getUpdatedXFields({ id: sessionUserId }),
        },
      });

      await createUserChangeLog(updatedUser);
    })
  );
}

async function deleteRole(sessionUserId: string, roleData: Role) {
  await prisma.role.delete({
    where: { id: roleData.id },
  });

  await createRoleChangeLog({
    ...roleData,
    archivedBy: sessionUserId,
  });
}

const DELETE = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifAuthorized(
    req,
    res,
    () => {
      return isSystemActorAuthorizedToArchiveRole(context.sessionUser.id, req.params.roleId);
    },
    async () => {
      return ifRoleExists(req, res, { id: req.params.roleId }, async (roleData) => {
        await Promise.all([
          removeRoleFromUsers(context.sessionUser.id, req.params.roleId),
          deleteRole(context.sessionUser.id, roleData),
        ]);

        return res.json({});
      });
    }
  );
};

export { DELETE };
