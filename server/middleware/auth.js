const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Token missing.' });
  }

  try {
    const header = jwt.decode(token, { complete: true })?.header;
    const algorithm = header?.alg || 'HS256';
    
    // Use Public Key for ES256, or Secret for HS256
    let secretOrKey = algorithm === 'ES256' 
      ? process.env.SUPABASE_JWT_PUBLIC_KEY 
      : process.env.SUPABASE_JWT_SECRET;

    if (!secretOrKey) {
        throw new Error(`Missing key for algorithm ${algorithm}`);
    }

    // Ensure asymmetric keys have correct newline formatting
    if (algorithm === 'ES256') {
        secretOrKey = secretOrKey.replace(/\\n/g, '\n');
        
        // Validation: Must start with -----BEGIN PUBLIC KEY-----
        if (!secretOrKey.startsWith('-----BEGIN')) {
             console.warn("⚠️ Warning: ES256 Public Key is missing PEM headers. Attempting to wrap...");
             secretOrKey = `-----BEGIN PUBLIC KEY-----\n${secretOrKey}\n-----END PUBLIC KEY-----`;
        }
    }

    console.log(`🔑 Key check: ${secretOrKey.substring(0, 25)}... (Length: ${secretOrKey.length})`);

    const decoded = jwt.verify(token, secretOrKey, { algorithms: [algorithm] });
    req.user = decoded; 
    next();
  } catch (err) {
    console.error("❌ Auth Middleware Error:", err.message);
    return res.status(401).json({ 
      error: 'Invalid or expired token.',
      details: err.message 
    });
  }
};

module.exports = { authenticate };
