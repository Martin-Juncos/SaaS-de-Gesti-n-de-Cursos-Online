const asyncHandler = require('../../utils/asyncHandler');
const HttpError = require('../../utils/httpError');
const { parsePositiveInt } = require('../../utils/validators');
const { getCourseById, canManageCourse } = require('../courses/courses.service');
const { enrollStudent, listStudentEnrollments, listCourseStudents } = require('./enrollments.service');

const enroll = asyncHandler(async (req, res) => {
  const courseId = parsePositiveInt(req.params.courseId, 'courseId');
  const course = await getCourseById(courseId);
  if (!course) {
    throw new HttpError(404, 'Course not found');
  }

  if (!course.isPublished) {
    throw new HttpError(403, 'Cannot enroll in an unpublished course');
  }

  const result = await enrollStudent(courseId, req.user.id);
  res.status(result.created ? 201 : 200).json({
    success: true,
    data: result
  });
});

const myEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await listStudentEnrollments(req.user.id);
  res.status(200).json({
    success: true,
    data: { enrollments }
  });
});

const courseStudents = asyncHandler(async (req, res) => {
  const courseId = parsePositiveInt(req.params.courseId, 'courseId');
  const course = await getCourseById(courseId);
  if (!course) {
    throw new HttpError(404, 'Course not found');
  }

  if (!canManageCourse(req.user, course)) {
    throw new HttpError(403, 'You cannot access students for this course');
  }

  const students = await listCourseStudents(courseId);
  res.status(200).json({
    success: true,
    data: { students }
  });
});

module.exports = {
  enroll,
  myEnrollments,
  courseStudents
};
