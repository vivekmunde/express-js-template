import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { GET } from './get';
import { POST } from './post';

const organizationDocumentTypesRoutes = Router();

organizationDocumentTypesRoutes.get(
  '/:organizationId/document-types',
  protectedOrganizationRouteHandler(GET, ['READ_DOCUMENT_TYPE'])
);

organizationDocumentTypesRoutes.post(
  '/:organizationId/document-types',
  protectedOrganizationRouteHandler(POST, ['MANAGE_DOCUMENT_TYPE'])
);

export { organizationDocumentTypesRoutes };
