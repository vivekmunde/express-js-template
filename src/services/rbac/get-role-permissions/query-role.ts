import { prisma } from '@/prisma';

const queryRole = async (roleId: string) => {
  return await prisma.role.findUnique({ where: { id: roleId } });
};

export { queryRole };
