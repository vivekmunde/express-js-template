import { publicRouteHandler } from '@/route-handlers/public-route-handler';
import { Router } from 'express';
import { GET } from './get';

const heartBeatRoutes = Router();

heartBeatRoutes.get('/heart-beat', publicRouteHandler(GET));

export { heartBeatRoutes };
