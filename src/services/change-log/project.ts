import { prisma } from '@/prisma';
import { Project } from '@prisma/client';

const createProjectChangeLog = async (
  projectData: Project & { archivedAt?: Date; archivedBy?: string }
) => {
  const { id: projectId, ...restProjectData } = projectData;

  return await prisma.projectChangeLog.create({
    data: {
      ...restProjectData,
      projectId,
      archivedAt: restProjectData.archivedBy ? new Date() : null,
    },
  });
};

export { createProjectChangeLog };
