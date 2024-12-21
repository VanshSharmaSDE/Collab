// config/auth.config.js
module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiration: 86400, // 24 hours
    refreshTokenExpiration: 604800, // 7 days
  };
  