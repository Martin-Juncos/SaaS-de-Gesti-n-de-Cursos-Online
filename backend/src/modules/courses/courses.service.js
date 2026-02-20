const pool = require('../../db/pool');

function mapCourse(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    instructorId: row.instructor_id,
    instructorName: row.instructor_name,
    isPublished: row.is_published,
    enrolledStudents: Number(row.enrolled_students || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function canManageCourse(viewer, course) {
  if (!viewer || !course) {
    return false;
  }
  if (viewer.role === 'admin') {
    return true;
  }
  return viewer.role === 'instructor' && viewer.id === course.instructorId;
}

async function isStudentEnrolled(courseId, studentId) {
  const result = await pool.query(
    'SELECT 1 FROM enrollments WHERE course_id = $1 AND student_id = $2 LIMIT 1;',
    [courseId, studentId]
  );
  return result.rowCount > 0;
}

async function listCourses({ viewer, mine }) {
  const where = [];
  const params = [];

  if (viewer?.role === 'admin') {
    // Admin can see all courses.
  } else if (viewer?.role === 'instructor') {
    if (mine) {
      params.push(viewer.id);
      where.push(`c.instructor_id = $${params.length}`);
    } else {
      params.push(viewer.id);
      where.push(`(c.is_published = TRUE OR c.instructor_id = $${params.length})`);
    }
  } else {
    where.push('c.is_published = TRUE');
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const result = await pool.query(
    `
    SELECT
      c.id,
      c.title,
      c.description,
      c.instructor_id,
      c.is_published,
      c.created_at,
      c.updated_at,
      u.full_name AS instructor_name,
      COUNT(e.id)::INT AS enrolled_students
    FROM courses c
    JOIN users u ON u.id = c.instructor_id
    LEFT JOIN enrollments e ON e.course_id = c.id
    ${whereSql}
    GROUP BY c.id, u.full_name
    ORDER BY c.created_at DESC;
  `,
    params
  );

  return result.rows.map(mapCourse);
}

async function getCourseById(courseId) {
  const result = await pool.query(
    `
    SELECT
      c.id,
      c.title,
      c.description,
      c.instructor_id,
      c.is_published,
      c.created_at,
      c.updated_at,
      u.full_name AS instructor_name,
      COUNT(e.id)::INT AS enrolled_students
    FROM courses c
    JOIN users u ON u.id = c.instructor_id
    LEFT JOIN enrollments e ON e.course_id = c.id
    WHERE c.id = $1
    GROUP BY c.id, u.full_name
    LIMIT 1;
  `,
    [courseId]
  );

  return result.rows[0] ? mapCourse(result.rows[0]) : null;
}

async function createCourse({ title, description, instructorId, isPublished }) {
  const result = await pool.query(
    `
    INSERT INTO courses (title, description, instructor_id, is_published)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `,
    [title, description, instructorId, Boolean(isPublished)]
  );

  return getCourseById(result.rows[0].id);
}

async function updateCourse(courseId, payload) {
  const updates = [];
  const params = [];

  if (typeof payload.title === 'string') {
    params.push(payload.title.trim());
    updates.push(`title = $${params.length}`);
  }

  if (typeof payload.description === 'string') {
    params.push(payload.description.trim());
    updates.push(`description = $${params.length}`);
  }

  if (typeof payload.isPublished === 'boolean') {
    params.push(payload.isPublished);
    updates.push(`is_published = $${params.length}`);
  }

  if (updates.length === 0) {
    return getCourseById(courseId);
  }

  params.push(courseId);
  await pool.query(
    `
    UPDATE courses
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE id = $${params.length};
  `,
    params
  );

  return getCourseById(courseId);
}

async function deleteCourse(courseId) {
  await pool.query('DELETE FROM courses WHERE id = $1;', [courseId]);
}

module.exports = {
  listCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  canManageCourse,
  isStudentEnrolled
};
