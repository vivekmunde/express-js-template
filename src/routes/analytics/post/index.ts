import { prisma } from '@/prisma';
import { ifValidRequestValues } from '@/request/if-valid-request-values';
import { TPublicRequestContext } from '@/types/request';
import { TResponseBody } from '@/types/response-body';
import { Request, Response } from 'express';
import { TPostAnalyticsEventResponseData } from '../interfaces';
import { getCreateAnalyticsEventValidationSchema } from '../validation';
import { recordOrganizationStatistics } from './record-organization-statistics';
import { recordOrganizationUserStatistics } from './record-organization-user-statistics';

const POST = async (req: Request, res: Response, context: TPublicRequestContext) => {
  return ifValidRequestValues(
    req,
    res,
    await getCreateAnalyticsEventValidationSchema(req),
    async (data) => {
      const forwarded = req.headers['x-forwarded-for'] as string;
      const ip = forwarded?.split(',')[0]?.trim();
      const userAgent = req.headers['user-agent'];
      const url = req.headers['referer'];

      const viewHierarchy = data.view.split('.');
      const parentView =
        viewHierarchy.length > 1 ? viewHierarchy.slice(0, -1).join('.') : data.view;

      const createdErrorData = await prisma.analytics.create({
        data: {
          view: data.view,
          parentView,
          event: data.event,
          label: data.label,
          metadata: JSON.parse(JSON.stringify(data.metadata ?? {})),
          userAgent,
          url,
          ip,
          language: context.language,
          userId: context.sessionUser?.id,
          organizationId: data.organizationId,
          createdBy: context.sessionUser?.id,
        },
      });

      await Promise.all([
        data.organizationId
          ? await recordOrganizationStatistics({
              ...data,
              language: context.language,
              organizationId: data.organizationId,
            })
          : undefined,
        data.organizationId && context.sessionUser?.id
          ? await recordOrganizationUserStatistics({
              ...data,
              language: context.language,
              organizationId: data.organizationId,
              userId: context.sessionUser.id,
            })
          : undefined,
      ]);

      const responseBody: TResponseBody<TPostAnalyticsEventResponseData> = {
        data: {
          id: createdErrorData.id,
        },
      };

      return res.json(responseBody);
    }
  );
};

export { POST };
