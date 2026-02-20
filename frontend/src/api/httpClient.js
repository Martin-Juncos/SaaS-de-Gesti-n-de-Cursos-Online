import { ApiError } from './apiError';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

function buildUrl(path) {
  if (!path.startsWith('/')) {
    throw new Error(`Invalid API path: ${path}`);
  }
  return `${API_BASE_URL}${path}`;
}

function normalizeServerError(payload, status) {
  const message =
    payload?.error || payload?.message || `Request failed with status ${status}`;
  return new ApiError(message, {
    status,
    code: payload?.code || 'server_error',
    details: payload?.details || null
  });
}

export async function httpRequest(path, options = {}) {
  const { method = 'GET', token, body, headers = {} } = options;
  const requestHeaders = {
    ...headers
  };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(buildUrl(path), {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch (error) {
    throw new ApiError('Network error. Check server connectivity.', {
      code: 'network_error',
      details: error
    });
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (_error) {
    payload = null;
  }

  if (!response.ok) {
    throw normalizeServerError(payload, response.status);
  }

  return payload?.data ?? payload;
}
