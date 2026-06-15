const ContactQuery = require('../models/ContactQuery');
const { sendContactEmail } = require('../utils/emailService');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, topic, message } = req.body;

    // Validation
    if (!name || !email || !phone || !topic || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Save to Database
    const query = new ContactQuery({
      name,
      email,
      phone,
      topic,
      message
    });
    await query.save();

    // Send email
    const emailResult = await sendContactEmail({ name, email, phone, topic, message });

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully and email sent to admin.',
      data: {
        queryId: query._id,
        emailSent: emailResult.success,
        localSaved: !!emailResult.localSaved
      }
    });
  } catch (error) {
    console.error('Submit contact form error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
