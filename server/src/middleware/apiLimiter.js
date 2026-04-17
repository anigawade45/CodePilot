const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const redisClient = require('../config/redis');

// 🛡️ SECURITY: Investigation Quota Engine [v10.0]
// Purpose: Protect AI budget while granting UNLIMITED Local Sovereign Ingress.
const investigationLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: 'cp_rl:', 
  }),
  windowMs: 60 * 60 * 1000, 
  max: 100, // Standard quota (Increased for Dev/Test)
  
  // 🛰️ SOVEREIGN BYPASS: If using local brain, skip all quota checks
  skip: (req) => {
    const isLocal = req.body?.aiConfig?.provider === 'local';
    if (isLocal) {
        console.log("🛡️ [Sovereign Bypass] Local Ingress detected. Quota Lifted.");
        return true;
    }
    return false;
  },

  standardHeaders: true, 
  legacyHeaders: false, 
  
  // 🛡️ COMPLIANCE: Silicon-Grade Key Generation
  keyGenerator: (req) => {
    if (req.user && req.user.sub) return req.user.sub;
    return req.ip || 'anonymous';
  },

  // 🧬 TOTAL OVERRIDE: Disable all strict library validations for dev stability
  validate: false,

  message: {
    error: "High Traffic Protocol: AI Investigation Quota Reached",
    message: "Cloud resource quota met. To bypass this, switch to 'Local' architect in settings.",
    retryAfter: "60 minutes"
  }
});

module.exports = { investigationLimiter };
