const { z } = require('zod');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Video = require('../models/Video');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { createRazorpayOrder, createStripePaymentIntent } = require('../services/payment.service');

const createOrderSchema = z.object({
  type: z.enum(['booking', 'video']),
  referenceId: z.string().min(1),
  gateway: z.enum(['razorpay', 'stripe']),
});

// ─── Create Payment Order ───────────────────────────────────
const createOrder = asyncHandler(async (req, res) => {
  const { type, referenceId, gateway } = createOrderSchema.parse(req.body);

  // Fetch price from database — never trust client-supplied amounts
  let amount, currency;

  if (type === 'booking') {
    const booking = await Booking.findOne({ _id: referenceId, user: req.user._id });
    if (!booking) return ApiResponse.notFound(res, 'Booking not found');
    if (booking.paymentStatus === 'paid') return ApiResponse.badRequest(res, 'Already paid');
    amount = booking.amount;
    currency = booking.currency;
  } else {
    const video = await Video.findById(referenceId);
    if (!video) return ApiResponse.notFound(res, 'Video not found');
    amount = video.price;
    currency = video.currency;
  }

  const idempotencyKey = crypto.randomUUID();

  let gatewayOrder;

  if (gateway === 'razorpay') {
    gatewayOrder = await createRazorpayOrder({
      amount,
      currency,
      receipt: `${type}_${referenceId}`,
      notes: { type, referenceId, userId: req.user._id.toString() },
    });
  } else {
    gatewayOrder = await createStripePaymentIntent({
      amount,
      currency,
      metadata: { type, referenceId, userId: req.user._id.toString() },
    });
  }

  // Store payment record
  const payment = new Payment({
    user: req.user._id,
    type,
    referenceId,
    gateway,
    gatewayOrderId: gateway === 'razorpay' ? gatewayOrder.id : gatewayOrder.id,
    amount,
    currency,
    status: 'created',
    idempotencyKey,
  });

  await payment.save();

  // Update booking with orderId
  if (type === 'booking') {
    await Booking.findByIdAndUpdate(referenceId, { orderId: gatewayOrder.id });
  }

  const responseData = {
    payment,
    order: {
      id: gatewayOrder.id,
      amount: gateway === 'razorpay' ? gatewayOrder.amount : gatewayOrder.amount,
      currency: gateway === 'razorpay' ? gatewayOrder.currency : gatewayOrder.currency,
    },
  };

  // Add client secret for Stripe
  if (gateway === 'stripe') {
    responseData.order.clientSecret = gatewayOrder.client_secret;
  }

  return ApiResponse.created(res, responseData, 'Payment order created');
});

module.exports = { createOrder };
