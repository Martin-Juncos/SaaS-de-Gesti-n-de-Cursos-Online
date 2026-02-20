import { httpRequest } from '../httpClient';

export const authService = {
  register(payload) {
    return httpRequest('/auth/register', {
      method: 'POST',
      body: payload
    });
  },

  login(payload) {
    return httpRequest('/auth/login', {
      method: 'POST',
      body: payload
    });
  },

  me(token) {
    return httpRequest('/auth/me', {
      method: 'GET',
      token
    });
  }
};
