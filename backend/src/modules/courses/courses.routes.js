const { Router } = require('express');
const {
  list,
  getById,
  create,
  update,
  remove
} = require('./courses.controller');
const { authenticateJwt, optionalAuthenticateJwt } = require('../../middlewares/authenticateJwt');
const requireRoles = require('../../middlewares/requireRoles');

const router = Router();

router.get('/', optionalAuthenticateJwt, list);
router.get('/:courseId', optionalAuthenticateJwt, getById);
router.post('/', authenticateJwt, requireRoles('admin', 'instructor'), create);
router.patch('/:courseId', authenticateJwt, requireRoles('admin', 'instructor'), update);
router.delete('/:courseId', authenticateJwt, requireRoles('admin', 'instructor'), remove);

module.exports = router;
