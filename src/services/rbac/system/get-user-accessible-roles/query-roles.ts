import { prisma } from '@/prisma';

const queryRoles = async () => {
  return (
    (await prisma.role.findMany({
      where: {
        organizationId: null,
      },
    })) ?? []
  );
};

export { queryRoles };
