import { ifOrganizationExists } from '@/request/if-exists';
import { TPermission } from '@/types/rbac';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TGetOrganizationResponseData } from './interfaces';

const GET = async (req: Request, res: Response) => {
  return ifOrganizationExists(
    req,
    res,
    { id: req.params.organizationId },
    async (organizationData) => {
      const responseBody: TResponseBody<TGetOrganizationResponseData> = {
        data: {
          id: organizationData.id,
          name: organizationData.name,
          code: organizationData.code,
          email: organizationData.email ?? undefined,
          permissionKeys: organizationData.permissionKeys as TPermission[],
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
};

export { GET };
