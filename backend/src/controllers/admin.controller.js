const User = require('../models/User');
const Workshop = require('../models/Workshop');
const Course = require('../models/Course');
const WorkshopRegistration = require('../models/WorkshopRegistration');

exports.getStats = async (req, res) => {
  try {
    const [totalWorkshopBuyers, totalCourses, totalWorkshops] = await Promise.all([
      User.countDocuments({ role: 'user', 'enrolledWorkshops.0': { $exists: true } }),
      Course.countDocuments({ isActive: true }),
      Workshop.countDocuments({ isActive: true }),
    ]);

    const users = await User.find({ role: 'user' })
      .populate('enrolledWorkshops')
      .populate('enrolledCourses');

    let totalRevenue = 0;
    const recentBookings = [];

    users.forEach(user => {
      if (user.enrolledWorkshops) {
        user.enrolledWorkshops.forEach(w => {
          totalRevenue += w.price || 0;
          recentBookings.push({
            _id: `${user._id}-${w._id}`,
            user: {
              _id: user._id,
              name: user.name,
              email: user.email
            },
            workshop: {
              title: w.title
            },
            paymentStatus: 'paid',
            amount: w.price || 0,
            createdAt: user.updatedAt || new Date()
          });
        });
      }
      if (user.enrolledCourses) {
        user.enrolledCourses.forEach(c => {
          totalRevenue += c.price || 0;
          recentBookings.push({
            _id: `${user._id}-${c._id}`,
            user: {
              _id: user._id,
              name: user.name,
              email: user.email
            },
            workshop: {
              title: c.title
            },
            paymentStatus: 'paid',
            amount: c.price || 0,
            createdAt: user.updatedAt || new Date()
          });
        });
      }
    });

    recentBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latestBookings = recentBookings.slice(0, 10);

    // Calculate daily registrations/enrollments for the last 7 days
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      last7Days.push({
        dateString: d.toISOString().split('T')[0],
        dayName: dayNames[d.getDay()],
        start: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0),
        end: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
      });
    }

    const chartData = {
      labels: last7Days.map(d => d.dayName),
      overview: {
        teachers: [], // Course enrollments
        students: [], // Workshop enrollments
        other: [] // New signups
      },
      studentAnalysis: {
        enrolled: [],
        left: []
      }
    };

    for (const day of last7Days) {
      const newSignups = await User.countDocuments({
        role: 'user',
        createdAt: { $gte: day.start, $lte: day.end }
      });

      const activeUsers = await User.find({
        role: 'user',
        updatedAt: { $gte: day.start, $lte: day.end }
      });

      let workshopCount = 0;
      let courseCount = 0;
      activeUsers.forEach(u => {
        if (u.enrolledWorkshops) workshopCount += u.enrolledWorkshops.length;
        if (u.enrolledCourses) courseCount += u.enrolledCourses.length;
      });

      chartData.overview.teachers.push(courseCount);
      chartData.overview.students.push(workshopCount);
      chartData.overview.other.push(newSignups);

      chartData.studentAnalysis.enrolled.push(courseCount + workshopCount);
      chartData.studentAnalysis.left.push(0);
    }

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalWorkshopBuyers: totalWorkshopBuyers || 0,
          totalCourses: totalCourses || 0,
          totalVideos: 0,
          totalRevenue: totalRevenue || 0,
        },
        recentBookings: latestBookings,
        chartData
      },
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .populate('enrolledWorkshops')
      .populate('enrolledCourses')
      .select('-password');
    res.status(200).json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Admin: Get all workshop registrations ───────────────
exports.getWorkshopRegistrations = async (req, res) => {
  try {
    const registrations = await WorkshopRegistration.find()
      .populate('userId', 'name email phoneNumber whatsappNumber avatar')
      .populate('workshopId', 'title slug price currency')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { registrations },
    });
  } catch (error) {
    console.error('Get Workshop Registrations Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
