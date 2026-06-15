const WorkshopRegistration = require('../models/WorkshopRegistration');
const Workshop = require('../models/Workshop');
const { sendWorkshopCancellationEmail } = require('./emailService');

// In-memory set to prevent duplicate workers for the same workshop running concurrently
const activeCancellationJobs = new Set();

/**
 * Starts processing the cancellation email queue for a specific workshop.
 * This runs asynchronously in the background.
 * @param {string} workshopId 
 */
function startCancellationQueue(workshopId) {
  const workshopIdStr = workshopId.toString();
  if (activeCancellationJobs.has(workshopIdStr)) {
    console.log(`[CancellationQueue] Worker for workshop ${workshopIdStr} is already running.`);
    return;
  }

  activeCancellationJobs.add(workshopIdStr);
  console.log(`[CancellationQueue] Starting background email worker for workshop ${workshopIdStr}`);
  
  // Start the background process without awaiting it
  processBatch(workshopIdStr).catch(err => {
    console.error(`[CancellationQueue] Error in background worker for workshop ${workshopIdStr}:`, err);
    activeCancellationJobs.delete(workshopIdStr);
  });
}

/**
 * Recursively process registration batches for a workshop.
 * @param {string} workshopIdStr 
 */
async function processBatch(workshopIdStr) {
  const BATCH_SIZE = 50;
  const DELAY_BETWEEN_BATCHES = 1000; // 1 second

  try {
    // 1. Fetch the workshop details (needed for email context)
    const workshop = await Workshop.findById(workshopIdStr);
    if (!workshop) {
      console.error(`[CancellationQueue] Workshop ${workshopIdStr} not found. Stopping worker.`);
      activeCancellationJobs.delete(workshopIdStr);
      return;
    }

    // 2. Fetch a batch of paid registrations that haven't received the cancellation email yet
    const registrations = await WorkshopRegistration.find({
      workshopId: workshopIdStr,
      paymentStatus: 'paid',
      cancellationEmailSent: { $ne: true }
    }).limit(BATCH_SIZE);

    if (registrations.length === 0) {
      console.log(`[CancellationQueue] All cancellation emails sent successfully for workshop ${workshopIdStr}`);
      activeCancellationJobs.delete(workshopIdStr);
      return;
    }

    console.log(`[CancellationQueue] Processing batch of ${registrations.length} cancellation emails for workshop "${workshop.title}"`);

    // 3. Update registrations in bulk to mark isCancelled and refundStatus (fail-safe status update)
    const registrationIds = registrations.map(r => r._id);
    await WorkshopRegistration.updateMany(
      { _id: { $in: registrationIds } },
      { $set: { isCancelled: true, refundStatus: 'pending' } }
    );

    // 4. Send emails concurrently for this batch (Promise.allSettled is safe and ensures one failure doesn't block others)
    const emailPromises = registrations.map(async (reg) => {
      const result = await sendWorkshopCancellationEmail(reg, workshop);
      if (result.success) {
        // Mark as sent in DB
        await WorkshopRegistration.updateOne(
          { _id: reg._id },
          { $set: { cancellationEmailSent: true } }
        );
      } else {
        console.error(`[CancellationQueue] Failed to send email to ${reg.email}:`, result.error);
      }
    });

    await Promise.allSettled(emailPromises);

    console.log(`[CancellationQueue] Finished batch. Scheduling next batch for workshop ${workshopIdStr} in ${DELAY_BETWEEN_BATCHES}ms`);

    // 5. Schedule the next batch to run after a delay
    setTimeout(() => {
      processBatch(workshopIdStr).catch(err => {
        console.error(`[CancellationQueue] Error in next batch for workshop ${workshopIdStr}:`, err);
        activeCancellationJobs.delete(workshopIdStr);
      });
    }, DELAY_BETWEEN_BATCHES);

  } catch (error) {
    console.error(`[CancellationQueue] Batch processing failed for workshop ${workshopIdStr}:`, error);
    activeCancellationJobs.delete(workshopIdStr);
  }
}

/**
 * Scans the database on server startup for cancelled workshops that still have paid registrations
 * with unsent cancellation emails, and automatically resumes their workers.
 */
async function resumePendingCancellations() {
  try {
    // Find unique workshop IDs where registrations are cancelled but emails are not sent
    const pendingWorkshopIds = await WorkshopRegistration.distinct('workshopId', {
      isCancelled: true,
      paymentStatus: 'paid',
      cancellationEmailSent: { $ne: true }
    });

    if (pendingWorkshopIds.length > 0) {
      console.log(`[CancellationQueue] Found ${pendingWorkshopIds.length} workshops with pending cancellation emails on startup. Resuming...`);
      for (const wId of pendingWorkshopIds) {
        startCancellationQueue(wId);
      }
    }
  } catch (err) {
    console.error(`[CancellationQueue] Error resuming pending cancellations on startup:`, err);
  }
}

module.exports = {
  startCancellationQueue,
  resumePendingCancellations
};
