import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { dashboardService } from '../api/services';
import { useAuth } from '../hooks/useAuth';

export default function StudentDashboardPage() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError('');
      try {
        const data = await dashboardService.student(token);
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
      <h1>Mi Dashboard</h1>
      <div className="grid-cards">
        <Card variant="elevated">
          <h2>Cursos inscriptos</h2>
          <p className="metric-value">{dashboard?.totalEnrollments || 0}</p>
        </Card>
        <Card variant="elevated">
          <h2>Promedio de progreso</h2>
          <p className="metric-value">{dashboard?.averageProgress || 0}%</p>
        </Card>
      </div>

      <Card>
        <h2>Progreso por curso</h2>
        {!dashboard?.courses?.length ? (
          <p className="muted">Todavia no estas inscripto en cursos.</p>
        ) : (
          <ul className="stack-sm">
            {dashboard.courses.map((course) => (
              <li key={course.courseId}>
                <strong>{course.title}</strong> - {course.progressPercent}% ({course.completedLessons}/
                {course.totalLessons}) - <Link to={`/courses/${course.courseId}`}>Abrir curso</Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
