import { protectedRouteHandler } from '@/route-handlers/protected-route-handler';
import { Router } from 'express';
import { PUT } from './put';

const meLanguagePreferenceRoutes = Router();

meLanguagePreferenceRoutes.put('/me/preferences/language', protectedRouteHandler(PUT));

export { meLanguagePreferenceRoutes };
