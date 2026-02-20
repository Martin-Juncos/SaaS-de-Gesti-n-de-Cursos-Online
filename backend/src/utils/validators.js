const HttpError = require('./httpError');

function parsePositiveInt(value, fieldName) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${fieldName} must be a positive integer`);
  }
  return parsed;
}

function ensureString(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(400, `${fieldName} is required`);
  }
  return value.trim();
}

function ensureBoolean(value, fieldName) {
  if (typeof value !== 'boolean') {
    throw new HttpError(400, `${fieldName} must be a boolean`);
  }
  return value;
}

module.exports = {
  parsePositiveInt,
  ensureString,
  ensureBoolean
};
