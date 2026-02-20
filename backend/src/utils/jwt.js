const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signAccessToken(user) {
  const payload = {
    sub: String(user.id),
    role: user.role,
    email: user.email
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: env.JWT_EXPIRES_IN,
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET, {
    algorithms: ['HS256'],
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE
  });
}

module.exports = {
  signAccessToken,
  verifyAccessToken
};
