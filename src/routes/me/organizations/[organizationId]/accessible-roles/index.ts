import { protectedRouteHandler } from '@/route-handlers/protected-route-handler';
import { Router } from 'express';
import { GET } from './get';

const meOrganizationsAccessibleRolesRoutes = Router();

meOrganizationsAccessibleRolesRoutes.get(
  '/me/organizations/:organizationId/accessible-roles',
  protectedRouteHandler(GET)
);

export { meOrganizationsAccessibleRolesRoutes };
