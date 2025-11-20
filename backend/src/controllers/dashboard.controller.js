import prisma from '../config/prisma.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [totalProperties, activeListings, totalUsers] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: 'for-sale' } }),
      prisma.user.count(),
    ]);

    // Get latest 5 recent property creations (inquiries removed)
    const [recentProperties] = await Promise.all([
      prisma.property.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { title: true, createdAt: true },
      }),
    ]);

    const recentActivity = [];
    recentProperties.forEach((p) =>
      recentActivity.push({
        action: 'Property listed',
        property: p.title,
        time: p.createdAt,
      })
    );
    // No inquiries activity added — inquiries removed
    recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));
    // Limit to 5
    const recent = recentActivity
      .slice(0, 5)
      .map((r) => ({ ...r, time: r.time }));

    // Prepare monthly trends for the last 6 months
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d);
    }

    // Query properties & inquiries in last 6 months
    const startDate = new Date(
      months[0].getFullYear(),
      months[0].getMonth(),
      1
    );
    const propertiesLast6 = await prisma.property.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
    });
    // no inquiries query - feature removed

    const monthlyTrends = months.map((m) => {
      const monthKey = `${m.getFullYear()}-${m.getMonth() + 1}`;
      return {
        name: m.toLocaleString('default', { month: 'short' }),
        listings: 0,
        inquiries: 0,
        key: monthKey,
      };
    });

    const getMonthKey = (d) => `${d.getFullYear()}-${d.getMonth() + 1}`;
    const trendMap = {};
    monthlyTrends.forEach((t) => (trendMap[t.key] = t));
    propertiesLast6.forEach((p) => {
      const key = getMonthKey(new Date(p.createdAt));
      if (trendMap[key]) trendMap[key].listings += 1;
    });
    // no inquiries trend - feature removed

    // property type breakdown
    const typeGroups = await prisma.property.groupBy({
      by: ['type'],
      _count: { type: true },
    });
    const propertyTypeBreakdown = typeGroups.map((g) => ({
      name: g.type,
      value: g._count.type,
    }));

    const stats = {
      totalProperties,
      activeListings,
      totalUsers,
      recentActivity: recent,
      monthlyTrends,
      propertyTypeBreakdown,
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error in getDashboardStats:', error?.stack || error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to fetch dashboard stats',
        error: error.message,
      });
  }
};
