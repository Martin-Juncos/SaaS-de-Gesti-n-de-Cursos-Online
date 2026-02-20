const asyncHandler = require('../../utils/asyncHandler');
const HttpError = require('../../utils/httpError');
const { parsePositiveInt, ensureString } = require('../../utils/validators');
const { getCourseById, canManageCourse, isStudentEnrolled } = require('../courses/courses.service');
const {
  listLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
} = require('./lessons.service');

const listByCourse = asyncHandler(async (req, res) => {
  const courseId = parsePositiveInt(req.params.courseId, 'courseId');
  const course = await getCourseById(courseId);
  if (!course) {
    throw new HttpError(404, 'Course not found');
  }

  if (!course.isPublished) {
    const canManage = canManageCourse(req.user, course);
    const studentCanAccess =
      req.user?.role === 'student' && (await isStudentEnrolled(courseId, req.user.id));
    if (!canManage && !studentCanAccess) {
      throw new HttpError(403, 'You cannot access lessons for this course');
    }
  }

  const lessons = await listLessonsByCourse(courseId);
  res.status(200).json({
    success: true,
    data: { lessons }
  });
});

const create = asyncHandler(async (req, res) => {
  const courseId = parsePositiveInt(req.params.courseId, 'courseId');
  const course = await getCourseById(courseId);
  if (!course) {
    throw new HttpError(404, 'Course not found');
  }
  if (!canManageCourse(req.user, course)) {
    throw new HttpError(403, 'You cannot create lessons for this course');
  }

  const title = ensureString(req.body.title, 'title');
  const content = typeof req.body.content === 'string' ? req.body.content : '';
  const position =
    req.body.position === undefined ? 1 : parsePositiveInt(req.body.position, 'position');

  const lesson = await createLesson({ courseId, title, content, position });
  res.status(201).json({
    success: true,
    data: { lesson }
  });
});

const update = asyncHandler(async (req, res) => {
  const lessonId = parsePositiveInt(req.params.lessonId, 'lessonId');
  const current = await getLessonById(lessonId);
  if (!current) {
    throw new HttpError(404, 'Lesson not found');
  }

  const course = await getCourseById(current.courseId);
  if (!course || !canManageCourse(req.user, course)) {
    throw new HttpError(403, 'You cannot update this lesson');
  }

  const payload = {};
  if (req.body.title !== undefined) {
    payload.title = ensureString(req.body.title, 'title');
  }
  if (req.body.content !== undefined) {
    payload.content = String(req.body.content);
  }
  if (req.body.position !== undefined) {
    payload.position = parsePositiveInt(req.body.position, 'position');
  }

  const lesson = await updateLesson(lessonId, payload);
  res.status(200).json({
    success: true,
    data: { lesson }
  });
});

const remove = asyncHandler(async (req, res) => {
  const lessonId = parsePositiveInt(req.params.lessonId, 'lessonId');
  const current = await getLessonById(lessonId);
  if (!current) {
    throw new HttpError(404, 'Lesson not found');
  }

  const course = await getCourseById(current.courseId);
  if (!course || !canManageCourse(req.user, course)) {
    throw new HttpError(403, 'You cannot delete this lesson');
  }

  await deleteLesson(lessonId);
  res.status(200).json({
    success: true,
    data: { deleted: true }
  });
});

module.exports = {
  listByCourse,
  create,
  update,
  remove
};
