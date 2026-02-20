const { Router } = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const coursesRoutes = require('../modules/courses/courses.routes');
const lessonsRoutes = require('../modules/lessons/lessons.routes');
const enrollmentsRoutes = require('../modules/enrollments/enrollments.routes');
const progressRoutes = require('../modules/progress/progress.routes');
const dashboardRoutes = require('../modules/dashboard/dashboard.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', coursesRoutes);
router.use(lessonsRoutes);
router.use(enrollmentsRoutes);
router.use(progressRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
