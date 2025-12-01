import { STATUS_CODES } from '@/constants/status-codes';
import { Express } from 'express';
import { organizationDocumentStatusesRoutes } from './[organizationId]/document-statuses';
import { organizationDocumentStatusRoutes } from './[organizationId]/document-statuses/[documentStatusId]';
import { organizationDocumentStatusDisabledRoutes } from './[organizationId]/document-statuses/[documentStatusId]/disabled';
import { organizationDocumentTypesRoutes } from './[organizationId]/document-types';
import { organizationDocumentTypeRoutes } from './[organizationId]/document-types/[documentTypeId]';
import { organizationDocumentTypeDisabledRoutes } from './[organizationId]/document-types/[documentTypeId]/disabled';
import { organizationProjectsRoutes } from './[organizationId]/projects';
import { organizationProjectRoutes } from './[organizationId]/projects/[projectId]';
import { organizationDocumentCommentsRoutes } from './[organizationId]/projects/[projectId]/documents/[documentId]/document-comments';
import { organizationDocumentCommentRoutes } from './[organizationId]/projects/[projectId]/documents/[documentId]/document-comments/[documentCommentId]';
import { organizationDocumentSectionsRoutes } from './[organizationId]/projects/[projectId]/documents/[documentId]/document-sections';
import { organizationDocumentSectionRoutes } from './[organizationId]/projects/[projectId]/documents/[documentId]/document-sections/[documentSectionId]';
import { organizationAuthorizedToModifyUserRoutes } from './[organizationId]/rbac/authorized-to-modify-user/[userId]';
import { organizationRolesRoutes } from './[organizationId]/roles';
import { organizationRoleRoutes } from './[organizationId]/roles/[roleId]';
import { organizationUsersRoutes } from './[organizationId]/users';
import { organizationUserRoutes } from './[organizationId]/users/[userId]';
import { analyticsRoutes } from './analytics';
import { authLogoutRoutes } from './auth/logout';
import { authResendOtpRoutes } from './auth/resend-otp';
import { authSessionRoutes } from './auth/session';
import { authSessionResetRoutes } from './auth/session/reset';
import { authVerifyEmailRoutes } from './auth/verify-email';
import { authVerifyOtpRoutes } from './auth/verify-otp';
import { uiErrorsRoutes } from './errors/ui';
import { heartBeatRoutes } from './heart-beat';
import { meRoutes } from './me';
import { meLoggedInOrganizationRoutes } from './me/logged-in-organization/[organizationCode]';
import { meNameRoutes } from './me/name';
import { meOrganizationsRoutes } from './me/organizations';
import { meOrganizationAccessiblePermissionsRoutes } from './me/organizations/[organizationId]/accessible-permissions';
import { meOrganizationsAccessibleRolesRoutes } from './me/organizations/[organizationId]/accessible-roles';
import { meLanguagePreferenceRoutes } from './me/preferences/language';
import { meThemeModePreferenceRoutes } from './me/preferences/theme-mode';
import { meSystemAccessiblePermissionsRoutes } from './me/system/accessible-permissions';
import { meSystemAccessibleRolesRoutes } from './me/system/accessible-roles';
import { systemAPIErrorsRoutes } from './system/errors/api';
import { systemUIErrorsRoutes } from './system/errors/ui';
import { systemOrganizationsRoutes } from './system/organizations';
import { systemOrganizationRoutes } from './system/organizations/[organizationId]';
import { systemOrphanUsersRoutes } from './system/orphan-users';
import { systemOrphanUserRoutes } from './system/orphan-users/[userId]';
import { systemAuthorizedToModifyUserRoutes } from './system/rbac/authorized-to-modify-user/[userId]';
import { systemRolesRoutes } from './system/roles';
import { systemRoleRoutes } from './system/roles/[roleId]';
import { systemUsersRoutes } from './system/users';
import { systemUserRoutes } from './system/users/[userId]';

const baseRoutePrefix = '/:lng';

const routes = (app: Express) => {
  /*********************************************************************************
   * Public routes
   *********************************************************************************/
  app.use(baseRoutePrefix, uiErrorsRoutes);
  app.use(baseRoutePrefix, heartBeatRoutes);

  /*********************************************************************************
   * Auth routes
   *********************************************************************************/
  app.use(baseRoutePrefix, authVerifyEmailRoutes);
  app.use(baseRoutePrefix, authVerifyOtpRoutes);
  app.use(baseRoutePrefix, authResendOtpRoutes);
  app.use(baseRoutePrefix, authSessionRoutes);
  app.use(baseRoutePrefix, authSessionResetRoutes);
  app.use(baseRoutePrefix, authLogoutRoutes);

  /*********************************************************************************
   * Analytics routes
   *********************************************************************************/
  app.use(baseRoutePrefix, analyticsRoutes);

  /*********************************************************************************
   * Me routes
   *********************************************************************************/
  app.use(baseRoutePrefix, meRoutes);
  app.use(baseRoutePrefix, meLoggedInOrganizationRoutes);
  app.use(baseRoutePrefix, meNameRoutes);
  app.use(baseRoutePrefix, meOrganizationsRoutes);
  app.use(baseRoutePrefix, meOrganizationsAccessibleRolesRoutes);
  app.use(baseRoutePrefix, meOrganizationAccessiblePermissionsRoutes);
  app.use(baseRoutePrefix, meLanguagePreferenceRoutes);
  app.use(baseRoutePrefix, meThemeModePreferenceRoutes);
  app.use(baseRoutePrefix, meSystemAccessiblePermissionsRoutes);
  app.use(baseRoutePrefix, meSystemAccessibleRolesRoutes);

  /*********************************************************************************
   * System routes
   *********************************************************************************/
  app.use(baseRoutePrefix, systemAPIErrorsRoutes);
  app.use(baseRoutePrefix, systemUIErrorsRoutes);
  app.use(baseRoutePrefix, systemOrganizationsRoutes);
  app.use(baseRoutePrefix, systemOrganizationRoutes);
  app.use(baseRoutePrefix, systemOrphanUsersRoutes);
  app.use(baseRoutePrefix, systemOrphanUserRoutes);
  app.use(baseRoutePrefix, systemAuthorizedToModifyUserRoutes);
  app.use(baseRoutePrefix, systemRolesRoutes);
  app.use(baseRoutePrefix, systemRoleRoutes);
  app.use(baseRoutePrefix, systemUsersRoutes);
  app.use(baseRoutePrefix, systemUserRoutes);

  /*********************************************************************************
   * Organization routes
   *********************************************************************************/
  app.use(baseRoutePrefix, organizationAuthorizedToModifyUserRoutes);
  app.use(baseRoutePrefix, organizationRolesRoutes);
  app.use(baseRoutePrefix, organizationRoleRoutes);
  app.use(baseRoutePrefix, organizationUsersRoutes);
  app.use(baseRoutePrefix, organizationUserRoutes);
  app.use(baseRoutePrefix, organizationProjectsRoutes);
  app.use(baseRoutePrefix, organizationProjectRoutes);
  app.use(baseRoutePrefix, organizationDocumentTypesRoutes);
  app.use(baseRoutePrefix, organizationDocumentTypeRoutes);
  app.use(baseRoutePrefix, organizationDocumentTypeDisabledRoutes);
  app.use(baseRoutePrefix, organizationDocumentStatusesRoutes);
  app.use(baseRoutePrefix, organizationDocumentStatusRoutes);
  app.use(baseRoutePrefix, organizationDocumentStatusDisabledRoutes);
  app.use(baseRoutePrefix, organizationDocumentSectionsRoutes);
  app.use(baseRoutePrefix, organizationDocumentSectionRoutes);
  app.use(baseRoutePrefix, organizationDocumentCommentsRoutes);
  app.use(baseRoutePrefix, organizationDocumentCommentRoutes);

  /*********************************************************************************
   * 404 handler - must be last
   *********************************************************************************/
  app.all('*', (req, res) => {
    res.status(STATUS_CODES.NOT_FOUND).json({
      error: {
        code: 'NOT_FOUND',
        message: req.t('NOT_FOUND', { ns: 'error-codes' }),
      },
    });
  });
};

export { routes };
