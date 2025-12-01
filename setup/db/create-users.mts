import { PrismaClient } from '@prisma/client';
import { ObjectId } from 'bson';
import { consoleSuccess, consoleWarning } from './log.mts';

async function createAdmin(prisma: PrismaClient) {
  const existingUser = await prisma.user.findUnique({
    where: { email: 'system-administrator@q.com' },
  });

  if (!existingUser?.id) {
    const rbacGlobalRoleIds = (await prisma.role.findMany())?.map((it) => it.id);

    const userCreated = await prisma.user.create({
      data: {
        email: 'system-administrator@q.com',
        name: 'System Administrator',
        rbacGlobalRoleIds,
        category: 'SYSTEM',
        createdBy: new ObjectId().toString(),
      },
    });

    const { id: userCreatedId, ...restUserCreatedData } = userCreated;

    await prisma.userChangeLog.create({
      data: {
        userId: userCreatedId,
        ...restUserCreatedData,
      },
    });

    const userUpdated = await prisma.user.update({
      data: {
        createdBy: userCreatedId,
        updatedAt: new Date(),
        updatedBy: userCreatedId,
      },
      where: { id: userCreatedId },
    });

    const { id: userUpdatedId, ...restUserUpdatedData } = userUpdated;

    await prisma.userChangeLog.create({
      data: {
        userId: userUpdatedId,
        ...restUserUpdatedData,
      },
    });

    consoleSuccess(`"System Administrator" user created.`);
  } else {
    consoleWarning(`"System Administrator" user already exists.`);
  }
}

async function createUsers(prisma: PrismaClient) {
  await createAdmin(prisma);
}

export { createUsers };
