import { publicRouteHandler } from '@/route-handlers/public-route-handler';
import { Router } from 'express';
import { POST } from './post';

const uiErrorsRoutes = Router();

uiErrorsRoutes.post('/errors/ui', publicRouteHandler(POST));

export { uiErrorsRoutes };
