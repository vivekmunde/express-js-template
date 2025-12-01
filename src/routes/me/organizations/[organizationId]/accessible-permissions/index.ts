import { protectedRouteHandler } from '@/route-handlers/protected-route-handler';
import { Router } from 'express';
import { GET } from './get';

const meOrganizationAccessiblePermissionsRoutes = Router();

meOrganizationAccessiblePermissionsRoutes.get(
  '/me/organizations/:organizationId/accessible-permissions',
  protectedRouteHandler(GET)
);

export { meOrganizationAccessiblePermissionsRoutes };
