import { protectedSystemRouteHandler } from '@/route-handlers/protected-system-route-handler';
import { Router } from 'express';
import { GET } from './get';
import { POST } from './post';

const systemRolesRoutes = Router();

systemRolesRoutes.get('/system/roles', protectedSystemRouteHandler(GET, ['READ_ROLE']));
systemRolesRoutes.post('/system/roles', protectedSystemRouteHandler(POST, ['MANAGE_ROLE']));

export { systemRolesRoutes };
