import { prisma } from '@/prisma';

const queryUserRoles = async (userId: string, organizationId: string) => {
  const userData = await prisma.user.findUnique({ where: { id: userId } });

  const userRoleIds = [
    ...(userData?.rbacOrganizations.find((it) => it.organizationId === organizationId)?.roleIds ??
      []),
    ...(userData?.rbacGlobalRoleIds ?? []),
  ];

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
