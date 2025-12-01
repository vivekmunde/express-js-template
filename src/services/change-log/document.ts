import { prisma } from '@/prisma';
import { Document } from '@prisma/client';

const createDocumentChangeLog = async (
  documentData: Document & { archivedAt?: Date; archivedBy?: string }
) => {
  const { id: documentId, ...restDocumentData } = documentData;

  return await prisma.documentChangeLog.create({
    data: {
      ...restDocumentData,
      documentId,
      archivedAt: restDocumentData.archivedBy ? new Date() : null,
    },
  });
};

export { createDocumentChangeLog };
