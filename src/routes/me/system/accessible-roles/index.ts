import { protectedRouteHandler } from '@/route-handlers/protected-route-handler';
import { Router } from 'express';
import { GET } from './get';

const meSystemAccessibleRolesRoutes = Router();

meSystemAccessibleRolesRoutes.get('/me/system/accessible-roles', protectedRouteHandler(GET));

export { meSystemAccessibleRolesRoutes };
