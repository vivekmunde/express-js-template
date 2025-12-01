import { prisma } from '@/prisma';
import { DocumentComment } from '@prisma/client';

const createDocumentCommentChangeLog = async (
  documentData: DocumentComment & { archivedAt?: Date; archivedBy?: string }
) => {
  const { id: documentCommentId, ...restDocumentData } = documentData;

  return await prisma.documentCommentChangeLog.create({
    data: {
      ...restDocumentData,
      documentCommentId,
      archivedAt: restDocumentData.archivedBy ? new Date() : null,
    },
  });
};

export { createDocumentCommentChangeLog };
