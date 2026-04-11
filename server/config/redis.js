const { createClient } = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    connectTimeout: 10000, // 10s timeout
    keepAlive: 5000,
    reconnectStrategy: (retries) => Math.min(retries * 50, 2000)
  }
});

redisClient.on('error', (err) => console.log('Redis Cluster Error:', err));
redisClient.on('connect', () => console.log('📡 Connected to Redis State Cluster'));

(async () => {
  try {
    await redisClient.connect();
    // 🧪 Connectivity Test
    await redisClient.set('codepilot_heartbeat', 'ACTIVE');
    const status = await redisClient.get('codepilot_heartbeat');
    console.log(`✅ Redis Intel Check: ${status}`);
  } catch (err) {
    console.error('CRITICAL: Redis Connection Failed. Falling back to in-memory state.', err);
  }
})();

module.exports = redisClient;
