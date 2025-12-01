import { protectedSystemRouteHandler } from '@/route-handlers/protected-system-route-handler';
import { Router } from 'express';
import { DELETE } from './delete';

const systemOrphanUserRoutes = Router();

systemOrphanUserRoutes.delete(
  '/system/orphan-users/:userId',
  protectedSystemRouteHandler(DELETE, ['MANAGE_USER'])
);

export { systemOrphanUserRoutes };
