import { protectedSystemRouteHandler } from '@/route-handlers/protected-system-route-handler';
import { Router } from 'express';
import { GET } from './get';
import { POST } from './post';

const systemUsersRoutes = Router();

systemUsersRoutes.get('/system/users', protectedSystemRouteHandler(GET, ['READ_USER']));
systemUsersRoutes.post('/system/users', protectedSystemRouteHandler(POST, ['MANAGE_USER']));

export { systemUsersRoutes };
