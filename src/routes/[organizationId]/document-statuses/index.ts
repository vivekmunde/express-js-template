import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { GET } from './get';
import { POST } from './post';

const organizationDocumentStatusesRoutes = Router();

organizationDocumentStatusesRoutes.get(
  '/:organizationId/document-statuses',
  protectedOrganizationRouteHandler(GET, ['READ_DOCUMENT_STATUS'])
);

organizationDocumentStatusesRoutes.post(
  '/:organizationId/document-statuses',
  protectedOrganizationRouteHandler(POST, ['MANAGE_DOCUMENT_STATUS'])
);

export { organizationDocumentStatusesRoutes };
