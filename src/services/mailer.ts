import {
  AMAZON_AWS_ACCESS_KEY_ID,
  AMAZON_AWS_REGION,
  AMAZON_AWS_SECRET_ACCESS_KEY,
  AMAZON_AWS_SES_FROM_EMAIL,
  AMAZON_AWS_SES_FROM_NAME,
  IS_DEVELOPMENT,
} from '@/env';
import { getRandomNumber } from '@/utils/get-random-number';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

// Types for email service
export type TEmailAddress = {
  email: string;
  name?: string;
};

export type TEmailOptions = {
  to: Array<TEmailAddress>;
  cc?: Array<TEmailAddress>;
  bcc?: Array<TEmailAddress>;
  from?: TEmailAddress;
  replyTo?: TEmailAddress;
  subject: string;
  text?: string;
  html?: string;
};

export type TSendEmailResult = TEmailOptions & { messageId?: string };

// AWS SES configuration - Singleton pattern
let sesClient: SESClient | null = null;

const getSESClient = (): SESClient => {
  if (!sesClient) {
    sesClient = new SESClient({
      region: AMAZON_AWS_REGION,
      credentials: {
        accessKeyId: AMAZON_AWS_ACCESS_KEY_ID,
        secretAccessKey: AMAZON_AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return sesClient;
};

// Utility functions
const formatEmailAddress = (address: TEmailAddress): string => {
  return address.name ? `${address.name} <${address.email}>` : address.email;
};

const formatEmailAddresses = (addresses: Array<TEmailAddress>): string[] => {
  return addresses.map(formatEmailAddress);
};

// Main email sending function
const sendEmail = async (options: TEmailOptions): Promise<TSendEmailResult> => {
  if (IS_DEVELOPMENT) {
    return {
      ...options,
      messageId: `dev-${Array.from({ length: 16 }, () => getRandomNumber(0, 9)).join('')}`,
    };
  }

  const SES = getSESClient();

  // Set default from address if not provided
  const fromEmail = formatEmailAddress(
    options.from ?? { name: AMAZON_AWS_SES_FROM_NAME, email: AMAZON_AWS_SES_FROM_EMAIL }
  );

  // Format recipient addresses
  const toAddresses = formatEmailAddresses(options.to);
  const ccAddresses = options.cc ? formatEmailAddresses(options.cc) : undefined;
  const bccAddresses = options.bcc ? formatEmailAddresses(options.bcc) : undefined;

  // Prepare email content
  const emailParams = {
    Source: fromEmail,
    Destination: {
      ToAddresses: toAddresses,
      CcAddresses: ccAddresses,
      BccAddresses: bccAddresses,
    },
    Message: {
      Subject: {
        Data: options.subject,
        Charset: 'UTF-8',
      },
      Body: {
        Text: options.text
          ? {
              Data: options.text,
              Charset: 'UTF-8',
            }
          : undefined,
        Html: options.html
          ? {
              Data: options.html,
              Charset: 'UTF-8',
            }
          : undefined,
      },
    },
    ReplyToAddresses: options.replyTo ? [formatEmailAddress(options.replyTo)] : undefined,
  };

  const command = new SendEmailCommand(emailParams);
  const response = await SES.send(command);

  return {
    ...options,
    messageId: response.MessageId,
  };
};

export { sendEmail };
