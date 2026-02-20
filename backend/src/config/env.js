const dotenv = require('dotenv');

dotenv.config();

const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];

for (const key of requiredVars) {
  if (!process.env[key] || process.env[key].trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const port = Number(process.env.PORT || 4000);
if (!Number.isInteger(port) || port <= 0) {
  throw new Error('PORT must be a positive integer');
}

const databaseSslRaw = (process.env.DATABASE_SSL || 'false').toLowerCase();
if (!['true', 'false'].includes(databaseSslRaw)) {
  throw new Error("DATABASE_SSL must be 'true' or 'false'");
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: port,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_SSL: databaseSslRaw === 'true',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_ISSUER: process.env.JWT_ISSUER || 'course-saas',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'course-saas-users',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Platform Admin'
};
