import { publicRouteHandler } from '@/route-handlers/public-route-handler';
import { Router } from 'express';
import { POST } from './post';

const authResendOtpRoutes = Router();

authResendOtpRoutes.post('/auth/resend-otp', publicRouteHandler(POST));

export { authResendOtpRoutes };
