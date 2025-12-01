import { prisma } from '@/prisma';
import { DocumentType } from '@prisma/client';

const createDocumentTypeChangeLog = async (
  documentData: DocumentType & { archivedAt?: Date; archivedBy?: string }
) => {
  const { id: documentTypeId, ...restDocumentData } = documentData;

  return await prisma.documentTypeChangeLog.create({
    data: {
      ...restDocumentData,
      documentTypeId,
      archivedAt: restDocumentData.archivedBy ? new Date() : null,
    },
  });
};

export { createDocumentTypeChangeLog };
