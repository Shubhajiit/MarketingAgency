const { z } = require('zod');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Workshop = require('../models/Workshop');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { invalidateCache } = require('../middleware/cache');
const { getBookingTimeoutQueue } = require('../queues/booking-timeout.queue');

const createBookingSchema = z.object({
  workshopId: z.string().min(1),
  slotId: z.string().min(1),
});

// ─── Create Booking ─────────────────────────────────────────
const createBooking = asyncHandler(async (req, res) => {
  const { workshopId, slotId } = createBookingSchema.parse(req.body);

  // Atomic seat reservation: only increment if seats available
  const workshop = await Workshop.findOneAndUpdate(
    {
      _id: workshopId,
      isActive: true,
      'slots._id': slotId,
      'slots.isAvailable': true,
    },
    {
      $inc: { 'slots.$.bookedSeats': 1 },
    },
    { new: true }
  );

  if (!workshop) {
    return ApiResponse.badRequest(res, 'Workshop or slot not available');
  }

  const slot = workshop.slots.id(slotId);

  // Check if slot is now full
  if (slot.bookedSeats > slot.totalSeats) {
    // Rollback
    await Workshop.findOneAndUpdate(
      { _id: workshopId, 'slots._id': slotId },
      { $inc: { 'slots.$.bookedSeats': -1 } }
    );
    return ApiResponse.badRequest(res, 'No seats available for this slot');
  }

  // Mark slot as unavailable if full
  if (slot.bookedSeats >= slot.totalSeats) {
    await Workshop.findOneAndUpdate(
      { _id: workshopId, 'slots._id': slotId },
      { $set: { 'slots.$.isAvailable': false } }
    );
  }

  const idempotencyKey = crypto.randomUUID();

  const booking = new Booking({
    user: req.user._id,
    workshop: workshopId,
    slotId,
    slotDate: slot.date,
    slotTime: `${slot.startTime} - ${slot.endTime}`,
    amount: workshop.price,
    currency: workshop.currency,
    paymentStatus: 'pending',
    idempotencyKey,
  });

  await booking.save();

  // Schedule timeout to release seat if payment not completed (15 min)
  const timeoutQueue = getBookingTimeoutQueue();
  await timeoutQueue.add(
    'release-seat',
    { bookingId: booking._id.toString() },
    { delay: 15 * 60 * 1000 }
  );

  // Invalidate cache
  await invalidateCache(`workshop:${workshopId}`, 'workshop:list');

  return ApiResponse.created(res, {
    booking,
    workshop: {
      title: workshop.title,
      instructor: workshop.instructor,
    },
  }, 'Booking created. Complete payment to confirm.');
});

// ─── Get My Bookings ────────────────────────────────────────
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('workshop', 'title instructor thumbnail')
    .sort({ createdAt: -1 })
    .lean();

  return ApiResponse.success(res, { bookings });
});

// ─── Get Booking Detail ─────────────────────────────────────
const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    user: req.user._id,
  })
    .populate('workshop', 'title instructor thumbnail slots')
    .lean();

  if (!booking) {
    return ApiResponse.notFound(res, 'Booking not found');
  }

  return ApiResponse.success(res, { booking });
});

module.exports = {
  createBooking,
  getMyBookings,
  getBooking,
};
