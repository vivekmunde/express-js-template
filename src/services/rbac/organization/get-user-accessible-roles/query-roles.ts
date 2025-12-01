import { prisma } from '@/prisma';

const queryRoles = async (organizationId: string) => {
  return (
    (await prisma.role.findMany({
      where: {
        OR: [{ organizationId: null }, { organizationId }],
      },
    })) ?? []
  );
};

export { queryRoles };
