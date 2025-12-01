import { prisma } from '@/prisma';
import { Organization } from '@prisma/client';

const createOrganizationChangeLog = async (
  organizationData: Organization & { archivedBy?: string }
) => {
  const { id: organizationId, ...restOrganizationData } = organizationData;

  return await prisma.organizationChangeLog.create({
    data: {
      ...restOrganizationData,
      organizationId,
      archivedAt: restOrganizationData.archivedBy ? new Date() : null,
    },
  });
};

export { createOrganizationChangeLog };
