import { publicRouteHandler } from '@/route-handlers/public-route-handler';
import { Router } from 'express';
import { POST } from './post';

const authLogoutRoutes = Router();

authLogoutRoutes.post('/auth/logout', publicRouteHandler(POST));

export { authLogoutRoutes };
