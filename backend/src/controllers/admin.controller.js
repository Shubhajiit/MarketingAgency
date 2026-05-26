const User = require('../models/User');
const Workshop = require('../models/Workshop');
const Course = require('../models/Course');

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

exports.assignCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
      return res.status(400).json({ success: false, message: 'User ID and Course ID are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Avoid duplicates
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Course assigned successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Assign Course Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.unassignCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
      return res.status(400).json({ success: false, message: 'User ID and Course ID are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.enrolledCourses = user.enrolledCourses.filter(
      (id) => id.toString() !== courseId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Course unassigned successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Unassign Course Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
