import { AMAZON_AWS_SES_FROM_EMAIL, AMAZON_AWS_SES_FROM_NAME, HOST_URL } from '@/env';
import { TFunction } from 'i18next';

const html = `
<div style="font-family: Arial, sans-serif; color: #000000; font-size: 14px; padding: 8px 0;">
  <p style="margin: 8px 0;">{{hello}}</p>

  <p style="margin: 8px 0;">{{yourOtpIs}}</p>

  <p style="margin: 16px 0; border: 1px dashed #000; border-radius: 6px; width: 100px; text-align: center; padding: 8px; font-size: 20px; font-weight: 700;">{{otp}}</p>

  <p style="margin: 8px 0;">{{otpValidFor}}</p>

  <p style="font-size: 12px; color: #888; margin: 16px 0;">
    <a href="{{portalUrl}}" target="_blank">{{portalUrl}}</a>
    <br />
    <span>{{copyright}}</span>
  </p>
</div>
`;

const getOtpEmailTemplate = async (
  t: TFunction,
  data: {
    otp: string;
    otpAgeInMinutes?: number;
  }
) => {
  const emailHtml = html
    .replace(new RegExp('{{title}}', 'ig'), t('otp.html.title', { ns: 'emails' }))
    .replace(new RegExp('{{hello}}', 'ig'), t('otp.html.hello', { ns: 'emails' }))
    .replace(new RegExp('{{yourOtpIs}}', 'ig'), t('otp.html.yourOtpIs', { ns: 'emails' }))
    .replace(new RegExp('{{otp}}', 'ig'), data.otp)
    .replace(
      new RegExp('{{otpValidFor}}', 'ig'),
      t('otp.html.otpValidFor', {
        ns: 'emails',
        otpAge: data.otpAgeInMinutes ?? 10,
      })
    )
    .replace(new RegExp('{{fromName}}', 'ig'), AMAZON_AWS_SES_FROM_NAME)
    .replace(new RegExp('{{fromEmail}}', 'ig'), AMAZON_AWS_SES_FROM_EMAIL)
    .replace(new RegExp('{{copyright}}', 'ig'), t('copyright', { ns: 'emails' }))
    .replace(new RegExp('{{portalUrl}}', 'ig'), HOST_URL);

  return {
    subject: t('otp.subject', { ns: 'emails', otp: data.otp }),
    html: emailHtml,
    text: `${t('otp.text', { ns: 'emails', otp: data.otp })} ${t('copyright', { ns: 'emails' })}`,
  };
};

export { getOtpEmailTemplate };
