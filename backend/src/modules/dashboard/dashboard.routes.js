const { Router } = require('express');
const { instructor, student, admin } = require('./dashboard.controller');
const { authenticateJwt } = require('../../middlewares/authenticateJwt');
const requireRoles = require('../../middlewares/requireRoles');

const router = Router();

router.get('/instructor', authenticateJwt, requireRoles('instructor', 'admin'), instructor);
router.get('/student', authenticateJwt, requireRoles('student'), student);
router.get('/admin', authenticateJwt, requireRoles('admin'), admin);

module.exports = router;
