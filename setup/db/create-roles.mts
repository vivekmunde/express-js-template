import { PrismaClient } from '@prisma/client';
import { TPermission } from '../../src/types/rbac';
import { consoleError, consoleSuccess, consoleWarning } from './log.mts';

async function createRole(
  prisma: PrismaClient,
  data: {
    name: string;
    permissionKeys: TPermission[];
  }
) {
  const adminUser = await prisma.user.findUnique({
    where: { email: 'system-administrator@template.com' },
  });

  if (adminUser?.id) {
    const existingRole = await prisma.role.findFirst({
      where: { name: data.name },
    });

    if (!existingRole?.id) {
      const createdRole = await prisma.role.create({
        data: {
          name: data.name,
          permissionKeys: data.permissionKeys,
          organizationId: null,
          createdBy: adminUser.id,
        },
      });

      const { id: createdRoleId, ...restCreatedRoleData } = createdRole;

      await prisma.roleChangeLog.create({
        data: {
          roleId: createdRoleId,
          ...restCreatedRoleData,
        },
      });

      consoleSuccess(`"${data.name}" role created.`);

      return createdRole;
    } else {
      consoleWarning(`"${data.name}" role already exists.`);
    }
  } else {
    consoleError(`"System Administrator" user does not exist.`);
  }
}

async function createRoles(prisma: PrismaClient) {
  const systemAdministratorPermissions: Record<TPermission, TPermission> = {
    READ_ERROR: 'READ_ERROR',
    READ_ORGANIZATION: 'READ_ORGANIZATION',
    MANAGE_ORGANIZATION: 'MANAGE_ORGANIZATION',
    READ_ROLE: 'READ_ROLE',
    MANAGE_ROLE: 'MANAGE_ROLE',
    READ_USER: 'READ_USER',
    MANAGE_USER: 'MANAGE_USER',
  };

  await createRole(prisma, {
    name: 'System Administrator',
    permissionKeys: Object.keys(systemAdministratorPermissions) as TPermission[],
  });

  await createRole(prisma, {
    name: 'Organization Administrator',
    permissionKeys: [
      'READ_ORGANIZATION',
      'MANAGE_ORGANIZATION',
      'READ_ROLE',
      'MANAGE_ROLE',
      'READ_USER',
      'MANAGE_USER',
    ],
  });

  await createRole(prisma, {
    name: 'User Administrator',
    permissionKeys: ['READ_ROLE', 'MANAGE_ROLE', 'READ_USER', 'MANAGE_USER'],
  });
}

export { createRoles };
