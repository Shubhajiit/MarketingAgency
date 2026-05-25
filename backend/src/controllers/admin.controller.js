const User = require('../models/User');
const Workshop = require('../models/Workshop');

exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalWorkshops] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Workshop.countDocuments({ isActive: true }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers: totalUsers || 0,
          totalWorkshops: totalWorkshops || 0,
          totalBookings: 0,
          totalVideos: 0,
          totalRevenue: 0,
        },
        recentBookings: [],
      },
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
