import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { GET } from './get';
import { POST } from './post';

const organizationProjectsRoutes = Router();

organizationProjectsRoutes.get(
  '/:organizationId/projects',
  protectedOrganizationRouteHandler(GET, ['READ_PROJECT'])
);

organizationProjectsRoutes.post(
  '/:organizationId/projects',
  protectedOrganizationRouteHandler(POST, ['MANAGE_PROJECT'])
);

export { organizationProjectsRoutes };
