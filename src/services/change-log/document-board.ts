import { prisma } from '@/prisma';
import { DocumentBoard } from '@prisma/client';

const createDocumentBoardChangeLog = async (
  documentData: DocumentBoard & { archivedAt?: Date; archivedBy?: string }
) => {
  const { id: documentBoardId, ...restDocumentData } = documentData;

  return await prisma.documentBoardChangeLog.create({
    data: {
      ...restDocumentData,
      documentBoardId,
      archivedAt: restDocumentData.archivedBy ? new Date() : null,
    },
  });
};

export { createDocumentBoardChangeLog };
