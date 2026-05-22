/**
 * Seed script — creates sample workshops and videos for development.
 * Usage: node scripts/seed.js
 */
require('dotenv').config();

const mongoose = require('mongoose');
const { env } = require('../src/config/env');
const User = require('../src/models/User');
const Workshop = require('../src/models/Workshop');
const Video = require('../src/models/Video');

async function seed() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@aiscale.in' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin',
        email: 'admin@aiscale.in',
        passwordHash: 'admin123456',
        role: 'admin',
        isEmailVerified: true,
      });
      await admin.save();
      console.log('✅ Admin user created (admin@aiscale.in / admin123456)');
    }

    // Create test user
    const testUserExists = await User.findOne({ email: 'test@aiscale.in' });
    if (!testUserExists) {
      const testUser = new User({
        name: 'Test User',
        email: 'test@aiscale.in',
        passwordHash: 'test123456',
        role: 'user',
        isEmailVerified: true,
      });
      await testUser.save();
      console.log('✅ Test user created (test@aiscale.in / test123456)');
    }

    // Create sample workshops
    const workshopCount = await Workshop.countDocuments();
    if (workshopCount === 0) {
      const workshops = [
        {
          title: 'AI for Marketing Professionals',
          description: 'Designed for marketing and growth professionals to apply AI and analytics across acquisition, retention, personalization, and measurement.',
          instructor: 'Ashok Veda',
          price: 41559,
          currency: 'INR',
          thumbnail: '/workshops/ai-marketing.jpg',
          tags: ['ai', 'marketing', 'analytics'],
          isActive: true,
          slots: [
            {
              date: new Date('2026-06-15'),
              startTime: '10:00',
              endTime: '12:30',
              totalSeats: 50,
              bookedSeats: 12,
              isAvailable: true,
              meetingLink: 'https://meet.google.com/abc-defg-hij',
            },
            {
              date: new Date('2026-06-22'),
              startTime: '14:00',
              endTime: '16:30',
              totalSeats: 50,
              bookedSeats: 5,
              isAvailable: true,
              meetingLink: 'https://meet.google.com/klm-nopq-rst',
            },
            {
              date: new Date('2026-07-06'),
              startTime: '10:00',
              endTime: '12:30',
              totalSeats: 30,
              bookedSeats: 0,
              isAvailable: true,
              meetingLink: '',
            },
          ],
        },
        {
          title: 'Microsoft Copilot 365 Workshop',
          description: 'Learn how Microsoft Copilot 365 can boost your team\'s daily work by integrating AI directly into tools like Outlook, Word, Excel, and Teams.',
          instructor: 'Agata Chudzińska',
          price: 31140,
          currency: 'INR',
          thumbnail: '/workshops/copilot.jpg',
          tags: ['microsoft', 'copilot', 'productivity'],
          isActive: true,
          slots: [
            {
              date: new Date('2026-06-10'),
              startTime: '09:00',
              endTime: '11:30',
              totalSeats: 40,
              bookedSeats: 30,
              isAvailable: true,
              meetingLink: 'https://teams.microsoft.com/l/meetup-join/xxx',
            },
            {
              date: new Date('2026-06-20'),
              startTime: '14:00',
              endTime: '16:30',
              totalSeats: 40,
              bookedSeats: 0,
              isAvailable: true,
              meetingLink: '',
            },
          ],
        },
        {
          title: 'Data Science with Python',
          description: 'Comprehensive introduction to data science using Python, covering pandas, numpy, matplotlib, and scikit-learn for real-world data analysis.',
          instructor: 'Ashok Veda',
          price: 47347,
          currency: 'INR',
          thumbnail: '/workshops/data-science.jpg',
          tags: ['data-science', 'python', 'machine-learning'],
          isActive: true,
          slots: [
            {
              date: new Date('2026-07-01'),
              startTime: '10:00',
              endTime: '13:00',
              totalSeats: 60,
              bookedSeats: 8,
              isAvailable: true,
              meetingLink: '',
            },
          ],
        },
      ];

      await Workshop.insertMany(workshops);
      console.log(`✅ ${workshops.length} workshops created`);
    }

    // Create sample videos
    const videoCount = await Video.countDocuments();
    if (videoCount === 0) {
      const videos = [
        {
          title: 'Introduction to AI in Marketing',
          description: 'A comprehensive overview of how AI is transforming marketing strategies and customer engagement.',
          thumbnail: '/videos/ai-intro.jpg',
          duration: 2400, // 40 min
          price: 999,
          currency: 'INR',
          s3Key: 'videos/ai-marketing-intro.mp4',
          isPublished: true,
          tags: ['ai', 'marketing', 'beginner'],
        },
        {
          title: 'Advanced Prompt Engineering',
          description: 'Master the art of crafting effective prompts for ChatGPT, Claude, and other LLMs to maximize productivity.',
          thumbnail: '/videos/prompt-engineering.jpg',
          duration: 3600, // 60 min
          price: 1499,
          currency: 'INR',
          s3Key: 'videos/prompt-engineering.mp4',
          isPublished: true,
          tags: ['ai', 'prompt-engineering', 'advanced'],
        },
        {
          title: 'Microsoft Copilot Deep Dive',
          description: 'In-depth walkthrough of Microsoft Copilot features across Word, Excel, PowerPoint, and Teams.',
          thumbnail: '/videos/copilot-deep.jpg',
          duration: 5400, // 90 min
          price: 1999,
          currency: 'INR',
          s3Key: 'videos/copilot-deep-dive.mp4',
          isPublished: true,
          tags: ['microsoft', 'copilot', 'productivity'],
        },
        {
          title: 'Building AI Workflows with No Code',
          description: 'Learn to build automated AI workflows using tools like Zapier, Make, and native AI integrations.',
          thumbnail: '/videos/no-code-ai.jpg',
          duration: 2700, // 45 min
          price: 799,
          currency: 'INR',
          s3Key: 'videos/no-code-ai.mp4',
          isPublished: true,
          tags: ['ai', 'no-code', 'automation'],
        },
      ];

      await Video.insertMany(videos);
      console.log(`✅ ${videos.length} videos created`);
    }

    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
