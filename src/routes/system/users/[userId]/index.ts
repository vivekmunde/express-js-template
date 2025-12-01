import { protectedSystemRouteHandler } from '@/route-handlers/protected-system-route-handler';
import { Router } from 'express';
import { GET } from './get';
import { PUT } from './put';

const systemUserRoutes = Router();

systemUserRoutes.get('/system/users/:userId', protectedSystemRouteHandler(GET, ['READ_USER']));
systemUserRoutes.put('/system/users/:userId', protectedSystemRouteHandler(PUT, ['MANAGE_USER']));

export { systemUserRoutes };
