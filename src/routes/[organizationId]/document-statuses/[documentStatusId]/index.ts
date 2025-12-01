import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { DELETE } from './delete';
import { GET } from './get';
import { PUT } from './put';

const organizationDocumentStatusRoutes = Router();

organizationDocumentStatusRoutes.get(
  '/:organizationId/document-statuses/:documentStatusId',
  protectedOrganizationRouteHandler(GET, ['READ_DOCUMENT_STATUS'])
);

organizationDocumentStatusRoutes.put(
  '/:organizationId/document-statuses/:documentStatusId',
  protectedOrganizationRouteHandler(PUT, ['MANAGE_DOCUMENT_STATUS'])
);

organizationDocumentStatusRoutes.delete(
  '/:organizationId/document-statuses/:documentStatusId',
  protectedOrganizationRouteHandler(DELETE, ['MANAGE_DOCUMENT_STATUS'])
);

export { organizationDocumentStatusRoutes };
