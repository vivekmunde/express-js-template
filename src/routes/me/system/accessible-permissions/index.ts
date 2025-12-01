import { protectedRouteHandler } from '@/route-handlers/protected-route-handler';
import { Router } from 'express';
import { GET } from './get';

const meSystemAccessiblePermissionsRoutes = Router();

meSystemAccessiblePermissionsRoutes.get(
  '/me/system/accessible-permissions',
  protectedRouteHandler(GET)
);

export { meSystemAccessiblePermissionsRoutes };
