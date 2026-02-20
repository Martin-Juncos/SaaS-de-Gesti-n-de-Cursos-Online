const asyncHandler = require('../../utils/asyncHandler');
const HttpError = require('../../utils/httpError');
const { parsePositiveInt, ensureString, ensureBoolean } = require('../../utils/validators');
const {
  listCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  canManageCourse,
  isStudentEnrolled
} = require('./courses.service');

const list = asyncHandler(async (req, res) => {
  const mine = req.query.mine === 'true';
  const courses = await listCourses({
    viewer: req.user || null,
    mine
  });

  res.status(200).json({
    success: true,
    data: { courses }
  });
});

const getById = asyncHandler(async (req, res) => {
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
      throw new HttpError(403, 'You cannot access this course');
    }
  }

  res.status(200).json({
    success: true,
    data: { course }
  });
});

const create = asyncHandler(async (req, res) => {
  const title = ensureString(req.body.title, 'title');
  const description = typeof req.body.description === 'string' ? req.body.description : '';

  let instructorId = req.user.id;
  if (req.user.role === 'admin' && req.body.instructorId !== undefined) {
    instructorId = parsePositiveInt(req.body.instructorId, 'instructorId');
  }

  const isPublished =
    req.body.isPublished === undefined ? false : ensureBoolean(req.body.isPublished, 'isPublished');

  const course = await createCourse({
    title,
    description,
    instructorId,
    isPublished
  });

  res.status(201).json({
    success: true,
    data: { course }
  });
});

const update = asyncHandler(async (req, res) => {
  const courseId = parsePositiveInt(req.params.courseId, 'courseId');
  const current = await getCourseById(courseId);
  if (!current) {
    throw new HttpError(404, 'Course not found');
  }

  if (!canManageCourse(req.user, current)) {
    throw new HttpError(403, 'You cannot update this course');
  }

  const payload = {};
  if (req.body.title !== undefined) {
    payload.title = ensureString(req.body.title, 'title');
  }
  if (req.body.description !== undefined) {
    payload.description = String(req.body.description);
  }
  if (req.body.isPublished !== undefined) {
    payload.isPublished = ensureBoolean(req.body.isPublished, 'isPublished');
  }

  const course = await updateCourse(courseId, payload);
  res.status(200).json({
    success: true,
    data: { course }
  });
});

const remove = asyncHandler(async (req, res) => {
  const courseId = parsePositiveInt(req.params.courseId, 'courseId');
  const current = await getCourseById(courseId);
  if (!current) {
    throw new HttpError(404, 'Course not found');
  }

  if (!canManageCourse(req.user, current)) {
    throw new HttpError(403, 'You cannot delete this course');
  }

  await deleteCourse(courseId);
  res.status(200).json({
    success: true,
    data: { deleted: true }
  });
});

module.exports = {
  list,
  getById,
  create,
  update,
  remove
};
