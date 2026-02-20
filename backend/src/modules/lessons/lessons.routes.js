const { Router } = require('express');
const { listByCourse, create, update, remove } = require('./lessons.controller');
const { authenticateJwt, optionalAuthenticateJwt } = require('../../middlewares/authenticateJwt');
const requireRoles = require('../../middlewares/requireRoles');

const router = Router();

router.get('/courses/:courseId/lessons', optionalAuthenticateJwt, listByCourse);
router.post(
  '/courses/:courseId/lessons',
  authenticateJwt,
  requireRoles('admin', 'instructor'),
  create
);
router.patch('/lessons/:lessonId', authenticateJwt, requireRoles('admin', 'instructor'), update);
router.delete('/lessons/:lessonId', authenticateJwt, requireRoles('admin', 'instructor'), remove);

module.exports = router;
