import { protectedSystemRouteHandler } from '@/route-handlers/protected-system-route-handler';
import { Router } from 'express';
import { GET } from './get';

const systemAuthorizedToModifyUserRoutes = Router();

systemAuthorizedToModifyUserRoutes.get(
  '/system/rbac/authorized-to-modify-user/:userId',
  protectedSystemRouteHandler(GET, ['MANAGE_USER'])
);

export { systemAuthorizedToModifyUserRoutes };
