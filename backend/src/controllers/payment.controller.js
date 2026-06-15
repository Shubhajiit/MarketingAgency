const Razorpay = require('razorpay');
const crypto = require('crypto');
const Workshop = require('../models/Workshop');
const WorkshopRegistration = require('../models/WorkshopRegistration');
const Course = require('../models/Course');
const CourseEnrollment = require('../models/CourseEnrollment');
const User = require('../models/User');
const { sendWorkshopConfirmationEmail } = require('../utils/emailService');
const { delCache } = require('../utils/redis');

// Initialize Razorpay instance once (singleton, safe for concurrency)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── Create Razorpay Order ─────────────────────────────────────
// POST /api/v1/payments/create-order
// Creates a pending registration + Razorpay order, returns order details to frontend
exports.createOrder = async (req, res) => {
  try {
    const {
      workshopId,
      name,
      email,
      phone,
      whatsappNumber,
      selectedDate,
      age,
      profession,
    } = req.body;

    // Validate required fields
    if (!workshopId || !name || !email || !phone || !selectedDate) {
      return res.status(400).json({
        success: false,
        message: 'workshopId, name, email, phone, and selectedDate are required',
      });
    }

    // Find workshop
    const workshop = await Workshop.findById(workshopId);
    if (!workshop || !workshop.isActive) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    // Calculate amount (price + 18% GST) in paise (Razorpay uses smallest currency unit)
    const basePrice = workshop.price || 0;
    const gstAmount = Math.round(basePrice * 0.18);
    const totalAmount = basePrice + gstAmount;
    const amountInPaise = totalAmount * 100;

    // Create a pending registration record first (idempotency anchor)
    const registration = await WorkshopRegistration.create({
      userId: req.user.id,
      workshopId: workshop._id,
      workshopTitle: workshop.title,
      workshopSlug: workshop.slug || '',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      whatsappNumber: (whatsappNumber || '').trim(),
      age: (age || '').trim(),
      profession: (profession || '').trim(),
      selectedDate: new Date(selectedDate),
      amountPaid: totalAmount,
      currency: workshop.currency || 'INR',
      paymentStatus: 'pending',
    });

    // Create Razorpay order
    const orderOptions = {
      amount: amountInPaise,
      currency: workshop.currency || 'INR',
      receipt: `reg_${registration._id}`,
      notes: {
        registrationId: registration._id.toString(),
        workshopId: workshop._id.toString(),
        userId: req.user.id,
        workshopTitle: workshop.title,
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Store the Razorpay order ID on the registration
    registration.razorpayOrderId = razorpayOrder.id;
    await registration.save();

    res.status(201).json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: orderOptions.currency,
        registrationId: registration._id,
        keyId: process.env.RAZORPAY_KEY_ID,
        workshopTitle: workshop.title,
        basePrice,
        gstAmount,
        totalAmount,
      },
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order',
    });
  }
};

// ─── Verify Razorpay Payment ───────────────────────────────────
// POST /api/v1/payments/verify
// Verifies signature, marks registration as paid, enrolls user
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !registrationId) {
      return res.status(400).json({
        success: false,
        message: 'All payment verification fields are required',
      });
    }

    // Verify signature using HMAC SHA256
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed — invalid signature',
      });
    }

    // Find the pending registration
    const registration = await WorkshopRegistration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    // Idempotency: if already paid, just return success
    if (registration.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        data: { registration },
        message: 'Payment already verified',
      });
    }

    // Update registration with payment details
    registration.paymentStatus = 'paid';
    registration.paymentId = razorpay_payment_id;
    registration.razorpaySignature = razorpay_signature;
    await registration.save();

    // Enroll user in workshop
    const user = await User.findById(registration.userId);
    if (user) {
      const alreadyEnrolled = user.enrolledWorkshops.some(
        (wId) => wId.toString() === registration.workshopId.toString()
      );
      if (!alreadyEnrolled) {
        user.enrolledWorkshops.push(registration.workshopId);
      }
      // Update phone/whatsapp if not set
      if (registration.phone && !user.phoneNumber) user.phoneNumber = registration.phone;
      if (registration.whatsappNumber && !user.whatsappNumber) user.whatsappNumber = registration.whatsappNumber;
      await user.save();
    }

    // Send confirmation email with PDF invoice asynchronously (non-blocking)
    sendWorkshopConfirmationEmail(registration).catch((err) => {
      console.error('[PaymentController] Error sending confirmation email:', err);
    });

    res.status(200).json({
      success: true,
      data: { registration },
      message: 'Payment verified and registration confirmed',
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed',
    });
  }
};

// ─── Mark Payment as Failed ────────────────────────────────────
// POST /api/v1/payments/failed
// Called when Razorpay checkout is dismissed or payment fails
exports.markFailed = async (req, res) => {
  try {
    const { registrationId } = req.body;

    if (!registrationId) {
      return res.status(400).json({
        success: false,
        message: 'registrationId is required',
      });
    }

    const registration = await WorkshopRegistration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    // Only mark as failed if currently pending
    if (registration.paymentStatus === 'pending') {
      registration.paymentStatus = 'failed';
      await registration.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment marked as failed',
    });
  } catch (error) {
    console.error('Mark Failed Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update payment status',
    });
  }
};

// ─── Course Payment: Create Razorpay Order ─────────────────────
// POST /api/v1/payments/course/create-order
exports.createCourseOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }

    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled (paid)
    const existingEnrollment = await CourseEnrollment.findOne({
      userId: req.user.id,
      courseId: course._id,
      paymentStatus: 'paid',
    });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this course' });
    }

    // Also check user.enrolledCourses for legacy free enrollments
    const user = await User.findById(req.user.id);
    if (user && user.enrolledCourses.some(id => id.toString() === courseId.toString())) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this course' });
    }

    const basePrice = course.price || 0;
    const gstAmount = Math.round(basePrice * 0.18);
    const totalAmount = basePrice + gstAmount;
    const amountInPaise = totalAmount * 100;

    // Create pending enrollment record (idempotency anchor)
    const enrollment = await CourseEnrollment.create({
      userId: req.user.id,
      courseId: course._id,
      courseTitle: course.title,
      amountPaid: totalAmount,
      currency: 'INR',
      paymentStatus: 'pending',
    });

    // If course is free, auto-enroll without Razorpay
    if (amountInPaise === 0) {
      enrollment.paymentStatus = 'paid';
      await enrollment.save();
      if (user && !user.enrolledCourses.some(id => id.toString() === courseId.toString())) {
        user.enrolledCourses.push(course._id);
        await user.save();
      }
      // Bust cache
      await delCache(`user:${req.user.id}:enrolled`);
      return res.status(200).json({
        success: true,
        free: true,
        message: 'Enrolled successfully (free course)',
        data: { enrollmentId: enrollment._id },
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `course_${enrollment._id}`,
      notes: {
        enrollmentId: enrollment._id.toString(),
        courseId: course._id.toString(),
        userId: req.user.id,
        courseTitle: course.title,
      },
    });

    enrollment.razorpayOrderId = razorpayOrder.id;
    await enrollment.save();

    res.status(201).json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        enrollmentId: enrollment._id,
        keyId: process.env.RAZORPAY_KEY_ID,
        courseTitle: course.title,
        basePrice,
        gstAmount,
        totalAmount,
      },
    });
  } catch (error) {
    console.error('Create Course Order Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create course payment order' });
  }
};

// ─── Course Payment: Verify Razorpay Payment ───────────────────
// POST /api/v1/payments/course/verify
exports.verifyCoursePayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, enrollmentId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !enrollmentId) {
      return res.status(400).json({ success: false, message: 'All payment verification fields are required' });
    }

    // Verify HMAC signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed — invalid signature' });
    }

    const enrollment = await CourseEnrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment record not found' });
    }

    // Idempotency: already paid
    if (enrollment.paymentStatus === 'paid') {
      return res.status(200).json({ success: true, data: { enrollment }, message: 'Payment already verified' });
    }

    // Mark enrollment as paid
    enrollment.paymentStatus = 'paid';
    enrollment.paymentId = razorpay_payment_id;
    enrollment.razorpaySignature = razorpay_signature;
    await enrollment.save();

    // Add course to user.enrolledCourses
    const user = await User.findById(enrollment.userId);
    if (user) {
      const alreadyEnrolled = user.enrolledCourses.some(
        (cId) => cId.toString() === enrollment.courseId.toString()
      );
      if (!alreadyEnrolled) {
        user.enrolledCourses.push(enrollment.courseId);
        await user.save();
      }
    }

    // Invalidate Redis cache for this user's enrollment data
    await delCache(`user:${enrollment.userId}:enrolled`);
    await delCache(`user:${enrollment.userId}:me`);

    res.status(200).json({
      success: true,
      data: { enrollment },
      message: 'Payment verified and course enrollment confirmed',
    });
  } catch (error) {
    console.error('Verify Course Payment Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Course payment verification failed' });
  }
};

// ─── Course Payment: Mark as Failed ───────────────────────────
// POST /api/v1/payments/course/failed
exports.markCoursePaymentFailed = async (req, res) => {
  try {
    const { enrollmentId } = req.body;
    if (!enrollmentId) {
      return res.status(400).json({ success: false, message: 'enrollmentId is required' });
    }

    const enrollment = await CourseEnrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    if (enrollment.paymentStatus === 'pending') {
      enrollment.paymentStatus = 'failed';
      await enrollment.save();
    }

    res.status(200).json({ success: true, message: 'Course payment marked as failed' });
  } catch (error) {
    console.error('Mark Course Payment Failed Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update course payment status' });
  }
};
