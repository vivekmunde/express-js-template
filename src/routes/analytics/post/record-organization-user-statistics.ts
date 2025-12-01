import { prisma } from '@/prisma';
import { TLanguage } from '@/types/language';
import { TPostAnalyticsEventRequestData } from '../interfaces';

type TData = TPostAnalyticsEventRequestData & {
  language: TLanguage;
  organizationId: string;
  userId: string;
};

async function fixOrganizationUserDuplicateHourlyStatistics(hour: Date, data: TData) {
  const { organizationId, userId, view, event } = data;

  const analyticsHourlyOrgUserStats = await prisma.analyticsHourlyOrgUserStats.findMany({
    where: {
      organizationId,
      userId,
      hour,
      view,
      event,
    },
  });

  if (analyticsHourlyOrgUserStats.length > 1) {
    const count = analyticsHourlyOrgUserStats.reduce((acc, curr) => acc + curr.count, 0);

    await prisma.analyticsHourlyOrgUserStats.update({
      where: {
        id: analyticsHourlyOrgUserStats[0].id,
      },
      data: {
        count,
      },
    });

    await prisma.analyticsHourlyOrgUserStats.deleteMany({
      where: {
        id: {
          in: analyticsHourlyOrgUserStats.slice(1).map((stat) => stat.id),
        },
      },
    });
  }
}

async function fixOrganizationUserDuplicateDailyStatistics(day: Date, data: TData) {
  const { organizationId, userId, view, event } = data;

  const analyticsDailyOrgUserStats = await prisma.analyticsDailyOrgUserStats.findMany({
    where: {
      organizationId,
      userId,
      day,
      view,
      event,
    },
  });

  if (analyticsDailyOrgUserStats.length > 1) {
    const count = analyticsDailyOrgUserStats.reduce((acc, curr) => acc + curr.count, 0);

    await prisma.analyticsDailyOrgUserStats.update({
      where: {
        id: analyticsDailyOrgUserStats[0].id,
      },
      data: {
        count,
      },
    });

    await prisma.analyticsDailyOrgUserStats.deleteMany({
      where: {
        id: {
          in: analyticsDailyOrgUserStats.slice(1).map((stat) => stat.id),
        },
      },
    });
  }
}

async function fixOrganizationUserDuplicateMonthlyStatistics(month: Date, data: TData) {
  const { organizationId, userId, view, event } = data;

  const analyticsMonthlyOrgUserStats = await prisma.analyticsMonthlyOrgUserStats.findMany({
    where: {
      organizationId,
      userId,
      month,
      view,
      event,
    },
  });

  if (analyticsMonthlyOrgUserStats.length > 1) {
    const count = analyticsMonthlyOrgUserStats.reduce((acc, curr) => acc + curr.count, 0);

    await prisma.analyticsMonthlyOrgUserStats.update({
      where: {
        id: analyticsMonthlyOrgUserStats[0].id,
      },
      data: {
        count,
      },
    });

    await prisma.analyticsMonthlyOrgUserStats.deleteMany({
      where: {
        id: {
          in: analyticsMonthlyOrgUserStats.slice(1).map((stat) => stat.id),
        },
      },
    });
  }
}

async function recordOrganizationUserHourlyStatistics(data: TData) {
  const { organizationId, userId, view, event } = data;
  const hour = new Date(new Date().setUTCMinutes(0, 0, 0));

  const analyticsHourlyOrgUserStats = await prisma.analyticsHourlyOrgUserStats.findFirst({
    where: {
      organizationId,
      userId,
      hour,
      view,
      event,
    },
  });

  if (analyticsHourlyOrgUserStats?.id) {
    await prisma.analyticsHourlyOrgUserStats.update({
      where: {
        id: analyticsHourlyOrgUserStats.id,
        userId,
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
    await prisma.analyticsHourlyOrgUserStats.create({
      data: {
        organizationId,
        userId,
        hour,
        view,
        event,
        count: 1,
      },
    });
  }

  fixOrganizationUserDuplicateHourlyStatistics(hour, data);
}

async function recordOrganizationUserDailyStatistics(data: TData) {
  const { organizationId, userId, view, event } = data;
  const day = new Date(new Date().setUTCHours(0, 0, 0, 0));

  const analyticsDailyOrgUserStats = await prisma.analyticsDailyOrgUserStats.findFirst({
    where: {
      organizationId,
      userId,
      day,
      view,
      event,
    },
  });

  if (analyticsDailyOrgUserStats?.id) {
    await prisma.analyticsDailyOrgUserStats.update({
      where: {
        id: analyticsDailyOrgUserStats.id,
        userId,
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
    await prisma.analyticsDailyOrgUserStats.create({
      data: {
        organizationId,
        userId,
        day,
        view,
        event,
        count: 1,
      },
    });
  }

  fixOrganizationUserDuplicateDailyStatistics(day, data);
}

async function recordOrganizationUserMonthlyStatistics(data: TData) {
  const { organizationId, userId, view, event } = data;
  const month = new Date(new Date(new Date().setUTCDate(1)).setUTCHours(0, 0, 0, 0));

  const analyticsMonthlyOrgUserStats = await prisma.analyticsMonthlyOrgUserStats.findFirst({
    where: {
      organizationId,
      userId,
      month,
      view,
      event,
    },
  });

  if (analyticsMonthlyOrgUserStats?.id) {
    await prisma.analyticsMonthlyOrgUserStats.update({
      where: {
        id: analyticsMonthlyOrgUserStats.id,
        userId,
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
    await prisma.analyticsMonthlyOrgUserStats.create({
      data: {
        organizationId,
        userId,
        month,
        view,
        event,
        count: 1,
      },
    });
  }

  fixOrganizationUserDuplicateMonthlyStatistics(month, data);
}

async function recordOrganizationUserStatistics(data: TData) {
  await Promise.all([
    recordOrganizationUserHourlyStatistics(data),
    recordOrganizationUserDailyStatistics(data),
    recordOrganizationUserMonthlyStatistics(data),
  ]);
}

export { recordOrganizationUserStatistics };
