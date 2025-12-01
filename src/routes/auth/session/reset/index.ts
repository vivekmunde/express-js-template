import { publicRouteHandler } from '@/route-handlers/public-route-handler';
import { Router } from 'express';
import { POST } from './post';

const authSessionResetRoutes = Router();

authSessionResetRoutes.post('/auth/session/reset', publicRouteHandler(POST));

export { authSessionResetRoutes };
