import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { DELETE } from './delete';
import { GET } from './get';
import { PUT } from './put';

const organizationRoleRoutes = Router();

organizationRoleRoutes.get(
  '/:organizationId/roles/:roleId',
  protectedOrganizationRouteHandler(GET, ['READ_ROLE'])
);

organizationRoleRoutes.put(
  '/:organizationId/roles/:roleId',
  protectedOrganizationRouteHandler(PUT, ['MANAGE_ROLE'])
);

organizationRoleRoutes.delete(
  '/:organizationId/roles/:roleId',
  protectedOrganizationRouteHandler(DELETE, ['MANAGE_ROLE'])
);

export { organizationRoleRoutes };
