export type TGetSessionResponseData = {
  step: 'verify-email' | 'verify-otp';
  otpSentAt?: number;
  otpInterval?: number;
};

export type TGetSessionResponseErrorCode = 'SESSION_EXPIRED';
