import { prisma } from '@/prisma';
import { UserLoginSession } from '@prisma/client';

const createUserLoginSessionChangeLog = async (
  userLoginSessionData: UserLoginSession & {
    archivedBy?: string;
  }
) => {
  const { id: userLoginId, ...restUserLoginData } = userLoginSessionData;

  return await prisma.userLoginSessionChangeLog.create({
    data: {
      ...restUserLoginData,
      userLoginId,
      archivedAt: userLoginSessionData.archivedBy ? new Date() : null,
    },
  });
};

export { createUserLoginSessionChangeLog };
