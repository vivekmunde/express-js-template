import { User } from '@prisma/client';
import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    sessionUser?: User;
  }

  interface ParamsDictionary {
    organizationId: string;
    roleId: string;
    userId: string;
  }
}
