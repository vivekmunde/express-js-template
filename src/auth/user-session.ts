import { IS_PRODUCTION, USER_SESSION_COOKIE_MAX_AGE, USER_SESSION_COOKIE_NAME } from '@/env';
import { decrypt, encrypt } from '@/utils/crypt';
import { Request, Response } from 'express';

export type TUserSession = {
  userId?: string;
  version: number;
};

const SESSION_VERSION = 1;

const setCookie = (res: Response, value: string) => {
  res.cookie(USER_SESSION_COOKIE_NAME, value, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? 'none' : 'lax',
    maxAge: 1000 * USER_SESSION_COOKIE_MAX_AGE,
  });
};

const updateUserSession = (res: Response, userId: string) => {
  const session: TUserSession = {
    userId,
    version: SESSION_VERSION,
  };

  setCookie(res, encrypt(JSON.stringify(session)));
};

const refreshUserSession = (req: Request, res: Response) => {
  const sessionCookie = req.cookies[USER_SESSION_COOKIE_NAME];

  setCookie(res, sessionCookie);
};

const getUserSession = (req: Request): TUserSession | undefined => {
  const sessionCookie = req.cookies[USER_SESSION_COOKIE_NAME];

  if (!sessionCookie) {
    return undefined;
  }

  const decryptedSessionCookie = decrypt(sessionCookie);

  const session = JSON.parse(decryptedSessionCookie) as TUserSession;

  return session;
};

const isValidUserSession = (req: Request): boolean => {
  const sessionCookie = req.cookies[USER_SESSION_COOKIE_NAME];

  if (!sessionCookie) {
    return false;
  }

  const decryptedSessionCookie = decrypt(sessionCookie);

  const session = JSON.parse(decryptedSessionCookie) as TUserSession;

  return session.version === SESSION_VERSION && (session.userId ?? '').length > 0;
};

const destroyUserSession = (res: Response) => {
  res.clearCookie(USER_SESSION_COOKIE_NAME);
};

export {
  destroyUserSession,
  getUserSession,
  isValidUserSession,
  refreshUserSession,
  updateUserSession,
};
