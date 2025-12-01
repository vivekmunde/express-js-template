export type TPostVerifyOtpRequestData = {
  otp: string;
};

export type TPostVerifyOtpResponseData = undefined;

export type TPostVerifyOtpResponseErrorCode = 'INVALID_TOKEN' | 'INVALID_OTP';
