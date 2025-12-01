import {
  IS_PRODUCTION,
  USER_LOGIN_SESSION_COOKIE_MAX_AGE,
  USER_LOGIN_SESSION_COOKIE_NAME,
} from '@/env';
import { decrypt, encrypt } from '@/utils/crypt';
import { Request, Response } from 'express';

export type TUserLoginSession = {
  token?: string;
  version: number;
};

const SESSION_VERSION = 1;

const setCookie = (res: Response, value: string) => {
  res.cookie(USER_LOGIN_SESSION_COOKIE_NAME, value, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? 'none' : 'lax',
    maxAge: 1000 * USER_LOGIN_SESSION_COOKIE_MAX_AGE,
  });
};

const updateUserLoginSession = (res: Response, token: string) => {
  const session: TUserLoginSession = {
    token,
    version: SESSION_VERSION,
  };

  setCookie(res, encrypt(JSON.stringify(session)));
};

const refreshUserLoginSession = (req: Request, res: Response) => {
  const sessionCookie = req.cookies[USER_LOGIN_SESSION_COOKIE_NAME];

  setCookie(res, sessionCookie);
};

const getUserLoginSession = (req: Request): TUserLoginSession | undefined => {
  const sessionCookie = req.cookies[USER_LOGIN_SESSION_COOKIE_NAME];

  if (!sessionCookie) {
    return undefined;
  }

  const decryptedSessionCookie = decrypt(sessionCookie);

  const session = JSON.parse(decryptedSessionCookie) as TUserLoginSession;

  return session;
};

const isValidUserLoginSession = (req: Request): boolean => {
  const sessionCookie = req.cookies[USER_LOGIN_SESSION_COOKIE_NAME];

  if (!sessionCookie) {
    return false;
  }

  const decryptedSessionCookie = decrypt(sessionCookie);

  const session = JSON.parse(decryptedSessionCookie) as TUserLoginSession;

  return session.version === SESSION_VERSION && (session.token ?? '').length > 0;
};

const destroyUserLoginSession = (res: Response) => {
  res.clearCookie(USER_LOGIN_SESSION_COOKIE_NAME);
};

export {
  destroyUserLoginSession,
  getUserLoginSession,
  isValidUserLoginSession,
  refreshUserLoginSession,
  updateUserLoginSession,
};
