import { protectedOrganizationRouteHandler } from '@/route-handlers/protected-organization-route-handler';
import { Router } from 'express';
import { GET } from './get';
import { POST } from './post';

const organizationDocumentSectionsRoutes = Router();

organizationDocumentSectionsRoutes.get(
  '/:organizationId/projects/:projectId/documents/:documentId/sections',
  protectedOrganizationRouteHandler(GET, ['READ_DOCUMENT'])
);

organizationDocumentSectionsRoutes.post(
  '/:organizationId/projects/:projectId/documents/:documentId/sections',
  protectedOrganizationRouteHandler(POST, ['MANAGE_DOCUMENT'])
);

export { organizationDocumentSectionsRoutes };
