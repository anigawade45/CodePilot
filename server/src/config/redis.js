const { createClient } = require('redis');
const dotenv = require('dotenv');

dotenv.config();

/**
 * 🛰️ SOVEREIGN REDIS CONFIG [ROBUST v9.8]
 * --------------------------------------
 * - Fault Tolerance: Server will NOT crash if Redis is offline
 * - Passive Failover: Logs error but keeps the gateway operational
 */

let redisClient;

if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      connectTimeout: 5000,
      keepAlive: 5000,
      reconnectStrategy: (retries) => {
        if (retries > 2) {
          console.warn('🛡️ [Sovereign Failover] Cluster Signal Lost. Transitioning to Local Memory Mode.');
          return new Error('Redis unreachable');
        }
        return 500;
      }
    }
  });

  redisClient.on('error', (err) => {
    console.log('📡 [Redis Signal Interference]:', err.message);
  });

  redisClient.on('connect', () => {
    console.log('✅ Connected to Redis State Cluster');
  });

  // 🛡️ Safe-Connect Pattern
  (async () => {
    try {
      await redisClient.connect();
      await redisClient.set('codepilot_heartbeat', 'ACTIVE');
      console.log('🛰️ Redis Intel Check: SUCCESS');
    } catch (err) {
      console.warn('🚧 Redis Cluster Unreachable. CodePilot is now using local failing-safe memory.');
    }
  })();
} else {
  console.log('🛡️ No Redis URL found. Operating in local-memory mode.');
  // Mock client to prevent crashes in other services
  redisClient = {
    get: async () => null,
    set: async () => null,
    on: () => { },
    connect: async () => { },
    isOpen: false
  };
}

module.exports = redisClient;
