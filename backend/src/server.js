require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const seedCourses = require('./utils/seeder');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    await seedCourses();
    
    // Resume any pending workshop cancellation email queues
    const { resumePendingCancellations } = require('./utils/cancellationQueue');
    resumePendingCancellations().catch(err => console.error('[Server] Startup cancellation resume error:', err));

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
