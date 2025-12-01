import { prisma } from '@/prisma';
import { DocumentBoardQueue } from '@prisma/client';

const createDocumentBoardQueueChangeLog = async (
  documentData: DocumentBoardQueue & { archivedAt?: Date; archivedBy?: string }
) => {
  const { id: documentBoardQueueId, ...restDocumentData } = documentData;

  return await prisma.documentBoardQueueChangeLog.create({
    data: {
      ...restDocumentData,
      documentBoardQueueId,
      archivedAt: restDocumentData.archivedBy ? new Date() : null,
    },
  });
};

export { createDocumentBoardQueueChangeLog };
