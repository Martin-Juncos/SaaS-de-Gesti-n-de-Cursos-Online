const asyncHandler = require('../../utils/asyncHandler');
const HttpError = require('../../utils/httpError');
const { parsePositiveInt, ensureBoolean } = require('../../utils/validators');
const { getCourseById, isStudentEnrolled } = require('../courses/courses.service');
const { getLessonContext, markLessonProgress, getCourseProgress } = require('./progress.service');

const markByLesson = asyncHandler(async (req, res) => {
  const lessonId = parsePositiveInt(req.params.lessonId, 'lessonId');
  const completed =
    req.body.completed === undefined ? true : ensureBoolean(req.body.completed, 'completed');

  const lesson = await getLessonContext(lessonId);
  if (!lesson) {
    throw new HttpError(404, 'Lesson not found');
  }

  const enrolled = await isStudentEnrolled(lesson.course_id, req.user.id);
  if (!enrolled) {
    throw new HttpError(403, 'You must be enrolled in this course');
  }

  const progress = await markLessonProgress(req.user.id, lessonId, completed);
  res.status(200).json({
    success: true,
    data: { progress }
  });
});

const myCourseProgress = asyncHandler(async (req, res) => {
  const courseId = parsePositiveInt(req.params.courseId, 'courseId');
  const course = await getCourseById(courseId);
  if (!course) {
    throw new HttpError(404, 'Course not found');
  }

  const enrolled = await isStudentEnrolled(courseId, req.user.id);
  if (!enrolled) {
    throw new HttpError(403, 'You are not enrolled in this course');
  }

  const progress = await getCourseProgress(req.user.id, courseId);
  res.status(200).json({
    success: true,
    data: { progress }
  });
});

module.exports = {
  markByLesson,
  myCourseProgress
};
