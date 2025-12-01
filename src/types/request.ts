import { User } from '@prisma/client';
import { TLanguage } from './language';

export type TPublicRequestContext = {
  language: TLanguage;
  sessionUser?: User;
};

export type TProtectedRequestContext = {
  language: TLanguage;
  sessionUser: User;
};
