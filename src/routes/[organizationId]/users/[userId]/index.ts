import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { GET } from './get';
import { PUT } from './put';

const organizationUserRoutes = Router();

organizationUserRoutes.get(
  '/:organizationId/users/:userId',
  protectedOrganizationRouteHandler(GET, ['READ_USER'])
);

organizationUserRoutes.put(
  '/:organizationId/users/:userId',
  protectedOrganizationRouteHandler(PUT, ['MANAGE_USER'])
);

export { organizationUserRoutes };
