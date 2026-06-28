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

    // Fetch latest registrations for the transaction list
    const registrations = await WorkshopRegistration.find()
      .populate('userId', 'avatar name email phoneNumber whatsappNumber')
      .sort({ createdAt: -1 })
      .limit(30);

    // Calculate revenue from paid registrations
    const paidRegistrations = await WorkshopRegistration.find({ paymentStatus: 'paid' });
    const totalRevenue = paidRegistrations.reduce((sum, reg) => sum + (reg.amountPaid || 0), 0);

    const recentBookings = registrations.map(reg => ({
      _id: reg._id,
      user: {
        _id: reg.userId ? reg.userId._id : null,
        name: reg.name || (reg.userId ? reg.userId.name : 'Customer'),
        email: reg.email || (reg.userId ? reg.userId.email : ''),
        avatar: reg.userId ? reg.userId.avatar : null,
        phone: reg.phone,
        whatsappNumber: reg.whatsappNumber
      },
      workshop: {
        title: reg.workshopTitle
      },
      paymentStatus: reg.paymentStatus,
      amount: reg.amountPaid || 0,
      createdAt: reg.createdAt,
      paymentId: reg.paymentId,
      currency: reg.currency || 'INR'
    }));

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
        recentBookings: recentBookings,
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
      .populate('workshopId', 'title slug price currency type')
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

// Delete single workshop registration
exports.deleteWorkshopRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await WorkshopRegistration.findByIdAndDelete(id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    res.status(200).json({ success: true, message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Delete Workshop Registration Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete all or selected workshop registrations
exports.deleteWorkshopRegistrationsBulk = async (req, res) => {
  try {
    const { ids } = req.body;
    if (ids && Array.isArray(ids)) {
      await WorkshopRegistration.deleteMany({ _id: { $in: ids } });
      return res.status(200).json({ success: true, message: 'Selected registrations deleted successfully' });
    }
    
    await WorkshopRegistration.deleteMany({});
    res.status(200).json({ success: true, message: 'All registrations deleted successfully' });
  } catch (error) {
    console.error('Delete Bulk Workshop Registrations Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
