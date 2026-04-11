const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const redisClient = require('../config/redis');

// 🛡️ SECURITY: Investigation Quota Engine
// Purpose: Protect AI budget (Gemini/OpenAI/Claude) from rapid abuse.
const investigationLimiter = rateLimit({
  // Use Redis for distributed state tracking
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: 'cp_rl:', // CodePilot Rate Limit
  }),
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // Limit each IP/User to 10 investigations per hour
  standardHeaders: true, 
  legacyHeaders: false, 
  keyGenerator: (req) => {
    // If authenticated, use User ID, otherwise fallback to IP
    return req.user ? req.user.sub : req.ip;
  },
  validate: false, // Bypass all strict pre-flight checks for custom logic
  message: {
    error: "High Traffic Protocol: AI Investigation Quota Reached",
    message: "To protect intelligence resources, we limit analysis to 10 per hour. Please wait for the cool-down period.",
    retryAfter: "60 minutes"
  }
});

module.exports = { investigationLimiter };
