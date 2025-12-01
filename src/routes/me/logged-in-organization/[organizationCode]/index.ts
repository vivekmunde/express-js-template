import { protectedRouteHandler } from '@/route-handlers/protected-route-handler';
import { Router } from 'express';
import { GET } from './get';

const meLoggedInOrganizationRoutes = Router();

meLoggedInOrganizationRoutes.get(
  '/me/logged-in-organization/:organizationCode',
  protectedRouteHandler(GET)
);

export { meLoggedInOrganizationRoutes };
