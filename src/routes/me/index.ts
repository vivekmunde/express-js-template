import { protectedRouteHandler } from '@/route-handlers/protected-route-handler';
import { Router } from 'express';
import { GET } from './get';

const meRoutes = Router();

meRoutes.get('/me', protectedRouteHandler(GET));

export { meRoutes };
