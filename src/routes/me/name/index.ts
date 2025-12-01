import { protectedRouteHandler } from '@/route-handlers/protected-route-handler';
import { Router } from 'express';
import { PUT } from './put';

const meNameRoutes = Router();

meNameRoutes.put('/me/name', protectedRouteHandler(PUT));

export { meNameRoutes };
