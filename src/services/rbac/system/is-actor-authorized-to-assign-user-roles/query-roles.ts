import { prisma } from '@/prisma';

const queryRoles = async (roleIds: string[]) => {
  return await prisma.role.findMany({
    where: { id: { in: roleIds } },
  });
};

export { queryRoles };
