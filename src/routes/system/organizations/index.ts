import { protectedSystemRouteHandler } from '@/route-handlers/protected-system-route-handler';
import { Router } from 'express';
import { GET } from './get';
import { POST } from './post';

const systemOrganizationsRoutes = Router();

systemOrganizationsRoutes.get(
  '/system/organizations',
  protectedSystemRouteHandler(GET, ['READ_ORGANIZATION'])
);

systemOrganizationsRoutes.post(
  '/system/organizations',
  protectedSystemRouteHandler(POST, ['MANAGE_ORGANIZATION'])
);

export { systemOrganizationsRoutes };
