import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { coursesService, enrollmentsService, progressService } from '../api/services';
import { useAuth } from '../hooks/useAuth';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { token, user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [position, setPosition] = useState(1);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const canManageCourse =
    isAuthenticated &&
    user &&
    (user.role === 'admin' || (user.role === 'instructor' && user.id === course?.instructorId));

  const isStudent = isAuthenticated && user?.role === 'student';
  const progressByLesson = useMemo(() => {
    const map = new Map();
    if (!progress?.lessons) {
      return map;
    }
    for (const lesson of progress.lessons) {
      map.set(lesson.lessonId, lesson.completed);
    }
    return map;
  }, [progress]);

  async function loadCourseData() {
    setIsLoading(true);
    setError('');

    try {
      const [courseData, lessonsData] = await Promise.all([
        coursesService.getById(courseId, { token: token || undefined }),
        coursesService.listLessons(courseId, { token: token || undefined })
      ]);
      setCourse(courseData.course);
      setLessons(lessonsData.lessons || []);

      if (isStudent && token) {
        const enrollmentsData = await enrollmentsService.myEnrollments(token);
        const enrolled = (enrollmentsData.enrollments || []).some(
          (enrollment) => String(enrollment.courseId) === String(courseId)
        );
        setIsEnrolled(enrolled);

        if (enrolled) {
          const progressData = await progressService.myCourseProgress(courseId, token);
          setProgress(progressData.progress);
        } else {
          setProgress(null);
        }
      }
    } catch (apiError) {
      setError(apiError.message || 'No se pudo cargar el curso');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCourseData();
  }, [courseId, token, isStudent]);

  async function handleEnroll() {
    if (!token) {
      return;
    }

    setIsEnrolling(true);
    setError('');
    try {
      await enrollmentsService.enroll(courseId, token);
      const progressData = await progressService.myCourseProgress(courseId, token);
      setIsEnrolled(true);
      setProgress(progressData.progress);
    } catch (apiError) {
      setError(apiError.message || 'No se pudo completar la inscripcion');
    } finally {
      setIsEnrolling(false);
    }
  }

  async function toggleLessonProgress(lessonId, completed) {
    if (!token) {
      return;
    }

    setError('');
    try {
      await progressService.markLesson(lessonId, completed, token);
      const progressData = await progressService.myCourseProgress(courseId, token);
      setProgress(progressData.progress);
    } catch (apiError) {
      setError(apiError.message || 'No se pudo actualizar el progreso');
    }
  }

  async function handleCreateLesson(event) {
    event.preventDefault();
    if (!token) {
      return;
    }

    setIsCreatingLesson(true);
    setError('');
    try {
      await coursesService.createLesson(
        courseId,
        {
          title,
          content,
          position: Number(position)
        },
        token
      );
      setTitle('');
      setContent('');
      setPosition(1);
      const lessonsData = await coursesService.listLessons(courseId, { token });
      setLessons(lessonsData.lessons || []);
    } catch (apiError) {
      setError(apiError.message || 'No se pudo crear la leccion');
    } finally {
      setIsCreatingLesson(false);
    }
  }

  if (isLoading) {
    return <p className="muted">Cargando curso...</p>;
  }

  if (!course) {
    return <p className="error-text">No se encontro el curso.</p>;
  }

  return (
    <section className="stack-lg">
      <Card variant="elevated">
        <div className="stack-sm">
          <h1>{course.title}</h1>
          <p className="muted">{course.description || 'Sin descripcion'}</p>
          <p className="muted">
            Instructor: {course.instructorName} | Estado:{' '}
            {course.isPublished ? 'Publicado' : 'Borrador'}
          </p>
        </div>

        {isStudent && (
          <div className="stack-sm" style={{ marginTop: '1rem' }}>
            {!isEnrolled ? (
              <Button onClick={handleEnroll} disabled={isEnrolling || !course.isPublished}>
                {isEnrolling ? 'Inscribiendo...' : 'Inscribirme'}
              </Button>
            ) : (
              <p className="success-text">Inscripto en el curso</p>
            )}

            {progress && (
              <p className="muted">
                Progreso: {progress.completedLessons}/{progress.totalLessons} (
                {progress.progressPercent}%)
              </p>
            )}
          </div>
        )}
      </Card>

      {canManageCourse && (
        <Card variant="soft">
          <h2>Agregar leccion</h2>
          <form className="stack-md" onSubmit={handleCreateLesson}>
            <Input
              id="lesson-title"
              label="Titulo"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <label className="field">
              <span className="field-label">Contenido</span>
              <textarea
                className="input textarea"
                rows={4}
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </label>
            <Input
              id="lesson-position"
              type="number"
              min={1}
              label="Posicion"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
              required
            />
            <Button type="submit" disabled={isCreatingLesson}>
              {isCreatingLesson ? 'Guardando...' : 'Guardar leccion'}
            </Button>
          </form>
        </Card>
      )}

      <Card>
        <h2>Lecciones</h2>
        {lessons.length === 0 ? (
          <p className="muted">No hay lecciones todavia.</p>
        ) : (
          <ul className="lesson-list">
            {lessons.map((lesson) => (
              <li key={lesson.id} className="lesson-item">
                <div className="stack-sm">
                  <strong>
                    {lesson.position}. {lesson.title}
                  </strong>
                  <p className="muted">{lesson.content || 'Sin contenido'}</p>
                </div>
                {isStudent && isEnrolled && (
                  <label className="inline-check">
                    <input
                      type="checkbox"
                      checked={Boolean(progressByLesson.get(lesson.id))}
                      onChange={(event) => toggleLessonProgress(lesson.id, event.target.checked)}
                    />
                    <span>Completada</span>
                  </label>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
