import { publicRouteHandler } from '@/route-handlers/public-route-handler';
import { Router } from 'express';
import { POST } from './post';

const authVerifyEmailRoutes = Router();

authVerifyEmailRoutes.post('/auth/verify-email', publicRouteHandler(POST));

export { authVerifyEmailRoutes };
