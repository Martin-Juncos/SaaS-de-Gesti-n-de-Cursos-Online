const pool = require('../../db/pool');

function toProgressPercent(completed, total) {
  if (!total) {
    return 0;
  }
  return Math.round((completed / total) * 100);
}

async function getLessonContext(lessonId) {
  const result = await pool.query(
    `
    SELECT l.id, l.course_id, l.title, l.position
    FROM lessons l
    WHERE l.id = $1
    LIMIT 1;
  `,
    [lessonId]
  );

  return result.rows[0] || null;
}

async function markLessonProgress(studentId, lessonId, completed) {
  const completedAt = completed ? new Date().toISOString() : null;
  const result = await pool.query(
    `
    INSERT INTO lesson_progress (lesson_id, student_id, completed, completed_at, updated_at)
    VALUES ($1, $2, $3, $4, NOW())
    ON CONFLICT (lesson_id, student_id)
    DO UPDATE SET
      completed = EXCLUDED.completed,
      completed_at = EXCLUDED.completed_at,
      updated_at = NOW()
    RETURNING id, lesson_id, student_id, completed, completed_at, updated_at;
  `,
    [lessonId, studentId, completed, completedAt]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    lessonId: row.lesson_id,
    studentId: row.student_id,
    completed: row.completed,
    completedAt: row.completed_at,
    updatedAt: row.updated_at
  };
}

async function getCourseProgress(studentId, courseId) {
  const lessonsResult = await pool.query(
    `
    SELECT
      l.id AS lesson_id,
      l.title,
      l.position,
      COALESCE(lp.completed, FALSE) AS completed,
      lp.completed_at
    FROM lessons l
    LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = $2
    WHERE l.course_id = $1
    ORDER BY l.position ASC;
  `,
    [courseId, studentId]
  );

  const lessons = lessonsResult.rows.map((row) => ({
    lessonId: row.lesson_id,
    title: row.title,
    position: row.position,
    completed: row.completed,
    completedAt: row.completed_at
  }));

  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((lesson) => lesson.completed).length;

  return {
    courseId,
    totalLessons,
    completedLessons,
    progressPercent: toProgressPercent(completedLessons, totalLessons),
    lessons
  };
}

module.exports = {
  getLessonContext,
  markLessonProgress,
  getCourseProgress
};
