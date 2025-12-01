import { getOtpEmailTemplate } from '@/email-templates/otp';
import { createEmailLog } from '@/services/change-log/email-log';
import { sendEmail } from '@/services/mailer';
import { Request } from 'express';

const sendOtp = async (
  req: Request,
  data: {
    otp: string;
    toEmail: string;
    toName?: string;
    createdBy: string;
  }
) => {
  const { subject, html, text } = await getOtpEmailTemplate(req.t, {
    otp: data.otp,
  });

  const emailResponse = await sendEmail({
    to: [
      {
        email: data.toEmail,
        name: data.toName ?? data.toEmail,
      },
    ],
    subject,
    html,
    text,
  });

  await createEmailLog({
    ...emailResponse,
    createdBy: data.createdBy,
  });
};

export { sendOtp };
