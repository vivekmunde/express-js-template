import { protectedSystemRouteHandler } from '@/route-handlers/protected-system-route-handler';
import { Router } from 'express';
import { DELETE } from './delete';
import { GET } from './get';
import { PUT } from './put';

const systemOrganizationRoutes = Router();

systemOrganizationRoutes.get(
  '/system/organizations/:organizationId',
  protectedSystemRouteHandler(GET, ['READ_ORGANIZATION'])
);

systemOrganizationRoutes.put(
  '/system/organizations/:organizationId',
  protectedSystemRouteHandler(PUT, ['MANAGE_ORGANIZATION'])
);

systemOrganizationRoutes.delete(
  '/system/organizations/:organizationId',
  protectedSystemRouteHandler(DELETE, ['MANAGE_ORGANIZATION'])
);

export { systemOrganizationRoutes };
