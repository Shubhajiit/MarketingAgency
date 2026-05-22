const Razorpay = require('razorpay');
const Stripe = require('stripe');
const crypto = require('crypto');
const { env } = require('../config/env');
const logger = require('../utils/logger');

// Initialize Razorpay
let razorpay = null;
const getRazorpay = () => {
  if (!razorpay && env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

// Initialize Stripe
let stripe = null;
const getStripe = () => {
  if (!stripe && env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }
  return stripe;
};

/**
 * Create a Razorpay order.
 */
const createRazorpayOrder = async ({ amount, currency = 'INR', receipt, notes = {} }) => {
  const rz = getRazorpay();
  if (!rz) throw new Error('Razorpay not configured');

  const order = await rz.orders.create({
    amount: Math.round(amount * 100), // Razorpay expects paise
    currency,
    receipt,
    notes,
  });

  logger.info(`Razorpay order created: ${order.id}`);
  return order;
};

/**
 * Verify Razorpay payment signature.
 */
const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
};

/**
 * Verify Razorpay webhook signature.
 */
const verifyRazorpayWebhook = (body, signature) => {
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
};

/**
 * Create a Stripe checkout session / payment intent.
 */
const createStripePaymentIntent = async ({ amount, currency = 'usd', metadata = {} }) => {
  const st = getStripe();
  if (!st) throw new Error('Stripe not configured');

  const paymentIntent = await st.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe expects cents
    currency: currency.toLowerCase(),
    metadata,
  });

  logger.info(`Stripe payment intent created: ${paymentIntent.id}`);
  return paymentIntent;
};

/**
 * Verify Stripe webhook signature.
 */
const verifyStripeWebhook = (rawBody, signature) => {
  const st = getStripe();
  if (!st) throw new Error('Stripe not configured');

  return st.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
};

module.exports = {
  getRazorpay,
  getStripe,
  createRazorpayOrder,
  verifyRazorpaySignature,
  verifyRazorpayWebhook,
  createStripePaymentIntent,
  verifyStripeWebhook,
};
