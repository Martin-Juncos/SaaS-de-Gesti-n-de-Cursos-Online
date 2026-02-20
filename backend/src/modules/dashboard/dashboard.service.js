const pool = require('../../db/pool');
const { listStudentEnrollments } = require('../enrollments/enrollments.service');

async function getInstructorDashboard(instructorId) {
  const coursesResult = await pool.query(
    `
    SELECT
      c.id AS course_id,
      c.title,
      c.is_published,
      COUNT(e.id)::INT AS students_count
    FROM courses c
    LEFT JOIN enrollments e ON e.course_id = c.id
    WHERE c.instructor_id = $1
    GROUP BY c.id
    ORDER BY c.created_at DESC;
  `,
    [instructorId]
  );

  const courses = coursesResult.rows.map((row) => ({
    courseId: row.course_id,
    title: row.title,
    isPublished: row.is_published,
    studentsCount: row.students_count
  }));

  const totalStudents = courses.reduce((acc, course) => acc + course.studentsCount, 0);

  return {
    totalCourses: courses.length,
    totalStudents,
    courses
  };
}

async function getStudentDashboard(studentId) {
  const enrollments = await listStudentEnrollments(studentId);
  const averageProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((acc, enrollment) => acc + enrollment.progressPercent, 0) /
            enrollments.length
        )
      : 0;

  return {
    totalEnrollments: enrollments.length,
    averageProgress,
    courses: enrollments
  };
}

async function getAdminDashboard() {
  const [users, courses, enrollments] = await Promise.all([
    pool.query('SELECT COUNT(*)::INT AS total FROM users;'),
    pool.query('SELECT COUNT(*)::INT AS total FROM courses;'),
    pool.query('SELECT COUNT(*)::INT AS total FROM enrollments;')
  ]);

  return {
    totalUsers: users.rows[0].total,
    totalCourses: courses.rows[0].total,
    totalEnrollments: enrollments.rows[0].total
  };
}

module.exports = {
  getInstructorDashboard,
  getStudentDashboard,
  getAdminDashboard
};
