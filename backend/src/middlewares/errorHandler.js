const HttpError = require('../utils/httpError');

function errorHandler(error, _req, res, _next) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      success: false,
      error: error.message,
      details: error.details || undefined
    });
  }

  console.error(error);
  return res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
}

module.exports = errorHandler;
