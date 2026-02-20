const asyncHandler = require('../../utils/asyncHandler');
const HttpError = require('../../utils/httpError');
const { parsePositiveInt } = require('../../utils/validators');
const {
  getInstructorDashboard,
  getStudentDashboard,
  getAdminDashboard
} = require('./dashboard.service');

const instructor = asyncHandler(async (req, res) => {
  let instructorId = req.user.id;

  if (req.user.role === 'admin') {
    if (!req.query.instructorId) {
      throw new HttpError(400, 'instructorId query param is required for admin');
    }
    instructorId = parsePositiveInt(req.query.instructorId, 'instructorId');
  }

  const dashboard = await getInstructorDashboard(instructorId);
  res.status(200).json({
    success: true,
    data: dashboard
  });
});

const student = asyncHandler(async (req, res) => {
  const dashboard = await getStudentDashboard(req.user.id);
  res.status(200).json({
    success: true,
    data: dashboard
  });
});

const admin = asyncHandler(async (_req, res) => {
  const dashboard = await getAdminDashboard();
  res.status(200).json({
    success: true,
    data: dashboard
  });
});

module.exports = {
  instructor,
  student,
  admin
};
