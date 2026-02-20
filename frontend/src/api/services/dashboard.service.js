import { httpRequest } from '../httpClient';

export const dashboardService = {
  instructor(token) {
    return httpRequest('/dashboard/instructor', {
      method: 'GET',
      token
    });
  },

  student(token) {
    return httpRequest('/dashboard/student', {
      method: 'GET',
      token
    });
  },

  admin(token) {
    return httpRequest('/dashboard/admin', {
      method: 'GET',
      token
    });
  }
};
