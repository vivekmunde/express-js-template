import { prisma } from '@/prisma';
import { User } from '@prisma/client';

const createUserChangeLog = async (userData: User & { archivedAt?: Date; archivedBy?: string }) => {
  const { id: userId, ...restUserData } = userData;

  return await prisma.userChangeLog.create({
    data: {
      ...restUserData,
      userId,
      archivedAt: restUserData.archivedBy ? new Date() : null,
    },
  });
};

export { createUserChangeLog };
