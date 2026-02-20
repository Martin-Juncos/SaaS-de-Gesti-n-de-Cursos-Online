const pool = require('../../db/pool');

function toProgressPercent(completedLessons, totalLessons) {
  if (!totalLessons) {
    return 0;
  }
  return Math.round((completedLessons / totalLessons) * 100);
}

async function enrollStudent(courseId, studentId) {
  const result = await pool.query(
    `
    INSERT INTO enrollments (course_id, student_id)
    VALUES ($1, $2)
    ON CONFLICT (course_id, student_id) DO NOTHING
    RETURNING id, created_at;
  `,
    [courseId, studentId]
  );

  if (result.rowCount === 0) {
    return { created: false };
  }

  return {
    created: true,
    enrollmentId: result.rows[0].id,
    enrolledAt: result.rows[0].created_at
  };
}

async function listStudentEnrollments(studentId) {
  const result = await pool.query(
    `
    SELECT
      c.id AS course_id,
      c.title,
      c.description,
      c.is_published,
      c.instructor_id,
      u.full_name AS instructor_name,
      e.created_at AS enrolled_at,
      COALESCE(stats.total_lessons, 0)::INT AS total_lessons,
      COALESCE(stats.completed_lessons, 0)::INT AS completed_lessons
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    JOIN users u ON u.id = c.instructor_id
    LEFT JOIN LATERAL (
      SELECT
        COUNT(l.id)::INT AS total_lessons,
        COUNT(lp.id) FILTER (WHERE lp.completed = TRUE)::INT AS completed_lessons
      FROM lessons l
      LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = e.student_id
      WHERE l.course_id = c.id
    ) stats ON TRUE
    WHERE e.student_id = $1
    ORDER BY e.created_at DESC;
  `,
    [studentId]
  );

  return result.rows.map((row) => ({
    courseId: row.course_id,
    title: row.title,
    description: row.description,
    isPublished: row.is_published,
    instructorId: row.instructor_id,
    instructorName: row.instructor_name,
    enrolledAt: row.enrolled_at,
    totalLessons: row.total_lessons,
    completedLessons: row.completed_lessons,
    progressPercent: toProgressPercent(row.completed_lessons, row.total_lessons)
  }));
}

async function listCourseStudents(courseId) {
  const result = await pool.query(
    `
    SELECT
      u.id AS student_id,
      u.full_name,
      u.email,
      e.created_at AS enrolled_at,
      COALESCE(stats.total_lessons, 0)::INT AS total_lessons,
      COALESCE(stats.completed_lessons, 0)::INT AS completed_lessons
    FROM enrollments e
    JOIN users u ON u.id = e.student_id
    LEFT JOIN LATERAL (
      SELECT
        COUNT(l.id)::INT AS total_lessons,
        COUNT(lp.id) FILTER (WHERE lp.completed = TRUE)::INT AS completed_lessons
      FROM lessons l
      LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = e.student_id
      WHERE l.course_id = e.course_id
    ) stats ON TRUE
    WHERE e.course_id = $1
    ORDER BY e.created_at DESC;
  `,
    [courseId]
  );

  return result.rows.map((row) => ({
    studentId: row.student_id,
    fullName: row.full_name,
    email: row.email,
    enrolledAt: row.enrolled_at,
    totalLessons: row.total_lessons,
    completedLessons: row.completed_lessons,
    progressPercent: toProgressPercent(row.completed_lessons, row.total_lessons)
  }));
}

module.exports = {
  enrollStudent,
  listStudentEnrollments,
  listCourseStudents
};
