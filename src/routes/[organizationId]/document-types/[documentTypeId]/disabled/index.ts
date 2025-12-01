import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { PUT } from './put';

const organizationDocumentTypeDisabledRoutes = Router();

organizationDocumentTypeDisabledRoutes.put(
  '/:organizationId/document-types/:documentTypeId/disabled',
  protectedOrganizationRouteHandler(PUT, ['MANAGE_DOCUMENT_TYPE'])
);

export { organizationDocumentTypeDisabledRoutes };
