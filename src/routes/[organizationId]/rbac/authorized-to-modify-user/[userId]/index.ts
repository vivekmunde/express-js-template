import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { GET } from './get';

const organizationAuthorizedToModifyUserRoutes = Router();

organizationAuthorizedToModifyUserRoutes.get(
  '/:organizationId/rbac/authorized-to-modify-user/:userId',
  protectedOrganizationRouteHandler(GET, ['MANAGE_USER'])
);

export { organizationAuthorizedToModifyUserRoutes };
