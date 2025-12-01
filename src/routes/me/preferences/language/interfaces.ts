import { TErrorCode } from '@/types/error-code';

export type TPutLanguagePreferenceRequestData = {
  language: string;
};

export type TPutLanguagePreferenceResponseData = {
  language?: string;
};

export type TPutLanguagePreferenceResponseErrorCode = TErrorCode;
