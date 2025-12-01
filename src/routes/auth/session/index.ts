import { publicRouteHandler } from '@/route-handlers/public-route-handler';
import { Router } from 'express';
import { GET } from './get';

const authSessionRoutes = Router();

authSessionRoutes.get('/auth/session', publicRouteHandler(GET));

export { authSessionRoutes };
