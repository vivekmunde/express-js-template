import { protectedRouteHandler } from '@/route-handlers/protected-route-handler';
import { Router } from 'express';
import { PUT } from './put';

const meThemeModePreferenceRoutes = Router();

meThemeModePreferenceRoutes.put('/me/preferences/theme-mode', protectedRouteHandler(PUT));

export { meThemeModePreferenceRoutes };
