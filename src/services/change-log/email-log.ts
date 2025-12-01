import { prisma } from '@/prisma';

type TEmailAddress = {
  email: string;
  name?: string;
};

const createEmailLog = async (data: {
  to: Array<TEmailAddress>;
  cc?: Array<TEmailAddress>;
  bcc?: Array<TEmailAddress>;
  from?: TEmailAddress;
  replyTo?: TEmailAddress;
  subject: string;
  text?: string;
  html?: string;
  messageId?: string;
  createdBy: string;
}) => {
  return await prisma.emailLog.create({
    data: {
      to: data.to,
      cc: data.cc,
      bcc: data.bcc,
      from: data.from,
      replyTo: data.replyTo,
      subject: data.subject,
      text: data.text,
      html: data.html,
      messageId: data.messageId,
      createdBy: data.createdBy,
    },
  });
};

export { createEmailLog };
