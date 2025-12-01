import { protectedSystemRouteHandler } from '@/route-handlers/protected-system-route-handler';
import { Router } from 'express';
import { DELETE } from './delete';
import { GET } from './get';
import { PUT } from './put';

const systemRoleRoutes = Router();

systemRoleRoutes.get('/system/roles/:roleId', protectedSystemRouteHandler(GET, ['READ_ROLE']));
systemRoleRoutes.put('/system/roles/:roleId', protectedSystemRouteHandler(PUT, ['MANAGE_ROLE']));
systemRoleRoutes.delete(
  '/system/roles/:roleId',
  protectedSystemRouteHandler(DELETE, ['MANAGE_ROLE'])
);

export { systemRoleRoutes };
