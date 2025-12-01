import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { DELETE } from './delete';
import { GET } from './get';
import { PUT } from './put';

const organizationProjectRoutes = Router();

organizationProjectRoutes.get(
  '/:organizationId/projects/:projectId',
  protectedOrganizationRouteHandler(GET, ['READ_PROJECT'])
);

organizationProjectRoutes.put(
  '/:organizationId/projects/:projectId',
  protectedOrganizationRouteHandler(PUT, ['MANAGE_PROJECT'])
);

organizationProjectRoutes.delete(
  '/:organizationId/projects/:projectId',
  protectedOrganizationRouteHandler(DELETE, ['MANAGE_PROJECT'])
);

export { organizationProjectRoutes };
