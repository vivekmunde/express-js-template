import { prisma } from '@/prisma';
import { TLanguage } from '@/types/language';
import { TPostAnalyticsEventRequestData } from '../interfaces';

type TData = TPostAnalyticsEventRequestData & {
  language: TLanguage;
  organizationId: string;
};
async function fixOrganizationDuplicateHourlyStatistics(hour: Date, data: TData) {
  const { organizationId, view, event } = data;

  const analyticsHourlyOrgStats = await prisma.analyticsHourlyOrgStats.findMany({
    where: {
      organizationId,
      hour,
      view,
      event,
    },
  });

  if (analyticsHourlyOrgStats.length > 1) {
    const count = analyticsHourlyOrgStats.reduce((acc, curr) => acc + curr.count, 0);

    await prisma.analyticsHourlyOrgStats.update({
      where: {
        id: analyticsHourlyOrgStats[0].id,
      },
      data: {
        count,
      },
    });

    await prisma.analyticsHourlyOrgStats.deleteMany({
      where: {
        id: {
          in: analyticsHourlyOrgStats.slice(1).map((stat) => stat.id),
        },
      },
    });
  }
}

async function fixOrganizationDuplicateDailyStatistics(day: Date, data: TData) {
  const { organizationId, view, event } = data;

  const analyticsDailyOrgStats = await prisma.analyticsDailyOrgStats.findMany({
    where: {
      organizationId,
      day,
      view,
      event,
    },
  });

  if (analyticsDailyOrgStats.length > 1) {
    const count = analyticsDailyOrgStats.reduce((acc, curr) => acc + curr.count, 0);

    await prisma.analyticsDailyOrgStats.update({
      where: {
        id: analyticsDailyOrgStats[0].id,
      },
      data: {
        count,
      },
    });

    await prisma.analyticsDailyOrgStats.deleteMany({
      where: {
        id: {
          in: analyticsDailyOrgStats.slice(1).map((stat) => stat.id),
        },
      },
    });
  }
}

async function fixOrganizationDuplicateMonthlyStatistics(month: Date, data: TData) {
  const { organizationId, view, event } = data;

  const analyticsMonthlyOrgStats = await prisma.analyticsMonthlyOrgStats.findMany({
    where: {
      organizationId,
      month,
      view,
      event,
    },
  });

  if (analyticsMonthlyOrgStats.length > 1) {
    const count = analyticsMonthlyOrgStats.reduce((acc, curr) => acc + curr.count, 0);

    await prisma.analyticsMonthlyOrgStats.update({
      where: {
        id: analyticsMonthlyOrgStats[0].id,
      },
      data: {
        count,
      },
    });

    await prisma.analyticsMonthlyOrgStats.deleteMany({
      where: {
        id: {
          in: analyticsMonthlyOrgStats.slice(1).map((stat) => stat.id),
        },
      },
    });
  }
}

async function recordOrganizationHourlyStatistics(data: TData) {
  const { organizationId, view, event } = data;
  const hour = new Date(new Date().setUTCMinutes(0, 0, 0));

  const analyticsHourlyOrgStats = await prisma.analyticsHourlyOrgStats.findFirst({
    where: {
      organizationId,
      hour,
      view,
      event,
    },
  });

  if (analyticsHourlyOrgStats?.id) {
    await prisma.analyticsHourlyOrgStats.update({
      where: {
        id: analyticsHourlyOrgStats.id,
        hour,
        view,
        event,
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
  } else {
    await prisma.analyticsHourlyOrgStats.create({
      data: {
        organizationId,
        hour,
        view,
        event,
        count: 1,
      },
    });
  }

  fixOrganizationDuplicateHourlyStatistics(hour, data);
}

async function recordOrganizationDailyStatistics(data: TData) {
  const { organizationId, view, event } = data;
  const day = new Date(new Date().setUTCHours(0, 0, 0, 0));

  const analyticsDailyOrgStats = await prisma.analyticsDailyOrgStats.findFirst({
    where: {
      organizationId,
      day,
      view,
      event,
    },
  });

  if (analyticsDailyOrgStats?.id) {
    await prisma.analyticsDailyOrgStats.update({
      where: {
        id: analyticsDailyOrgStats.id,
        day,
        view,
        event,
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
  } else {
    await prisma.analyticsDailyOrgStats.create({
      data: {
        organizationId,
        day,
        view,
        event,
        count: 1,
      },
    });
  }

  fixOrganizationDuplicateDailyStatistics(day, data);
}

async function recordOrganizationMonthlyStatistics(data: TData) {
  const { organizationId, view, event } = data;
  const month = new Date(new Date(new Date().setUTCDate(1)).setUTCHours(0, 0, 0, 0));

  const analyticsMonthlyOrgStats = await prisma.analyticsMonthlyOrgStats.findFirst({
    where: {
      organizationId,
      month,
      view,
      event,
    },
  });

  if (analyticsMonthlyOrgStats?.id) {
    await prisma.analyticsMonthlyOrgStats.update({
      where: {
        id: analyticsMonthlyOrgStats.id,
        month,
        view,
        event,
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
  } else {
    await prisma.analyticsMonthlyOrgStats.create({
      data: {
        organizationId,
        month,
        view,
        event,
        count: 1,
      },
    });
  }

  fixOrganizationDuplicateMonthlyStatistics(month, data);
}

async function recordOrganizationStatistics(data: TData) {
  await Promise.all([
    recordOrganizationHourlyStatistics(data),
    recordOrganizationDailyStatistics(data),
    recordOrganizationMonthlyStatistics(data),
  ]);
}

export { recordOrganizationStatistics };
