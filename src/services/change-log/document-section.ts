import { prisma } from '@/prisma';
import { DocumentSection } from '@prisma/client';

const createDocumentSectionChangeLog = async (
  documentData: DocumentSection & { archivedAt?: Date; archivedBy?: string }
) => {
  const { id: documentSectionId, ...restDocumentData } = documentData;

  return await prisma.documentSectionChangeLog.create({
    data: {
      ...restDocumentData,
      documentSectionId,
      archivedAt: restDocumentData.archivedBy ? new Date() : null,
    },
  });
};

export { createDocumentSectionChangeLog };
