import { prisma } from '@/prisma';

const queryUserOrganizations = async (userId: string) => {
  const userData = await prisma.user.findUnique({ where: { id: userId } });

  if (userData?.category === 'SYSTEM') {
    const organizationsData = await prisma.organization.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return organizationsData;
  } else {
    const userOrganizationIds = userData?.rbacOrganizations.map((it) => it.organizationId);

    if (userOrganizationIds && userOrganizationIds.length > 0) {
      const organizationsData = await prisma.organization.findMany({
        where: {
          id: { in: userOrganizationIds },
        },
        orderBy: {
          name: 'asc',
        },
      });

      return organizationsData;
    }
  }

  return [];
};

export { queryUserOrganizations };
