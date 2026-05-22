const { Queue } = require('bullmq');
const { env } = require('../config/env');
const logger = require('../utils/logger');

let bookingTimeoutQueue = null;

/**
 * Get or create the booking timeout queue.
 * Schedules delayed jobs to release seats if payment isn't completed.
 */
const getBookingTimeoutQueue = () => {
  if (bookingTimeoutQueue) return bookingTimeoutQueue;

  if (!env.REDIS_URL) {
    logger.warn('Booking timeout queue: Using setTimeout fallback (no Redis)');
    return {
      add: async (name, data, opts = {}) => {
        const delay = opts.delay || 900000; // 15 minutes default
        logger.info(`Booking timeout scheduled (setTimeout): ${data.bookingId} in ${delay}ms`);

        setTimeout(async () => {
          try {
            const Booking = require('../models/Booking');
            const Workshop = require('../models/Workshop');
            const { invalidateCache } = require('../middleware/cache');

            const booking = await Booking.findById(data.bookingId);
            if (booking && booking.paymentStatus === 'pending') {
              booking.paymentStatus = 'failed';
              await booking.save();

              // Release the seat
              await Workshop.findOneAndUpdate(
                { _id: booking.workshop, 'slots._id': booking.slotId },
                { $inc: { 'slots.$.bookedSeats': -1 } }
              );

              await invalidateCache(`workshop:${booking.workshop}`, 'workshop:list');
              logger.info(`Booking timeout: Released seat for booking ${data.bookingId}`);
            }
          } catch (err) {
            logger.error('Booking timeout handler error:', err);
          }
        }, delay);

        return { id: `timeout-${Date.now()}` };
      },
    };
  }

  bookingTimeoutQueue = new Queue('booking-timeout', {
    connection: {
      url: env.REDIS_URL,
    },
    defaultJobOptions: {
      attempts: 1,
      removeOnComplete: true,
      removeOnFail: { count: 100 },
    },
  });

  logger.info('Booking timeout queue initialized');
  return bookingTimeoutQueue;
};

module.exports = { getBookingTimeoutQueue };
