import { protectedSystemRouteHandler } from '@/route-handlers/protected-system-route-handler';
import { Router } from 'express';
import { GET } from './get';

const systemUIErrorsRoutes = Router();

systemUIErrorsRoutes.get('/system/errors/ui', protectedSystemRouteHandler(GET, ['READ_ERROR']));

export { systemUIErrorsRoutes };
