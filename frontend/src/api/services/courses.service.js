import { httpRequest } from '../httpClient';

export const coursesService = {
  list({ token, mine = false } = {}) {
    const query = mine ? '?mine=true' : '';
    return httpRequest(`/courses${query}`, {
      method: 'GET',
      token
    });
  },

  getById(courseId, { token } = {}) {
    return httpRequest(`/courses/${courseId}`, {
      method: 'GET',
      token
    });
  },

  create(payload, token) {
    return httpRequest('/courses', {
      method: 'POST',
      token,
      body: payload
    });
  },

  update(courseId, payload, token) {
    return httpRequest(`/courses/${courseId}`, {
      method: 'PATCH',
      token,
      body: payload
    });
  },

  remove(courseId, token) {
    return httpRequest(`/courses/${courseId}`, {
      method: 'DELETE',
      token
    });
  },

  listLessons(courseId, { token } = {}) {
    return httpRequest(`/courses/${courseId}/lessons`, {
      method: 'GET',
      token
    });
  },

  createLesson(courseId, payload, token) {
    return httpRequest(`/courses/${courseId}/lessons`, {
      method: 'POST',
      token,
      body: payload
    });
  },

  updateLesson(lessonId, payload, token) {
    return httpRequest(`/lessons/${lessonId}`, {
      method: 'PATCH',
      token,
      body: payload
    });
  },

  deleteLesson(lessonId, token) {
    return httpRequest(`/lessons/${lessonId}`, {
      method: 'DELETE',
      token
    });
  },

  listStudents(courseId, token) {
    return httpRequest(`/courses/${courseId}/students`, {
      method: 'GET',
      token
    });
  }
};
