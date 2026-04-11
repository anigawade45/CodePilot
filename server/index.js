const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

const reviewRoutes = require('./routes/reviewRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

// 🛡️ SECURITY: Hardened Headers
app.use(helmet());

// Security Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased for analysis tasks
  message: { error: "Security Guard: Too many requests from this IP. Cooling down." }
});

app.use(globalLimiter);
app.use(express.json());

// 📝 DIAGNOSTICS: Traffic Logger
app.use((req, res, next) => {
  console.log(`📡 [${req.method}] ${req.url}`);
  next();
});

// Routes
app.use('/api', reviewRoutes);
app.use('/api', fileRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 AI Review Backend Scaled to Production Logic`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🔑 Auth: Supabase Protected`);
});
