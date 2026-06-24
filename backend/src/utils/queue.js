const { Queue, Worker } = require('bullmq');
const WorkshopRegistration = require('../models/WorkshopRegistration');
const Workshop = require('../models/Workshop');
const { sendWorkshopConfirmationEmail, sendWorkshopCancellationEmail } = require('./emailService');

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || '',
};

// Create the main email queue
const emailQueue = new Queue('emailQueue', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000, // retry after 2s, then 4s, then 8s
    },
  },
});

let worker;

function startWorker() {
  if (worker) return worker;

  worker = new Worker('emailQueue', async (job) => {
    const { type, registrationId, workshopId } = job.data;
    console.log(`[Queue Worker] Processing job ${job.id} of type ${type} for registration ${registrationId}`);

    const registration = await WorkshopRegistration.findById(registrationId);
    if (!registration) {
      throw new Error(`Registration ${registrationId} not found`);
    }

    if (type === 'confirmation') {
      const result = await sendWorkshopConfirmationEmail(registration);
      if (!result || !result.success) {
        throw new Error(`Failed to send confirmation email: ${result ? result.error : 'Unknown error'}`);
      }
    } else if (type === 'cancellation') {
      const workshop = await Workshop.findById(workshopId);
      if (!workshop) {
        throw new Error(`Workshop ${workshopId} not found`);
      }

      const result = await sendWorkshopCancellationEmail(registration, workshop);
      if (!result || !result.success) {
        throw new Error(`Failed to send cancellation email: ${result ? result.error : 'Unknown error'}`);
      }

      // Mark as sent in DB
      await WorkshopRegistration.updateOne(
        { _id: registrationId },
        { $set: { cancellationEmailSent: true } }
      );
    } else {
      throw new Error(`Unknown job type: ${type}`);
    }
  }, {
    connection,
    concurrency: 5,
  });

  worker.on('completed', (job) => {
    console.log(`[Queue Worker] Job ${job.id} of type ${job.data.type} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Queue Worker] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}

module.exports = {
  emailQueue,
  startWorker,
};
