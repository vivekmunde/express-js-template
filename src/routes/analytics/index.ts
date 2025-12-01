import { publicRouteHandler } from '@/route-handlers/public-route-handler';
import { Router } from 'express';
import { POST } from './post';

const analyticsRoutes = Router();

analyticsRoutes.post('/analytics', publicRouteHandler(POST));

export { analyticsRoutes };
