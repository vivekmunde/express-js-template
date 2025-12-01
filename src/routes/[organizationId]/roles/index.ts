import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { GET } from './get';
import { POST } from './post';

const organizationRolesRoutes = Router();

organizationRolesRoutes.get(
  '/:organizationId/roles',
  protectedOrganizationRouteHandler(GET, ['READ_ROLE'])
);

organizationRolesRoutes.post(
  '/:organizationId/roles',
  protectedOrganizationRouteHandler(POST, ['MANAGE_ROLE'])
);

export { organizationRolesRoutes };
