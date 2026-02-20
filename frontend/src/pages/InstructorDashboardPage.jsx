import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { dashboardService } from '../api/services';
import { useAuth } from '../hooks/useAuth';

export default function InstructorDashboardPage() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError('');
      try {
        const data = await dashboardService.instructor(token);
        setDashboard(data);
      } catch (apiError) {
        setError(apiError.message || 'No se pudo cargar el dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [token]);

  if (isLoading) {
    return <p className="muted">Cargando dashboard...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <section className="stack-lg">
      <h1>Dashboard Instructor</h1>
      <div className="grid-cards">
        <Card variant="elevated">
          <h2>Cursos</h2>
          <p className="metric-value">{dashboard?.totalCourses || 0}</p>
        </Card>
        <Card variant="elevated">
          <h2>Alumnos totales</h2>
          <p className="metric-value">{dashboard?.totalStudents || 0}</p>
        </Card>
      </div>
      <Card>
        <h2>Alumnos por curso</h2>
        {!dashboard?.courses?.length ? (
          <p className="muted">No hay cursos para mostrar.</p>
        ) : (
          <ul className="stack-sm">
            {dashboard.courses.map((course) => (
              <li key={course.courseId}>
                <strong>{course.title}</strong> - {course.studentsCount} alumnos (
                {course.isPublished ? 'Publicado' : 'Borrador'})
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
