const User = require('../models/User');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledWorkshops')
      .populate('enrolledCourses');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phoneNumber: user.phoneNumber || '',
          whatsappNumber: user.whatsappNumber || '',
          enrolledCourses: user.enrolledCourses || [],
          enrolledWorkshops: user.enrolledWorkshops || []
        }
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar, phoneNumber, whatsappNumber } = req.body;
    
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
    if (whatsappNumber !== undefined) updates.whatsappNumber = whatsappNumber;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('enrolledWorkshops').populate('enrolledCourses');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phoneNumber: user.phoneNumber || '',
          whatsappNumber: user.whatsappNumber || '',
          enrolledCourses: user.enrolledCourses || [],
          enrolledWorkshops: user.enrolledWorkshops || []
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.removeWorkshop = async (req, res) => {
  try {
    const { workshopId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.enrolledWorkshops = user.enrolledWorkshops.filter(
      (id) => id && id.toString() !== workshopId
    );
    await user.save();

    const updatedUser = await User.findById(req.user.id)
      .populate('enrolledWorkshops')
      .populate('enrolledCourses');

    res.status(200).json({
      success: true,
      message: 'Workshop removed successfully',
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          phoneNumber: updatedUser.phoneNumber || '',
          whatsappNumber: updatedUser.whatsappNumber || '',
          enrolledCourses: updatedUser.enrolledCourses || [],
          enrolledWorkshops: updatedUser.enrolledWorkshops || []
        }
      }
    });
  } catch (error) {
    console.error('Remove workshop error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

