const Query = require('../models/Query');

// Submit a new query (Public)
exports.submitQuery = async (req, res) => {
  try {
    const { fullName, email, countryCode, phone, experience, querySection, learningMode, consent } = req.body;

    if (!fullName || !email || !phone || !experience || !querySection) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const query = await Query.create({
      fullName,
      email,
      countryCode,
      phone,
      experience,
      querySection,
      learningMode,
      consent
    });

    res.status(201).json({
      success: true,
      message: 'Query submitted successfully',
      data: query
    });
  } catch (error) {
    console.error('Submit Query Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get all queries (Admin only)
exports.getAllQueries = async (req, res) => {
  try {
    // Check admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized, admin only' });
    }

    const queries = await Query.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { queries }
    });
  } catch (error) {
    console.error('Get All Queries Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete a query (Admin only)
exports.deleteQuery = async (req, res) => {
  try {
    // Check admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized, admin only' });
    }

    const { id } = req.params;
    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }

    await query.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Query deleted successfully'
    });
  } catch (error) {
    console.error('Delete Query Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
