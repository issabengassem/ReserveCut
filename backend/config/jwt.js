require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'votre-secret-jwt-tres-securise-changez-le',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};
