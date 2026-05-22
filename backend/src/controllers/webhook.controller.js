const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Workshop = require('../models/Workshop');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { verifyRazorpayWebhook, verifyStripeWebhook } = require('../services/payment.service');
const { getEmailQueue } = require('../queues/email.queue');
const { invalidateCache } = require('../middleware/cache');
const logger = require('../utils/logger');

// ─── Razorpay Webhook ───────────────────────────────────────
const razorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.body; // express.raw() returns Buffer

  if (!signature || !rawBody) {
    return ApiResponse.badRequest(res, 'Missing signature or body');
  }

  // Verify signature
  const isValid = verifyRazorpayWebhook(rawBody.toString(), signature);
  if (!isValid) {
    logger.warn('Razorpay webhook: Invalid signature');
    return ApiResponse.unauthorized(res, 'Invalid webhook signature');
  }

  const event = JSON.parse(rawBody.toString());

  if (event.event === 'payment.captured') {
    const paymentEntity = event.payload.payment.entity;
    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;

    // Idempotency: check if already processed
    const existingPayment = await Payment.findOne({
      gatewayOrderId: orderId,
      status: 'paid',
    });

    if (existingPayment) {
      logger.info(`Razorpay webhook: Duplicate event for order ${orderId}`);
      return ApiResponse.success(res, null, 'Already processed');
    }

    // Update payment
    const payment = await Payment.findOneAndUpdate(
      { gatewayOrderId: orderId, status: { $ne: 'paid' } },
      {
        status: 'paid',
        gatewayPaymentId: paymentId,
        webhookPayload: event,
      },
      { new: true }
    );

    if (!payment) {
      logger.warn(`Razorpay webhook: Payment not found for order ${orderId}`);
      return ApiResponse.success(res, null, 'Payment not found');
    }

    // Handle based on type
    if (payment.type === 'booking') {
      await handleBookingPayment(payment);
    } else if (payment.type === 'video') {
      await handleVideoPayment(payment);
    }
  }

  return ApiResponse.success(res, null, 'Webhook processed');
});

// ─── Stripe Webhook ─────────────────────────────────────────
const stripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const rawBody = req.body;

  if (!signature || !rawBody) {
    return ApiResponse.badRequest(res, 'Missing signature or body');
  }

  let event;
  try {
    event = verifyStripeWebhook(rawBody, signature);
  } catch (err) {
    logger.warn('Stripe webhook: Invalid signature', err.message);
    return ApiResponse.unauthorized(res, 'Invalid webhook signature');
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.id;

    // Idempotency check
    const existingPayment = await Payment.findOne({
      gatewayOrderId: orderId,
      status: 'paid',
    });

    if (existingPayment) {
      return ApiResponse.success(res, null, 'Already processed');
    }

    const payment = await Payment.findOneAndUpdate(
      { gatewayOrderId: orderId, status: { $ne: 'paid' } },
      {
        status: 'paid',
        gatewayPaymentId: paymentIntent.id,
        webhookPayload: event,
      },
      { new: true }
    );

    if (!payment) {
      return ApiResponse.success(res, null, 'Payment not found');
    }

    if (payment.type === 'booking') {
      await handleBookingPayment(payment);
    } else if (payment.type === 'video') {
      await handleVideoPayment(payment);
    }
  }

  return ApiResponse.success(res, null, 'Webhook processed');
});

// ─── Handle Booking Payment ─────────────────────────────────
async function handleBookingPayment(payment) {
  const booking = await Booking.findByIdAndUpdate(
    payment.referenceId,
    {
      paymentStatus: 'paid',
      paymentId: payment.gatewayPaymentId,
    },
    { new: true }
  );

  if (!booking) {
    logger.error(`Booking not found for payment ${payment._id}`);
    return;
  }

  // Queue confirmation email
  const workshop = await Workshop.findById(booking.workshop).lean();
  const user = await User.findById(payment.user).lean();
  const slot = workshop?.slots?.find((s) => s._id.toString() === booking.slotId.toString());

  if (user && workshop && slot) {
    const emailQueue = getEmailQueue();
    await emailQueue.add('booking-confirmation', {
      user: { name: user.name, email: user.email },
      booking: { _id: booking._id, amount: booking.amount },
      workshop: { title: workshop.title, instructor: workshop.instructor },
      slot: {
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        meetingLink: slot.meetingLink,
      },
    });

    await Booking.findByIdAndUpdate(booking._id, { confirmationSent: true });
  }

  await invalidateCache(`user:${payment.user}:bookings`);
  logger.info(`Booking payment confirmed: ${booking._id}`);
}

// ─── Handle Video Payment ───────────────────────────────────
async function handleVideoPayment(payment) {
  // Grant video access
  await User.findByIdAndUpdate(payment.user, {
    $addToSet: { purchasedVideos: payment.referenceId },
  });

  await invalidateCache(`user:${payment.user}:videos`);
  logger.info(`Video access granted: user=${payment.user}, video=${payment.referenceId}`);
}

module.exports = {
  razorpayWebhook,
  stripeWebhook,
};
