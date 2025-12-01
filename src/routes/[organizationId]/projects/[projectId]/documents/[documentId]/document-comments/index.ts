import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { GET } from './get';
import { POST } from './post';

const organizationDocumentCommentsRoutes = Router();

organizationDocumentCommentsRoutes.get(
  '/:organizationId/projects/:projectId/documents/:documentId/comments',
  protectedOrganizationRouteHandler(GET, ['READ_DOCUMENT'])
);

organizationDocumentCommentsRoutes.post(
  '/:organizationId/projects/:projectId/documents/:documentId/comments',
  protectedOrganizationRouteHandler(POST, ['MANAGE_DOCUMENT'])
);

export { organizationDocumentCommentsRoutes };
