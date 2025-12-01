import { protectedSystemRouteHandler } from '@/route-handlers/protected-system-route-handler';
import { Router } from 'express';
import { GET } from './get';

const systemOrphanUsersRoutes = Router();

systemOrphanUsersRoutes.get(
  '/system/orphan-users',
  protectedSystemRouteHandler(GET, ['READ_USER'])
);

export { systemOrphanUsersRoutes };
