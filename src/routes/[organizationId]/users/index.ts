import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { GET } from './get';
import { POST } from './post';

const organizationUsersRoutes = Router();

organizationUsersRoutes.get(
  '/:organizationId/users',
  protectedOrganizationRouteHandler(GET, ['READ_USER'])
);

organizationUsersRoutes.post(
  '/:organizationId/users',
  protectedOrganizationRouteHandler(POST, ['MANAGE_USER'])
);

export { organizationUsersRoutes };
