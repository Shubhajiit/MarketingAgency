const { createClient } = require('redis');

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redisPassword = process.env.REDIS_PASSWORD || '';

// Construct connection URL: redis[s]://[[username]:password@]host:port
let redisUrl = 'redis://';
if (redisPassword) {
  redisUrl += `:${encodeURIComponent(redisPassword)}@`;
}
redisUrl += `${redisHost}:${redisPort}`;

console.log(`[Redis] Connecting to Redis URL: redis://${redisHost}:${redisPort} (password hidden)`);

const client = createClient({
  url: redisUrl
});

client.on('error', (err) => {
  console.error('[Redis] Client Error:', err.message);
});

client.on('connect', () => {
  console.log('[Redis] Client is connecting to the server...');
});

client.on('ready', () => {
  console.log('[Redis] Connected successfully');
});

// Start the connection
client.connect().catch((err) => {
  console.error('[Redis] Connection failed:', err.message);
});

const isConnected = () => {
  return client.isOpen && client.isReady;
};

/**
 * Get item from cache
 * @param {string} key 
 */
async function getCache(key) {
  if (!isConnected()) {
    return null;
  }
  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error(`[Redis] getCache error for key ${key}:`, err.message);
    return null;
  }
}

/**
 * Set item in cache with TTL
 * @param {string} key 
 * @param {any} value 
 * @param {number} ttlInSeconds 
 */
async function setCache(key, value, ttlInSeconds = 3600) {
  if (!isConnected()) {
    return false;
  }
  try {
    const serialized = JSON.stringify(value);
    await client.set(key, serialized, {
      EX: ttlInSeconds
    });
    return true;
  } catch (err) {
    console.error(`[Redis] setCache error for key ${key}:`, err.message);
    return false;
  }
}

/**
 * Delete item from cache
 * @param {string} key 
 */
async function delCache(key) {
  if (!isConnected()) {
    return false;
  }
  try {
    await client.del(key);
    return true;
  } catch (err) {
    console.error(`[Redis] delCache error for key ${key}:`, err.message);
    return false;
  }
}

/**
 * Delete items matching a pattern
 * @param {string} pattern 
 */
async function delCachePattern(pattern) {
  if (!isConnected()) {
    return false;
  }
  try {
    for await (const key of client.scanIterator({
      MATCH: pattern,
      COUNT: 100
    })) {
      await client.del(key);
    }
    return true;
  } catch (err) {
    console.error(`[Redis] delCachePattern error for pattern ${pattern}:`, err.message);
    return false;
  }
}

module.exports = {
  client,
  getCache,
  setCache,
  delCache,
  delCachePattern,
  isConnected
};
