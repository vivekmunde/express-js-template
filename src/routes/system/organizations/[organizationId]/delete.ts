import { prisma } from '@/prisma';
import { ifOrganizationExists } from '@/request/if-exists';
import { createOrganizationChangeLog } from '@/services/change-log/organization';
import { createRoleChangeLog } from '@/services/change-log/role';
import { createUserChangeLog } from '@/services/change-log/user';
import { TProtectedRequestContext } from '@/types/request';
import { getUpdatedXFields } from '@/utils/get-updatedX-fields';
import { Organization } from '@prisma/client';
import { Request, Response } from 'express';

async function removeOrganizationFromUsersRBAC(sessionUserId: string, organizationId: string) {
  const usersToUpdate = await prisma.user.findMany({
    where: {
      rbacOrganizations: {
        some: {
          organizationId,
        },
      },
    },
  });

  await Promise.all(
    usersToUpdate.map(async (user) => {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          rbacOrganizations: user.rbacOrganizations.filter(
            (it) => it.organizationId !== organizationId
          ),
          ...getUpdatedXFields({ id: sessionUserId }),
        },
      });

      await createUserChangeLog(updatedUser);
    })
  );
}

async function deleteOrganizationRoles(sessionUserId: string, organizationId: string) {
  const rolesToDelete = await prisma.role.findMany({
    where: {
      organizationId,
    },
  });

  await Promise.all(
    rolesToDelete.map((it) => createRoleChangeLog({ ...it, archivedBy: sessionUserId }))
  );

  await prisma.role.deleteMany({
    where: {
      organizationId,
    },
  });
}

async function deleteOrganization(sessionUserId: string, organizationData: Organization) {
  await prisma.organization.delete({
    where: {
      id: organizationData.id,
    },
  });

  await createOrganizationChangeLog({
    ...organizationData,
    archivedBy: sessionUserId,
  });
}

const DELETE = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifOrganizationExists(
    req,
    res,
    { id: req.params.organizationId },
    async (organizationData) => {
      await Promise.all([
        removeOrganizationFromUsersRBAC(context.sessionUser.id, organizationData.id),
        deleteOrganizationRoles(context.sessionUser.id, organizationData.id),
        deleteOrganization(context.sessionUser.id, organizationData),
      ]);

      return res.json({});
    }
  );
};

export { DELETE };
