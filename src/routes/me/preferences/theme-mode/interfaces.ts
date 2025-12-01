import { TErrorCode } from '@/types/error-code';

export type TPutThemeModePreferenceRequestData = {
  themeMode: string;
};

export type TPutThemeModePreferenceResponseData = {
  themeMode?: string;
};

export type TPutThemeModePreferenceResponseErrorCode = TErrorCode;
