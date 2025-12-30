import { PrismaClient } from '@prisma/client';
import { consoleSuccess, consoleWarning } from './log.mts';

async function assignRoles(prisma: PrismaClient) {
  const existingUser = await prisma.user.findUnique({
    where: { email: 'system-administrator@template.com' },
  });

  if (existingUser?.id) {
    const rbacGlobalRoleIds = (await prisma.role.findMany())?.map((it) => it.id);

    const userUpdated = await prisma.user.update({
      where: {
        email: 'system-administrator@template.com',
      },
      data: {
        rbacGlobalRoleIds,
        updatedAt: new Date(),
        updatedBy: existingUser?.id,
      },
    });

    const { id: userUpdatedId, ...restUserUpdatedData } = userUpdated;

    await prisma.userChangeLog.create({
      data: {
        userId: userUpdatedId,
        ...restUserUpdatedData,
      },
    });

    consoleSuccess(`Roles assigned to "System Administrator".`);
  } else {
    consoleWarning(`"System Administrator" user does not exist.`);
  }
}

export { assignRoles };
