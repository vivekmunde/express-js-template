import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { DELETE } from './delete';
import { GET } from './get';
import { PUT } from './put';

const organizationDocumentCommentRoutes = Router();

organizationDocumentCommentRoutes.get(
  '/:organizationId/projects/:projectId/documents/:documentId/comments/:documentCommentId',
  protectedOrganizationRouteHandler(GET, ['READ_DOCUMENT'])
);

organizationDocumentCommentRoutes.put(
  '/:organizationId/projects/:projectId/documents/:documentId/comments/:documentCommentId',
  protectedOrganizationRouteHandler(PUT, ['MANAGE_DOCUMENT'])
);

organizationDocumentCommentRoutes.delete(
  '/:organizationId/projects/:projectId/documents/:documentId/comments/:documentCommentId',
  protectedOrganizationRouteHandler(DELETE, ['MANAGE_DOCUMENT'])
);

export { organizationDocumentCommentRoutes };
