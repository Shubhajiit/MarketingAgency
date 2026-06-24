const WorkshopRegistration = require('../models/WorkshopRegistration');
const { emailQueue } = require('./queue');

/**
 * Starts processing the cancellation email queue for a specific workshop.
 * Adds jobs to the reliable Redis-backed BullMQ.
 * @param {string} workshopId 
 */
async function startCancellationQueue(workshopId) {
  const workshopIdStr = workshopId.toString();
  console.log(`[CancellationQueue] Enqueueing cancellation jobs for workshop ${workshopIdStr}`);

  try {
    // 1. Fetch paid registrations that haven't received the cancellation email yet
    const registrations = await WorkshopRegistration.find({
      workshopId: workshopIdStr,
      paymentStatus: 'paid',
      cancellationEmailSent: { $ne: true }
    });

    if (registrations.length === 0) {
      console.log(`[CancellationQueue] No registrations to cancel for workshop ${workshopIdStr}`);
      return;
    }

    // 2. Update registrations in bulk to mark isCancelled and refundStatus
    const registrationIds = registrations.map(r => r._id);
    await WorkshopRegistration.updateMany(
      { _id: { $in: registrationIds } },
      { $set: { isCancelled: true, refundStatus: 'pending' } }
    );

    // 3. Add jobs to BullMQ
    const jobs = registrations.map(reg => ({
      name: `workshop-cancellation-${reg._id}`,
      data: {
        type: 'cancellation',
        registrationId: reg._id.toString(),
        workshopId: workshopIdStr
      }
    }));

    await emailQueue.addBulk(jobs);
    console.log(`[CancellationQueue] Enqueued ${jobs.length} cancellation email jobs for workshop ${workshopIdStr}`);
  } catch (error) {
    console.error(`[CancellationQueue] Failed to start cancellation queue for workshop ${workshopIdStr}:`, error);
  }
}

/**
 * Scans the database on server startup for cancelled workshops that still have paid registrations
 * with unsent cancellation emails, and automatically resumes their workers by enqueueing to BullMQ.
 */
async function resumePendingCancellations() {
  try {
    const pendingWorkshopIds = await WorkshopRegistration.distinct('workshopId', {
      isCancelled: true,
      paymentStatus: 'paid',
      cancellationEmailSent: { $ne: true }
    });

    if (pendingWorkshopIds.length > 0) {
      console.log(`[CancellationQueue] Found ${pendingWorkshopIds.length} workshops with pending cancellation emails on startup. Resuming...`);
      for (const wId of pendingWorkshopIds) {
        await startCancellationQueue(wId);
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
