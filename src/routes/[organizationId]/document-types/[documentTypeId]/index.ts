import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { DELETE } from './delete';
import { GET } from './get';
import { PUT } from './put';

const organizationDocumentTypeRoutes = Router();

organizationDocumentTypeRoutes.get(
  '/:organizationId/document-types/:documentTypeId',
  protectedOrganizationRouteHandler(GET, ['READ_DOCUMENT_TYPE'])
);

organizationDocumentTypeRoutes.put(
  '/:organizationId/document-types/:documentTypeId',
  protectedOrganizationRouteHandler(PUT, ['MANAGE_DOCUMENT_TYPE'])
);

organizationDocumentTypeRoutes.delete(
  '/:organizationId/document-types/:documentTypeId',
  protectedOrganizationRouteHandler(DELETE, ['MANAGE_DOCUMENT_TYPE'])
);

export { organizationDocumentTypeRoutes };
