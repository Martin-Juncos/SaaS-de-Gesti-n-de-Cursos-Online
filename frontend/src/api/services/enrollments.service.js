import { httpRequest } from '../httpClient';

export const enrollmentsService = {
  enroll(courseId, token) {
    return httpRequest(`/courses/${courseId}/enroll`, {
      method: 'POST',
      token
    });
  },

  myEnrollments(token) {
    return httpRequest('/enrollments/me', {
      method: 'GET',
      token
    });
  }
};
