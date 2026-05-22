const { Queue } = require('bullmq');
const { env } = require('../config/env');
const logger = require('../utils/logger');

let emailQueue = null;

/**
 * Get or create the email queue.
 * Uses Redis for queue storage if available.
 */
const getEmailQueue = () => {
  if (emailQueue) return emailQueue;

  if (!env.REDIS_URL) {
    // Return a mock queue for development without Redis
    logger.warn('Email queue: Using synchronous fallback (no Redis)');
    return {
      add: async (name, data) => {
        logger.info(`Email job queued (sync): ${name}`, data);
        // In dev, we could process immediately
        const { sendBookingConfirmation, sendEmail } = require('../services/email.service');
        if (name === 'booking-confirmation') {
          await sendBookingConfirmation(data).catch((err) =>
            logger.error('Email send error:', err)
          );
        } else if (name === 'send-email') {
          await sendEmail(data).catch((err) =>
            logger.error('Email send error:', err)
          );
        }
        return { id: `sync-${Date.now()}` };
      },
    };
  }

  emailQueue = new Queue('email', {
    connection: {
      url: env.REDIS_URL,
    },
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 500 },
    },
  });

  logger.info('Email queue initialized');
  return emailQueue;
};

module.exports = { getEmailQueue };
