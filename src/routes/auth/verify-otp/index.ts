import { publicRouteHandler } from '@/route-handlers/public-route-handler';
import { Router } from 'express';
import { POST } from './post';

const authVerifyOtpRoutes = Router();

authVerifyOtpRoutes.post('/auth/verify-otp', publicRouteHandler(POST));

export { authVerifyOtpRoutes };
