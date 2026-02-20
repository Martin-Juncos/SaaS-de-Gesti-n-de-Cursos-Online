const { verifyAccessToken } = require('../utils/jwt');

function extractBearerToken(authorizationHeader) {
  if (!authorizationHeader || typeof authorizationHeader !== 'string') {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

function authenticateJwt(req, res, next) {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: Number(payload.sub),
      role: payload.role,
      email: payload.email
    };
    return next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }
}

function optionalAuthenticateJwt(req, _res, next) {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: Number(payload.sub),
      role: payload.role,
      email: payload.email
    };
    return next();
  } catch (_error) {
    return _res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }
}

module.exports = {
  authenticateJwt,
  optionalAuthenticateJwt
};
