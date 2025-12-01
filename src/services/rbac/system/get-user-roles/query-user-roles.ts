import { prisma } from '@/prisma';

const queryUserRoles = async (userId: string) => {
  const userData = await prisma.user.findUnique({ where: { id: userId, category: 'SYSTEM' } });
  const userRoleIds = userData?.rbacGlobalRoleIds;

  if (userRoleIds && userRoleIds.length > 0) {
    const userRolesData = await prisma.role.findMany({
      where: {
        id: { in: userRoleIds },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return userRolesData;
  }

  return [];
};

export { queryUserRoles };
