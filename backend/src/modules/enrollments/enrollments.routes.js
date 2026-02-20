const { Router } = require('express');
const { enroll, myEnrollments, courseStudents } = require('./enrollments.controller');
const { authenticateJwt } = require('../../middlewares/authenticateJwt');
const requireRoles = require('../../middlewares/requireRoles');

const router = Router();

router.post('/courses/:courseId/enroll', authenticateJwt, requireRoles('student'), enroll);
router.get('/enrollments/me', authenticateJwt, requireRoles('student'), myEnrollments);
router.get(
  '/courses/:courseId/students',
  authenticateJwt,
  requireRoles('admin', 'instructor'),
  courseStudents
);

module.exports = router;
