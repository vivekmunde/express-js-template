import { protectedRouteHandler } from '@/route-handlers/protected-route-handler';
import { Router } from 'express';
import { GET } from './get';

const meOrganizationsRoutes = Router();

meOrganizationsRoutes.get('/me/organizations', protectedRouteHandler(GET));

export { meOrganizationsRoutes };
