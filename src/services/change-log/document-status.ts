import { prisma } from '@/prisma';
import { DocumentStatus } from '@prisma/client';

const createDocumentStatusChangeLog = async (
  documentData: DocumentStatus & { archivedAt?: Date; archivedBy?: string }
) => {
  const { id: documentStatusId, ...restDocumentData } = documentData;

  return await prisma.documentStatusChangeLog.create({
    data: {
      ...restDocumentData,
      documentStatusId,
      archivedAt: restDocumentData.archivedBy ? new Date() : null,
    },
  });
};

export { createDocumentStatusChangeLog };
