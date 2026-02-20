const pool = require('../../db/pool');

function mapLesson(row) {
  return {
    id: row.id,
    courseId: row.course_id,
    title: row.title,
    content: row.content,
    position: row.position,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listLessonsByCourse(courseId) {
  const result = await pool.query(
    `
    SELECT id, course_id, title, content, position, created_at, updated_at
    FROM lessons
    WHERE course_id = $1
    ORDER BY position ASC;
  `,
    [courseId]
  );

  return result.rows.map(mapLesson);
}

async function getLessonById(lessonId) {
  const result = await pool.query(
    `
    SELECT id, course_id, title, content, position, created_at, updated_at
    FROM lessons
    WHERE id = $1
    LIMIT 1;
  `,
    [lessonId]
  );
  return result.rows[0] ? mapLesson(result.rows[0]) : null;
}

async function createLesson({ courseId, title, content, position }) {
  const result = await pool.query(
    `
    INSERT INTO lessons (course_id, title, content, position)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `,
    [courseId, title, content, position]
  );

  return getLessonById(result.rows[0].id);
}

async function updateLesson(lessonId, payload) {
  const updates = [];
  const params = [];

  if (typeof payload.title === 'string') {
    params.push(payload.title.trim());
    updates.push(`title = $${params.length}`);
  }

  if (typeof payload.content === 'string') {
    params.push(payload.content);
    updates.push(`content = $${params.length}`);
  }

  if (Number.isInteger(payload.position)) {
    params.push(payload.position);
    updates.push(`position = $${params.length}`);
  }

  if (updates.length === 0) {
    return getLessonById(lessonId);
  }

  params.push(lessonId);
  await pool.query(
    `
    UPDATE lessons
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE id = $${params.length};
  `,
    params
  );

  return getLessonById(lessonId);
}

async function deleteLesson(lessonId) {
  await pool.query('DELETE FROM lessons WHERE id = $1;', [lessonId]);
}

module.exports = {
  listLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
};
