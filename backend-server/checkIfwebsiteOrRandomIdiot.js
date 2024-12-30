const rateLimit = require('express-rate-limit');

const validateApiKey = (req, res, next) => {
    const frontendApiKey = req.headers['x-api-key']; // API key from the request
    const validFrontendApiKey = process.env.FRONTAPIKEY; // Stored API key in the backend
  
    if (frontendApiKey === validFrontendApiKey) {
      next(); // Valid key: Proceed with the request
    } else {
      res.status(403).json({ error: 'Forbidden: Invalid API key' }); // Invalid key: Block the request
    }
};

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

module.exports = { validateApiKey, limiter };