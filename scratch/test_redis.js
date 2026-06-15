// const { createClient } = require('redis');

// const redisHost = 'redis-13460.crce310.us-east-1-6.ec2.cloud.redislabs.com';
// const redisPort = 13460;

// const client = createClient({
//   url: `redis://${redisHost}:${redisPort}`
// });

// client.on('error', (err) => {
//   console.error('Redis connection error:', err.message);
//   process.exit(1);
// });

// async function run() {
//   console.log('Connecting to Redis...');
//   await client.connect();
//   console.log('Connected!');

//   console.log('Setting test key...');
//   await client.set('test_key', 'Antigravity Verified ' + new Date().toISOString(), { EX: 10 });
//   console.log('Set successful.');

//   console.log('Getting test key...');
//   const val = await client.get('test_key');
//   console.log('Got value:', val);

//   await client.disconnect();
//   console.log('Disconnected cleanly.');
//   process.exit(0);
// }

// run().catch((err) => {
//   console.error('Run failed:', err);
//   process.exit(1);
// });
