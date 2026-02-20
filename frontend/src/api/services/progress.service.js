import { httpRequest } from '../httpClient';

export const progressService = {
  markLesson(lessonId, completed, token) {
    return httpRequest(`/lessons/${lessonId}/progress`, {
      method: 'POST',
      token,
      body: { completed }
    });
  },

  myCourseProgress(courseId, token) {
    return httpRequest(`/courses/${courseId}/progress/me`, {
      method: 'GET',
      token
    });
  }
};
