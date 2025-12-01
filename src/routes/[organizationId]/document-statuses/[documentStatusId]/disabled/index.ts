import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { PUT } from './put';

const organizationDocumentStatusDisabledRoutes = Router();

organizationDocumentStatusDisabledRoutes.put(
  '/:organizationId/document-statuses/:documentStatusId/disabled',
  protectedOrganizationRouteHandler(PUT, ['MANAGE_DOCUMENT_STATUS'])
);

export { organizationDocumentStatusDisabledRoutes };
