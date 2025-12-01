import { ifAuthorized } from '@/request/if-authorized';
import { isSystemActorAuthorizedToModifyUserRoles } from '@/services/rbac/system/is-actor-authorized-to-modify-user-roles';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TGetAuthorizedToModifyUserResponseData } from './interfaces';

const GET = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  return ifAuthorized(
    req,
    res,
    () => {
      return isSystemActorAuthorizedToModifyUserRoles(context.sessionUser.id, req.params.userId);
    },
    async () => {
      const responseBody: TResponseBody<TGetAuthorizedToModifyUserResponseData> = {
        data: {
          authorized: true,
        },
      };

      return res.json(responseBody);
    }
  );
};

export { GET };
