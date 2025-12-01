import { protectedSystemRouteHandler } from '@/route-handlers/protected-system-route-handler';
import { Router } from 'express';
import { GET } from './get';

const systemAPIErrorsRoutes = Router();

systemAPIErrorsRoutes.get('/system/errors/api', protectedSystemRouteHandler(GET, ['READ_ERROR']));

export { systemAPIErrorsRoutes };
