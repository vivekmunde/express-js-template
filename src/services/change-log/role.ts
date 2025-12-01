import { prisma } from '@/prisma';
import { Role } from '@prisma/client';

const createRoleChangeLog = async (roleData: Role & { archivedBy?: string }) => {
  const { id: roleId, ...restRoleData } = roleData;

  return await prisma.roleChangeLog.create({
    data: {
      ...restRoleData,
      roleId,
      archivedAt: restRoleData.archivedBy ? new Date() : null,
    },
  });
};

export { createRoleChangeLog };
