import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { coursesService } from '../api/services';
import { useAuth } from '../hooks/useAuth';

export default function CoursesPage() {
  const { token, user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [mineOnly, setMineOnly] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canCreateCourse = isAuthenticated && ['admin', 'instructor'].includes(user?.role);
  const canFilterMine = isAuthenticated && user?.role === 'instructor';

  useEffect(() => {
    async function loadCourses() {
      setIsLoading(true);
      setError('');
      try {
        const data = await coursesService.list({
          token: token || undefined,
          mine: canFilterMine && mineOnly
        });
        setCourses(data.courses || []);
      } catch (apiError) {
        setError(apiError.message || 'No se pudieron cargar los cursos');
      } finally {
        setIsLoading(false);
      }
    }

    loadCourses();
  }, [token, mineOnly, canFilterMine]);

  async function handleCreateCourse(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await coursesService.create(
        {
          title,
          description,
          isPublished
        },
        token
      );
      setTitle('');
      setDescription('');
      setIsPublished(false);
      const data = await coursesService.list({
        token: token || undefined,
        mine: canFilterMine && mineOnly
      });
      setCourses(data.courses || []);
    } catch (apiError) {
      setError(apiError.message || 'No se pudo crear el curso');
    } finally {
      setIsSubmitting(false);
    }
  }

  const summary = useMemo(() => {
    const published = courses.filter((course) => course.isPublished).length;
    return {
      total: courses.length,
      published
    };
  }, [courses]);

  return (
    <section className="stack-lg">
      <header className="page-header">
        <div className="stack-sm">
          <h1>Cursos</h1>
          <p className="muted">
            Total: {summary.total} | Publicados: {summary.published}
          </p>
        </div>
        {canFilterMine && (
          <label className="inline-check">
            <input
              type="checkbox"
              checked={mineOnly}
              onChange={(event) => setMineOnly(event.target.checked)}
            />
            <span>Mostrar solo mis cursos</span>
          </label>
        )}
      </header>

      {canCreateCourse && (
        <Card variant="elevated">
          <h2>Crear curso</h2>
          <form className="stack-md" onSubmit={handleCreateCourse}>
            <Input
              id="new-course-title"
              label="Titulo"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <label className="field">
              <span className="field-label">Descripcion</span>
              <textarea
                className="input textarea"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
            <label className="inline-check">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(event) => setIsPublished(event.target.checked)}
              />
              <span>Publicar inmediatamente</span>
            </label>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear curso'}
            </Button>
          </form>
        </Card>
      )}

      {error && <p className="error-text">{error}</p>}

      {isLoading ? (
        <p className="muted">Cargando cursos...</p>
      ) : courses.length === 0 ? (
        <Card variant="soft">
          <p>No hay cursos para mostrar.</p>
        </Card>
      ) : (
        <div className="grid-cards">
          {courses.map((course) => (
            <Card key={course.id} variant="soft">
              <div className="stack-sm">
                <h3>{course.title}</h3>
                <p className="muted">{course.description || 'Sin descripcion'}</p>
                <p className="muted">
                  Instructor: {course.instructorName} | Alumnos: {course.enrolledStudents}
                </p>
                <p className="muted">
                  Estado: {course.isPublished ? 'Publicado' : 'Borrador'}
                </p>
                <Link to={`/courses/${course.id}`}>Ver detalle</Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
