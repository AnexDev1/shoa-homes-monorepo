export const getDashboardStats = async (req, res) => {
  try {
    // Mock statistics
    const stats = {
      totalProperties: 147,
      activeListings: 89,
      totalInquiries: 234,
      totalUsers: 456,
      recentActivity: [
        {
          action: 'New inquiry received',
          property: 'Luxury Villa in Bole',
          time: '2 hours ago',
        },
        {
          action: 'Property listed',
          property: 'Modern Apartment in Kirkos',
          time: '5 hours ago',
        },
      ],
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message,
    });
  }
};
