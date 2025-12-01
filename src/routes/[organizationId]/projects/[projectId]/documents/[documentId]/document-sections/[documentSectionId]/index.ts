import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { DELETE } from './delete';
import { GET } from './get';
import { PUT } from './put';

const organizationDocumentSectionRoutes = Router();

organizationDocumentSectionRoutes.get(
  '/:organizationId/projects/:projectId/documents/:documentId/sections/:documentSectionId',
  protectedOrganizationRouteHandler(GET, ['READ_DOCUMENT'])
);

organizationDocumentSectionRoutes.put(
  '/:organizationId/projects/:projectId/documents/:documentId/sections/:documentSectionId',
  protectedOrganizationRouteHandler(PUT, ['MANAGE_DOCUMENT'])
);

organizationDocumentSectionRoutes.delete(
  '/:organizationId/projects/:projectId/documents/:documentId/sections/:documentSectionId',
  protectedOrganizationRouteHandler(DELETE, ['MANAGE_DOCUMENT'])
);

export { organizationDocumentSectionRoutes };
