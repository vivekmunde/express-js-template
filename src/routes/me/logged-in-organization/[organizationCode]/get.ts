import { ifAuthorized } from '@/request/if-authorized';
import { ifOrganizationExists } from '@/request/if-exists';
import { isActorAuthorizedToAccessOrganization } from '@/services/rbac/organization/is-actor-authorized-to-access-organization';
import { TProtectedRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TGetOrganizationResponseData } from './interfaces';

const GET = async (req: Request, res: Response, context: TProtectedRequestContext) => {
  const sessionUser = context.sessionUser;
  const organizationCode = req.params.organizationCode;

  return ifOrganizationExists(req, res, { code: organizationCode }, async (organizationData) => {
    return ifAuthorized(
      req,
      res,
      () => {
        return isActorAuthorizedToAccessOrganization(sessionUser.id, organizationData.id);
      },
      async () => {
        const responseBody: TResponseBody<TGetOrganizationResponseData> = {
          data: {
            id: organizationData.id,
            name: organizationData.name,
            code: organizationData.code,
            theme: {
              light: {
                colors: {
                  primary: organizationData.theme?.light?.colors?.primary ?? undefined,
                  primaryForeground:
                    organizationData.theme?.light?.colors?.primaryForeground ?? undefined,
                  link: organizationData.theme?.light?.colors?.link ?? undefined,
                },
              },
              dark: {
                colors: {
                  primary: organizationData.theme?.dark?.colors?.primary ?? undefined,
                  primaryForeground:
                    organizationData.theme?.dark?.colors?.primaryForeground ?? undefined,
                  link: organizationData.theme?.dark?.colors?.link ?? undefined,
                },
              },
            },
          },
        };

        return res.json(responseBody);
      }
    );
  });
};

export { GET };
