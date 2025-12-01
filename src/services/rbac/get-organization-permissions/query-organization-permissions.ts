import { prisma } from '@/prisma';

const queryOrganizationPermissions = async (organizationId: string) => {
  const organizationData = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  return Array.from(new Set(organizationData?.permissionKeys ?? []));
};

export { queryOrganizationPermissions };
