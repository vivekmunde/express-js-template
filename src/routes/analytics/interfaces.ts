import { TErrorCode } from '@/types/error-code';

export type TPostAnalyticsEventRequestData<
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  TMetaData extends Record<string, unknown> = {},
> = {
  organizationId?: string;
  view: string;
  event: string;
  label?: string;
  metadata?: TMetaData;
};

export type TPostAnalyticsEventResponseData = {
  id: string;
};

export type TPostAnalyticsEventResponseErrorCode = TErrorCode;
