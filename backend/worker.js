require('dotenv').config();

const { Worker } = require('bullmq');
const { env } = require('./src/config/env');
const { sendBookingConfirmation, sendEmail } = require('./src/services/email.service');
const logger = require('./src/utils/logger');

if (!env.REDIS_URL) {
  logger.warn('Worker requires REDIS_URL. In dev mode, emails are processed synchronously.');
  process.exit(0);
}

// ─── Email Worker ───────────────────────────────────────────
const emailWorker = new Worker(
  'email',
  async (job) => {
    logger.info(`Processing email job: ${job.name} (${job.id})`);

    switch (job.name) {
      case 'booking-confirmation':
        await sendBookingConfirmation(job.data);
        break;

      case 'send-email':
        await sendEmail(job.data);
        break;

      default:
        logger.warn(`Unknown email job type: ${job.name}`);
    }
  },
  {
    connection: { url: env.REDIS_URL },
    concurrency: 5,
  }
);

emailWorker.on('completed', (job) => {
  logger.info(`Email job completed: ${job.name} (${job.id})`);
});

emailWorker.on('failed', (job, err) => {
  logger.error(`Email job failed: ${job.name} (${job.id}) - ${err.message}`);
});

// ─── Booking Timeout Worker ─────────────────────────────────
const bookingTimeoutWorker = new Worker(
  'booking-timeout',
  async (job) => {
    const { connectDB } = require('./src/config/db');
    await connectDB();

    const Booking = require('./src/models/Booking');
    const Workshop = require('./src/models/Workshop');
    const { invalidateCache } = require('./src/middleware/cache');

    const { bookingId } = job.data;
    logger.info(`Processing booking timeout: ${bookingId}`);

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.paymentStatus !== 'pending') {
      logger.info(`Booking ${bookingId}: already resolved, skipping`);
      return;
    }

    // Mark booking as failed
    booking.paymentStatus = 'failed';
    await booking.save();

    // Release the seat
    await Workshop.findOneAndUpdate(
      { _id: booking.workshop, 'slots._id': booking.slotId },
      { $inc: { 'slots.$.bookedSeats': -1 } }
    );

    await invalidateCache(`workshop:${booking.workshop}`, 'workshop:list');
    logger.info(`Booking timeout: Released seat for ${bookingId}`);
  },
  {
    connection: { url: env.REDIS_URL },
    concurrency: 3,
  }
);

bookingTimeoutWorker.on('completed', (job) => {
  logger.info(`Booking timeout job completed: ${job.id}`);
});

bookingTimeoutWorker.on('failed', (job, err) => {
  logger.error(`Booking timeout job failed: ${job.id} - ${err.message}`);
});

logger.info('🔧 Worker process started');

// Graceful shutdown
process.on('SIGTERM', async () => {
  await emailWorker.close();
  await bookingTimeoutWorker.close();
  process.exit(0);
});
