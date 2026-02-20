const { Router } = require('express');
const { markByLesson, myCourseProgress } = require('./progress.controller');
const { authenticateJwt } = require('../../middlewares/authenticateJwt');
const requireRoles = require('../../middlewares/requireRoles');

const router = Router();

router.post('/lessons/:lessonId/progress', authenticateJwt, requireRoles('student'), markByLesson);
router.get(
  '/courses/:courseId/progress/me',
  authenticateJwt,
  requireRoles('student'),
  myCourseProgress
);

module.exports = router;
